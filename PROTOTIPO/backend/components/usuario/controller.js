const storage = require('./storage')

function insertar_usuario( dato ) {
    return new Promise( (resolve, reject) => {
        if ( !dato.nombre || !dato.apellido || !dato.curso || !dato.paralelo || !dato.puntaje) {
            reject( 'Los datos se encuentran incompletos.' )
        } 
        
        if (dato.puntaje === undefined) {
            dato.puntaje = 0;
        }
        
        else {
            resolve( storage.insertar( dato ) )
        }
    } )
}

async function obtener_estudiantes() {
    return new Promise((resolve, reject) => {
        storage.obtener_estudiantes({})
            .then((resultados) => {
                //console.log('Resultados obtenidos:', resultados);
                resolve(resultados); // Devuelve todos los registros
            })
            .catch((error) => reject(`Error al obtener usuarios: ${error.message}`));
    });
}


async function obtener_usuario() {
    return new Promise((resolve, reject) => {
        storage.obtener({}) // Llama a la función sin filtro
            .then((resultados) => {
                //console.log('Resultados obtenidos:', resultados); // Agrega un log para depuración
                if (resultados.length > 0) {
                    // Ordena por fecha_creacion en orden descendente y toma el primer resultado
                    const ultimoRegistro = resultados.sort((a, b) => b.fecha_creacion - a.fecha_creacion)[0];
                    //console.log('Último registro:', ultimoRegistro); // Agrega un log para depuración
                    // Devuelve solo el nombre y el apellido
                    const resultadoFiltrado = {
                        nombre: ultimoRegistro.nombre,
                        apellido: ultimoRegistro.apellido,
                        paralelo: ultimoRegistro.paralelo,
                        puntaje: ultimoRegistro.puntaje
                    };
                    console.log('final:', resultadoFiltrado);
                    resolve(resultadoFiltrado);
                } else {
                    reject('No se encontraron registros');
                }
            })
            .catch((error) => reject(error));
    });
}

// En controller.js - Modificar la función actualizar_puntaje
async function actualizar_puntaje(nuevoPuntaje) {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtener el último usuario
            const ultimoUsuario = await storage.obtener({});
            
            if (!ultimoUsuario || ultimoUsuario.length === 0) {
                reject('No se encontraron usuarios');
                return;
            }

            // Obtener el usuario más reciente
            const usuarioReciente = ultimoUsuario.sort((a, b) => 
                b.fecha_creacion - a.fecha_creacion
            )[0];

            if (!usuarioReciente) {
                reject('No se pudo encontrar el usuario más reciente');
                return;
            }

            // Validar que el puntaje sea un número válido
            if (typeof nuevoPuntaje !== 'number' || isNaN(nuevoPuntaje)) {
                reject('El puntaje debe ser un número válido');
                return;
            }

            // Actualizar el puntaje solo si es mayor que el actual
            if (nuevoPuntaje > (usuarioReciente.puntaje || 0)) {
                const usuarioActualizado = await storage.actualizarPuntaje(
                    usuarioReciente._id, 
                    nuevoPuntaje
                );
                resolve(usuarioActualizado);
            } else {
                resolve({
                    id: usuarioReciente._id,
                    nombre: usuarioReciente.nombre,
                    apellido: usuarioReciente.apellido,
                    puntaje: usuarioReciente.puntaje
                });
            }
        } catch (error) {
            reject(`Error al actualizar el puntaje: ${error.message}`);
        }
    });
}

module.exports = {
    insertar_usuario,
    obtener_usuario,
    actualizar_puntaje,
    obtener_estudiantes
}