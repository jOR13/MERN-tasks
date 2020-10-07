const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extraer email y password
  const { email, password } = req.body;

  try {
    //revisar que el user reg sea unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res
        .status(400)
        .json({ msg: "El usuario " + usuario.email + " ya existe" });
    }

    //crea el nuevo user
    usuario = new Usuario(req.body);

    //hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //console.log(usuario.password);

    //guardar ususario
    await usuario.save();

    //Crear y firmar el JWT
    const payload = {
        usuario: {
            id: usuario.id
        }
    };

    //Firmar el jwt
    jwt.sign(payload,process.env.SECRETA,{
        expiresIn: 3600, //Una hora 
      }, (error, token) => {
        if (error) throw error;
        res.json({ token });
      });
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error: " + error);
  }
};
