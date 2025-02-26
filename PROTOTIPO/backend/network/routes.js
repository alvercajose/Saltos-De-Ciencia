const usuario = require('../components/usuario/interface')
const preguntas = require('../components/preguntas/interface')
const maestro = require('../components/maestros/interface')


const routes = function( server ) {
    server.use('/usuario', usuario)
    server.use('/usuario/estudiantes', usuario)
    server.use('/usuario/updateScore', usuario)
    server.use('/preguntas', preguntas)
    server.use('/maestros', maestro)
    server.use('/maestros/login', maestro)

}

module.exports = routes