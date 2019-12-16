const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

// NOTA: para manejar una imagen gurdada con un link (como la de autentificacióm) con un pipe desde el front

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;    
    let img = req.params.img;    


    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ img }` );

    if( fs.existsSync( pathImagen ) ) {
        
        res.sendFile( pathImagen );

    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);

    }


});

module.exports = app;