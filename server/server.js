require('./config/config'); // Trae la configuración establecida primero

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // para manejar los cuerpos de servicios REST (middlewares, cada petición pasa por las dos lineas de abajo)
 
//#region Configuraciones del parser middleware

  // Cada petición que se haga por express pasa por esas lineas de bodyParser)

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // parse application/json
  app.use(bodyParser.json())

//#endregion

//#region Peticiones Get, Post, Put y Delete

  app.get('/usuario', function (req, res) {
    res.json('get usuario');
  });


  app.post('/usuario', function (req, res) {
    
    let body = req.body;

    // Si no viene un nombre, quiero mostrar un bad request
    if( body.nombre === undefined ) {

      res.status(400).json({

        ok: false,
        mensaje: 'El nombre es necesario',

      });

    } else {
      
      res.json({
        body
      });

    }

  });


  app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    res.json({

      id

    });

  });

  app.delete('/usuario', function (req, res) { // No se acostumbra a borrar, sino cambiar el estado del registro para que no esté disponible
    res.json('delete usuario');
  });

//#endregion

app.listen( process.env.PORT , () => {

    console.log('Escuchando puerto: ', process.env.PORT);
    

});