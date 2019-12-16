const jwt = require('jsonwebtoken');

// =======================
// Verificar Token
// =======================

let verificaToken = ( req, res, next ) => { // Next continuaría la continuación del programa

    let token = req.get('token'); //obtener los headers

    // console.log(token); // probar que se esta realizando el token

    // Verificar que el token es válido (el segundo seria la semilla que lo tenemos como variable de entorno)
    jwt.verify( token, process.env.SEED, (err, decoded) => { // decode es la información decodificada

        // Manejo de error
        if( err ) {
            return res.status(401).json({ // status de no autorizado

                ok:false,
                err: {
                    message: 'Token no válido'
                }

            });
        }

        // Cualquier petición tiene acceso a la información del usuario habiendo pasado la verificación del token
        req.usuario = decoded.usuario;

        next(); // Sigue con lo que venia de la función que lo usa
    
    });
};

// =======================
// Verificar AdminRole
// =======================

// Tarea: un middleware que haga que solo los que son ADMIN_ROLE puedan usar el servicio que lo usa
let verificaAdmin_Role = (req, res, next ) => {

    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE' ) {

        next();

    } else {

        // Manejo de error
        res.json({

            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }

        });

        // No se llama al next porque no se desea continuar el código de haber error y no tener acceso

    }

};

// ============================
// Verificar token para imagen
// ============================
let verificaTokenImg = (req, res, next ) => {

    let token = req.query.token;

    // Verificar que el token es válido (el segundo seria la semilla que lo tenemos como variable de entorno)
    jwt.verify( token, process.env.SEED, (err, decoded) => { // decode es la información decodificada

        // Manejo de error
        if( err ) {
            return res.status(401).json({ // status de no autorizado

                ok:false,
                err: {
                    message: 'Token no válido'
                }

            });
        }

        // Cualquier petición tiene acceso a la información del usuario habiendo pasado la verificación del token
        req.usuario = decoded.usuario;

        next(); // Sigue con lo que venia de la función que lo usa
    
    });
};


module.exports = {

    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg

};