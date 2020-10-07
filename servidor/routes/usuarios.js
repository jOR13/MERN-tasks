// Rutas pra crear usuarios
const express = require ('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const { check } = require('express-validator')
//Crea un usuario
//api/usuarios

router.post('/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email tiene que ser valido').isEmail(),
    check('password', 'La contraseña debe de tener 6 caracteres como minimo').isLength({min: 6})
],
    usuarioController.crearUsuario
);

module.exports = router;