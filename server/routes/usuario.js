
const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt'); //: para encriptar la contraseña de forma segura con una función hash, se utilza "npm i bcrypt"
const _ = require('underscore'); // La libreria underscore agrega mas de 100 funcionalidades a javascript que son muy útiles y agilizan el trabajo como "pickl" que devuelve una copia de un objeto con los campos que quiero (se le suele colocar de nombre _ por convención)

const app = express();



app.get('/usuario', function (req, res) {
    

    let desde = req.query.desde || 0; // Usar el parámetro recibido, sino desde el principio de la lista
    desde = Number(desde); // ya que el anterior comando lo hace string

    let limite = req.query.limite || 5; // Traer el parámetro o simplemente 5
    limite = Number(limite);

    // Regresar todos los usuarios de la DB con condiciones
    Usuario.find({  }, 'nombre email role estado google img') // Primer argumento es condiciones y el segundo los campos que queremos ver (el id siempre va a estar)
            .skip(desde) // se salta los primeros 5
            .limit(limite) // trae los siguientes 5 luego del salto
            .exec( (err, usuarios) => {

                // Si hay algun error, mostrar el problema sino seguir normalmente
                if( err ) {
                    return res.status(400).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                                    ok: false,
                                    err
                                });
                }

                Usuario.countDocuments ({}, (err, conteo) => { // Retornar el número de registros de la colección usuario.
            
                    res.json({
            
                        ok: true,
                        usuarios,
                        cuantos: conteo
            
                    });
                });


            });

});


app.post('/usuario', function (req, res) {

    let body = req.body;


    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ), // Texto plano y numero de vueltas realizadas al encriptar el hash
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

        // usuarioDB.password = null; // Una forma de quitar el password para que no se muestre al usuario al mandarse el post (pero se guarda en la bd)

        res.json({

            ok: true,
            usuario: usuarioDB

        });

    });



});


app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    // let body = req.body;
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );

    

    // Una forma para que no se actualicen datos que no quiero que se hagan (pero es poco eficiente), se puede usar la libreria "npm install underscore --save"
    /*
    delete body.password;
    delete body.gooogle;
    */

    // Una forma de hacerlo para actualizar la BD del usuario
    // El tercer argumento son las opciones, decir "new: true" hace que la respuesta devuelva el objeto modificado
    // runValidators hace que se tome en cuenta las validaciones definidas
    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, ( err, usuarioDB ) => { // Permite hacerlo más rapido que findById pero tiene menos control sobre el manejo de errores

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

app.delete('/usuario', function (req, res) { 
    res.json('delete usuario');
});


// De esta manera puede usarse
module.exports = app;