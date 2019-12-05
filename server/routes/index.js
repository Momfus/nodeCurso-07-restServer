
const express = require('express');

const app = express();


// importamos y usamos las rutas del usuario en app (luego de la configuración de los middleware)
app.use( require('./usuario') ); 
app.use( require('./login') );


module.exports = app;