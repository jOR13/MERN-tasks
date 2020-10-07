const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

 
  //extraer email y password
  const { email, password } = req.body;

  try {
    
    //revisar que sea un usuario registrado
    let usuario =  await Usuario.findOne({ email });
    if (!usuario) {
        return res.status(400).json({msg: 'El usuario no existe'});
    }

    //Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);

    if(!passCorrecto){
        return res.status(400).json({msg: 'Password Incorrecto'})
    }
    
    //Crear y firmar el JWT
    const payload = {
        usuario: {
            id: usuario.id
        }
    };

    //Si todo es correcto
    //Firmar el jwt
    jwt.sign(payload,process.env.SECRETA,{
        expiresIn: 3600, //Una hora 
      }, (error, token) => {
        if (error) throw error;
        res.json({ token });
      });
    

  } catch (error) {
     console.log(error); 
  }

  
}