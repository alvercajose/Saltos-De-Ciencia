const model = require('./model')

async function insertar_maestro(dato) {
    const resultado = await new model(dato)
    return resultado.save()
}

async function buscarPorEmail(email) {
    return model.findOne({ email });
}
module.exports = {
    insertar:insertar_maestro,
    buscarPorEmail
};
