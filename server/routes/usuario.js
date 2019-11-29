
const express = require('express');
const Usuario = require('../models/usuario');

const app = express();



app.get('/usuario', function (req, res) {
    res.json('get usuario');
  });


app.post('/usuario', function (req, res) {

    let body = req.body;


    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role

    });

    // Grabarlo en la BD
    usuario.save( (err, usuarioDB) => {

        // Si hay algun error, mostrar el problema sino seguir normalmente
        if( err ) {
            return res.status(400).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                            ok: false,
                            err
                        });
        }

        res.json({

            ok: true,
            usuario: usuarioDB

        });

    });



});


app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    res.json({

        id

    });

});

app.delete('/usuario', function (req, res) { 
    res.json('delete usuario');
});


// De esta manera puede usarse
module.exports = app;