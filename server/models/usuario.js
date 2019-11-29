const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // npm install --save mongoose-unique-validator (mas user friendly)

let rolesValidos = {

  values: ['ADMIN_ROLE', 'USER_ROLE']  ,
  message: '{VALUE} no es un rol válido'

};

// Definir y crear un nuevo esquema de usuario con los campos que tendrá la colección y restricciones
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] // Si quiero un mensaje personalizado lo marco así, sino se coloca nomás el valor sin corchetes (required: true)
    },

    email: {
        type: String,
        unique: true, // Para que la información sea única en todos los datos (esta propiedad puede instalarse con npm install --save mongoose-unique-validator)
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

        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos  // Validación adicional para que entre en valores correctos (y no sea un rol cualquiera). Fueron señalados más arriba los roles válidos
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

// Una forma mejor para esconder la contraseña para mostrarla al hacer post o get
usuarioSchema.methods.toJSON =  function() { // toJSON siempre se llama (no se usa función flecha porque requerimos el "this")

    let user = this;
    let userObject = user.toObject();
    
    delete userObject.password; // luego de convertirlo a objeto el JSON, ahora si puede quitarse el campo de password

    return userObject;

}; 

// para indicar que el schema usa un plugin personalizado (Con un mensaje personalizado)
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } ); 

// Se exporta el modelo para su uso en la BD
module.exports = mongoose.model( 'Usuario', usuarioSchema ); // Nombre del modelo y valores del mismo (schema)