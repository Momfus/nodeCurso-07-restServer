const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Libreria node para realizar el json web token

//#region Para el manejo del login de google

    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(process.env.CLIENT_ID);

//#endregion

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


// Configuraciones de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,    // Specify the CLIENT_ID of the app that accesses the backend
                                            // Or, if multiple clients access the backend:
                                            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    /*
    // Para obtener la información obtenida de estar todo correctamente
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    */

}

// Ruta de identificación para obtener token de loguearse con google
app.post('/google', ( req, res ) => {

    let token = req.body.idtoken;
    
    verify( token );

    res.json({

        token

    });

    // Para validar el token en node.js se usa el paquete: npm install google-auth-library --save

});

module.exports = app;