// Archivo de configuracion para producción o desarrollo.


// --> process // es un objeto global que esta corriendo todo el tiempo en node.js y es actualizado según el environment (entorno) que est acorriendo actualmente


// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000; // Variable global que defino y toma el puerto que esta desplegable según heroku que lo actualiza por nosotros, sino localmente será 3000 (para desarrollo)


// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Si la base de datos no existe, suponemos que estamos en desarrollo

// ========================================
// Base de datos
// ========================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URL;

}

process.env.URLDB = urlDB;