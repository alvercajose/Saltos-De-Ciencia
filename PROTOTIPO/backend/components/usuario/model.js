const mongoose = require('mongoose')
const schema = mongoose.Schema

const req_string = {
    type: String,
    required: true
}

const req_date = {
    type: Date,
    required: true
}

const usuario_schema = new schema({
    nombre: req_string,
    apellido: req_string,
    curso: req_string,
    paralelo: req_string,
    fecha_creacion: Date,
    puntaje: {
        type: Number, // Tipo de dato para el puntaje
        default: 0    // Valor por defecto si no se especifica
    }
    
}, {
    timestamps: { createdAt: 'fecha_creacion'}
})


const model = mongoose.model('Usuario', usuario_schema)
module.exports = model