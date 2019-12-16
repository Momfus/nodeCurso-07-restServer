const express = require('express');
const fileupload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// Paquetes que existen por defecto en nodeJs
const fs = require('fs');
const path = require('path');

// default options
app.use (fileupload() );

app.put('/upload/:tipo/:id', function(req, res) { // es /upload que es la ruta, no confundir con el plural usado para donde se guardan los archivos (/uploads)

    // tipo es si es para productos o usuarios

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Si no se recibe un archivo para subir
    if( !req.files ){
        return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'NO se ha seleccionado ningun archivo'
                        }
                    })
    }

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    
    if( tiposValidos.indexOf(tipo) < 0 ) {

        return res.status(400).json({

            ok: false,
            err: {
                message: 'Los tipos permitidos son '  + tiposValidos.join(', '), // Cada element se une con una coma entre medio
            }

        });

    }

    // Nombre que se le va colocar cuando se haga un input (del body)
    let archivo = req.files.archivo; 
    
    // Obtener la extensión
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
    
    // Extensiones permitidas
    let extensioneValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Si es menor a cero quiere decir que no encontró esa extensión válida en el archivo
    if( extensioneValidas.indexOf( extension ) < 0 ) {

        return res.status(400).json({

            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensioneValidas.join(', '), 
                ext: extension
            }

        });

    }

    // Cambiar nombre de archivo para hacerlo único
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Subir archivo
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, ( err ) => {

        // Si hay un error en la conexión con el servidor
        if( err ) {
            return res.status(500).json({

                ok: false,
                err

            });
        }



        // En caso de éxito al subirlo
        if( tipo === 'usuarios') {
            imagenUsuario( id, res, nombreArchivo );
        } else {

            imagenProducto( id, res, nombreArchivo );

        }

    });

});


function imagenUsuario( id, res, nombreArchivo ) {

    Usuario.findById(id, (err, usuarioDB) => {

        // En caso de error de conexión
        if( err ) {

            borrarArchivo( nombreArchivo, 'usuarios' ); // Borra el recién subido al haber un error y no llenar el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });

        }

        // Verificar que existe el usuario
        if( !usuarioDB ) {

            borrarArchivo( nombreArchivo, 'usuarios' ); // Borra el recién subido al haber un error y no llenar el servidor de basura

            return res.status(400).json({

                
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }

            });
        }

        // Verificar ruta de archivo
        borrarArchivo( usuarioDB.img, 'usuarios' );

        // Actualizar imagen del usuario
        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({

                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            });

        });

    });

}

function imagenProducto( id, res, nombreArchivo ) {

    Producto.findById( id, (err, productoDB) => {

        // En caso de error de conexión
        if( err ) {

            borrarArchivo( nombreArchivo, 'productos' ); // Borra el recién subido al haber un error y no llenar el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });

        }

        // Verificar que existe el PRODUCTO
        if( !productoDB ) {

            borrarArchivo( nombreArchivo, 'productos' ); // Borra el recién subido al haber un error y no llenar el servidor de basura

            return res.status(400).json({

                
                ok: false,
                err: {
                    message: 'Producto no existe'
                }

            });
        }

        // Verificar ruta de archivo
        borrarArchivo( productoDB.img, 'productos' );

        // Actualizar imagen del usuario
        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {

            res.json({

                ok: true,
                producto: productoGuardado,
                img: nombreArchivo

            });

        });


    });

}


function borrarArchivo( nombreImagen, tipo ) {
    
    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );
        
    if( fs.existsSync( pathImagen ) ) { // En caso que exista el path, se borra para mantener única la imagen

        fs.unlinkSync( pathImagen);

    }

}

module.exports = app;