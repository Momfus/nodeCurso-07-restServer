// Archivo de configuracion para producción o desarrollo.


// --> process // es un objeto global que esta corriendo todo el tiempo en node.js y es actualizado según el environment (entorno) que est acorriendo actualmente


// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000; // Variable global que defino y toma el puerto que esta desplegable según heroku que lo actualiza por nosotros, sino localmente será 3000 (para desarrollo)

