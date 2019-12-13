const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// =============================
// Borrado lógico de un producto
// =============================
app.delete('/producto/:id', verificaToken, (req, res) => {

    // Borrado lógico
    // Indicar que si su estado es false, que el producto no está disponible
    let id = req.params.id;

    Producto.findById( id, (err, productoDB) => {

        // Error de conexión
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si no existe el producto
        if( !productoDB ) {
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'El ID no existe'
                }

            });
        }

        // Si existe y esta todo bien, se cambia el estado (borrado lógico)
        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) => {

            // Error de conexión (raro pero por cualquier cosa si hay algo cuando se guarda)
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Se guarda todo bien
            res.json({
                ok: true,
                producto: productoBorrado,
                mensajje: 'Producto borrado (lógico)'
            });

        });

    });

});

// =============================
// Obtener todos los productos
// =============================
app.get('/producto', verificaToken, (req, res) => {

    // Traer todos los productos
    // populate: usuario y categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find( { disponible: true } )
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {
        
                // Si hay algun error, mostrar el problema sino seguir normalmente
                if( err ) {
                    return res.status(500).json({ // debe devolverse así no sigue con el resto del código (sino causa error por enviar dos respuestas)
                                    ok: false,
                                    err
                                });
                }

                Producto.countDocuments( (err, conteo) => {

                    res.json({
                        ok: true,
                        productos,
                        cuantos: conteo
                    })

                });

            });

});

// =============================
// Obtener un producto por ID
// =============================
app.get('/producto/:id', verificaToken, (req, res) => {

    // Traer un producto por ID
    // populate: usuario y categoria

    let id = req.params.id;
    
    Producto.findById( id )
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productoDB) =>{

                // Error de conexión
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                // Si no existe el producto
                if( !productoDB ) {
                    return res.status(400).json({

                        ok: false,
                        err: {
                            message: 'El ID no existe'
                        }

                    });
                }

                // Si existe y esta todo bien
                res.json({

                    ok:true,
                    producto: productoDB

                });

            }); 

});

// =============================
// Crear un nuevo producto
// =============================
app.post('/producto', verificaToken, (req, res) => {

    // Grabar el usuario
    // Grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    producto.save( (err, productoDB) => {

        // Error de conexión
        if( err ) {
            return res.status(500).json({

                ok: false,
                err

            });
        }
        
        // Si existe y esta todo bien
        res.status(201).json({ // Por costumbre se usa el status 201 para señalar creación exitosa
            ok: true,
            producto: productoDB
        });

    });

});

// =============================
// Modificar el producto por ID
// =============================
app.put('/producto/:id', verificaToken, (req, res) => {

    // modificiar el producto
    let id = req.params.id;
    let body = req.body;

    Producto.findById( id, (err, productoDB) => {

        // Error de servidor
        if( err ) {
            return res.status(500).json({

                ok: false,
                err

            });
        }

        // Si no existe el producto
        if( !productoDB ) {
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'El ID no existe'
                }

            });
        }

        // Guardar la información nueva
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
    
        productoDB.save( (err, productoGuardado) => {

            // Error de servidor
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });


        });

    });

});


module.exports = app;