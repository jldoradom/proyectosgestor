const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator'); 
const jwt = require('jsonwebtoken');

// Funcion para crear usuarios
exports.crearUsuario = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer email y password 
    const { email, password } = req.body;
    try {
        // Revisar que el usuario registrado sea unico
        let  usuario = await Usuario.findOne({ email });
        // Si encuentar un usuario con ese mismo email
        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crea el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password, creamos un salt para sean siempre diferentes aunque se repitan los password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        
        // Guardar el nuevo usuario
        await usuario.save();

        // Crear y firmar el JWT///////

        // Informacion que llevara el token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora de duracion del token
        }, (error, token) => {
            if(error) throw error;

            // Respuesta con el token de creacion del usuario
            res.json({ token });
        });

      

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}