// Rutas pra autenticar ususarios
const express = require ('express');
const router = express.Router();
const { check } = require('express-validator')
const authController = require('../controllers/authController')



//api/auth

router.post('/',
[
    check('email', 'El email tiene que ser valido').isEmail(),
    check('password', 'La contraseña debe de tener 6 caracteres como minimo').isLength({min: 6})
],
authController.autenticarUsuario
);

module.exports = router;