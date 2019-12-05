const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Libreria node para realizar el json web token


const Usuario = require('../models/usuario');
const app = express();

app.post('/login', ( req, res ) => {

    let body = req.body;

    // Encontrar al usuario que corresponda al mismo email
    Usuario.findOne( { email: body.email }, ( err, usuarioDB ) => {

        //#region Manejo de errores

            // Si hay error con la conexion con el servidor
            if( err ) {
                return res.status(500).json({ 
                                ok: false,
                                err
                            });
            }

            // Si hay error si el usuario no existe
            if( !usuarioDB ) {

                return res.status(400).json({
                    ok:false,
                    err: {
                        message: '*Usuario o contraseña incorrectos'
                    }
                });

            }

            // Comaprar contraseña y ver si matchea con la que se encripto
            if( bcrypt.compareSync( body.password, usuarioDB.password ) ) {
    
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Usuario o *contraseña incorrectos'
                    }
                });
    
            }
            
        //#endregion
            
        let token = jwt.sign({
            usuario: usuarioDB //el payload (data)
        }, process.env.SEED
        , { expiresIn: process.env.CADUCIDAD_TOKEN }); // Expira en segundos * minutos * horas * dias (un mes en este caso)

        res.json({

            ok: true,
            usuario: usuarioDB,
            token // igual que hacer token: token (del que esta arriba)

        });

    });


});


module.exports = app;