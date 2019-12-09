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
// Vencimiento del token
// ========================================
// 60 segundos 
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 *30;

// ========================================
// SEED (semilla de autentificación)
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; // usar la variable de heroku si esta en producción sino usar el string como semilla de desarrollo

// ========================================
// Base de datos
// ========================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URL;

}

// ========================================
// Google ClIENT ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '615848462117-9uhe5597f6qnbommk2gsobc5nv7ss1t7.apps.googleusercontent.com'; // El segundo lo saco del panel de developer de google con el API

process.env.URLDB = urlDB;