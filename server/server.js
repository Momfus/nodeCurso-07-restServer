require('./config/config'); // Trae la configuración establecida primero


const express = require('express');
const moongoose = require('mongoose'); // Paquete para establecer conexión con la base de datos mongoDb

const app = express();
const bodyParser = require('body-parser'); // para manejar los cuerpos de servicios REST (middlewares, cada petición pasa por las dos lineas de abajo)
 

//#region Configuraciones del parser middleware

  // Cada petición que se haga por express pasa por esas lineas de bodyParser)

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

//#endregion

// Configuración global de rutas
app.use( require('./routes/index') ); 

// Abrir conexión con la BD
moongoose.connect( process.env.URLDB, //conexión y su url a la base de datos (ver archivo config)
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