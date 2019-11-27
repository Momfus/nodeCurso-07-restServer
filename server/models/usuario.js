const mongoose = require('mongoose');

// Definir y crear un nuevo esquema de usuario con los campos que tendrá la colección y restricciones
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] // Si quiero un mensaje personalizado lo marco así, sino se coloca nomás el valor sin corchetes (required: true)
    },

    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },

    password: {

        type: String,
        required: [true, 'La contraseña es obligatoria']

    },

    img:  {
        type: String,
        required: false // O puede no ponerse el required (por defecto es false)
    },

    role: {

        default: 'USER_ROLE'

    },
    
    estado: {

        type: Boolean,
        default: true

    },

    google: {

        type: Boolean,
        default: false

    }

});


// Se exporta el modelo para su uso en la BD

module.exports = mongoose.model( 'Usuario', usuarioSchema ); // Nombre del modelo y valores del mismo (schema)