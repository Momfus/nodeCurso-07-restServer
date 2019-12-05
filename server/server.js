require('./config/config'); // Trae la configuración establecida primero


const express = require('express');
const moongoose = require('mongoose'); // Paquete para establecer conexión con la base de datos mongoDb

const app = express();
const bodyParser = require('body-parser'); // para manejar los cuerpos de servicios REST (middlewares, cada petición pasa por las dos lineas de abajo)
 

/* 
    MongoDb URL 
    - Usando mongoDb atlas se puede generar un usuario, en mi ejemplo: " user: test; pass: NODxG6aKAjGxRlRm" (ver video 106 que se explica)
    - cluster0-klubu.mongodb.net/   (explicado en video 107)
*/

//#region Configuraciones del parser middleware

// Cada petición que se haga por express pasa por esas lineas de bodyParser)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//#endregion

app.use( require('./routes/usuario') ); // importamos y usamos las rutas del usuario en app (luego de la configuración de los middleware)

// Abrir conexión con la BD
moongoose.connect( 'mongodb+srv://test:NODxG6aKAjGxRlRm@cluster0-klubu.mongodb.net/cafe', //'mongodb://localhost:27017/cafe', //conexión y su url a la base de datos (la segunda comentada es si fuera local)
                  {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true}, // configuraciones extras sobre una actualizacion de mongo 
                  (err, res) =>{  // callback por si hay una conexión válida o no

                      if( err ){ 
                        throw 'err';
                      }

                      console.log('Base de datos ONLINE');
                      


                    } ); 

app.listen( process.env.PORT , () => {

    console.log('Escuchando puerto: ', process.env.PORT);
    

});