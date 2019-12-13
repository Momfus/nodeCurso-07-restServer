const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res) => {

    // NOTA: Recordar que se hace borrado físico, no lógico, asi que no hace falta poner un estado en sus atributos
    Categoria.find( {} ) // No hay una condición de búsqueda así que el objeto es vacio
                .populate('usuario', 'nombre email') // Trae la información del id señalado como "usuario"  en el json (el segundo parámetro indico los atributos que me interesan, si no lo coloco trae todos / el password desde el modelo de usuario no dejamos que se muestre)
                .sort('descripcion') // ordenar alfabeticamente según el parámetro descripción
                .exec( (err, categorias) => {

                    // Si hay algun error, mostrar el problema sino seguir normalmente
                    if( err ) {
                        return res.status(400).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                                        ok: false,
                                        err
                                    });
                    }

                    Categoria.countDocuments( (err, conteo) =>{

                        res.json({

                            ok: true,
                            categorias,
                            cuantos: conteo

                        });

                    });

                });

});


// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    // Categoria.findById(...)    ;
    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB) =>{

        // Si hay algun error, mostrar el problema sino seguir normalmente
        if( err ) {
            return res.status(500).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                        ok: false,
                        err
                        });
        }

        
        // Si no existe la categoria buscada
        if( !categoriaDB ) {
            return res.status(500).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                            ok: false,
                            err: {
                                message: 'El ID es incorrecto'
                            }
                        });
        }
        

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    });

});

// =============================
// Crear nueva categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;
    
    let categoria =  new Categoria({

        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    

    //Grabar en la BD
    categoria.save( (err, categoriaDB) => {

        
        // Error de conexión

        if( err ) {
            return res.status(500).json({ 
                            ok: false,
                            err
                        });
        }

        // Error si no pudo crear la categoriaDB
        if( !categoriaDB ) {
            return res.status(400).json({ 
                            ok: false,
                            err
                        });
        }

        res.json({

            ok: true,
            categoria: categoriaDB

        });

    });

});


// =============================
// Actualizar categoria
// =============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    
    let body = req.body;

    let descripcionCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descripcionCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

        // Si hay algun error, mostrar el problema sino seguir normalmente
        if( err ) {
            return res.status(500).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                            ok: false,
                            err
                        });
        }

        // De no existir en la base de datos
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            
            ok: true,
            categoria: categoriaDB

        });

    } );
        

});


// =============================
// Borrar categoria
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // solo un administrador puede borrar categorias 
    // Categoria.finByIdAndRemove --> se borra fisicamente

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, {useFindAndModify: false}, (err, categoriaDB) => {

        // Si hay algun error, mostrar el problema sino seguir normalmente
        if( err ) {
            return res.status(400).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                            ok: false,
                            err: {
                                message: 'Categoria no encontrada'
                            }
                        });
        }

        // En caso que no exista la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({

            ok: true,
            message: 'Borrado físico realizado con éxito'

        });

    });

});

module.exports = app;