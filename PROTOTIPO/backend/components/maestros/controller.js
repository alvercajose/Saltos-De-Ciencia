const storage = require('./storage');

function insertar_maestro( dato ) {
    return new Promise( (resolve, reject) => {
        if ( !dato.nombre || !dato.apellido || !dato.email || !dato.clave || !dato.fecha_nacimiento ) {
            reject( 'Los datos se encuentran incompletos.' )
        } else {
            resolve( storage.insertar( dato ) )
        }
    } )
}

function iniciar_sesion(dato) {
    return new Promise(async (resolve, reject) => {
        const { email, clave } = dato;

        if (!email || !clave) {
            return reject('El email y la clave son obligatorios.');
        }

        try {
            // Buscar al usuario por email
            const maestro = await storage.buscarPorEmail(email);
            if (!maestro) {
                return reject('Usuario no encontrado.');
            }

            if (maestro.clave !== clave) {
                return reject('Clave incorrecta.');
            }

            resolve({ message: 'Inicio de sesión exitoso.', maestro });
        } catch (error) {
            reject('Error al iniciar sesión.');
        }
    });
}
module.exports = {
    insertar_maestro,
    iniciar_sesion
}