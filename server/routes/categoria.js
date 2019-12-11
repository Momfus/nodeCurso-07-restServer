const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', (req, res) => {



});


// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', (req, res) => {

    // Categoria.findById(...)    ;

});

// =============================
// Crear nueva categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoria
    // req.usuario._id


});


// =============================
// Actualizar categoria
// =============================
app.put('/categoria/:id', (req, res) => {

    

});


// =============================
// Borrar categoria
// =============================
app.delete('/categoria/:id', (req, res) => {

    // solo un administrador puede borrar categorias 
    // Categoria.finByIdAndRemove --> se borra fisicamente

});

module.exports = app;