const model = require('./model')

async function insertar_usuario(dato) {
    const resultado = await new model(dato)
    return resultado.save()
}
async function obtener_usuario(dato) {
    try {
        if (!dato || Object.keys(dato).length === 0) {
            // Retorna todos los documentos si no hay filtro
            return await model.find();
        }
        // Retorna documentos que coinciden con el filtro
        return await model.find(dato);
    } catch (error) {
        throw new Error('Error al obtener los datos: ' + error.message);
    }
}

async function obtener_estudiantes(dato) {
    try {
        if (!dato || Object.keys(dato).length === 0) {
            // Retorna todos los documentos si no hay filtro
            return await model.find();
        }
    } catch (error) {
        throw new Error('Error al obtener los datos: ' + error.message);
    }
}

async function actualizarPuntaje(usuarioId, nuevoPuntaje) {
  try {
      const usuario = await model.findByIdAndUpdate(
          usuarioId,
          { puntaje: nuevoPuntaje },
          { 
              new: true,
              runValidators: true
          }
      );
      
      if (!usuario) {
          throw new Error('Usuario no encontrado');
      }
      
      return {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          puntaje: usuario.puntaje
      };
  } catch (error) {
      throw new Error(`Error al actualizar el puntaje: ${error.message}`);
  }
}

module.exports = {
    insertar:insertar_usuario,
    obtener:obtener_usuario,
    actualizarPuntaje,
    obtener_estudiantes
}