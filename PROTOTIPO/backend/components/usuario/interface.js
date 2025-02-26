const express = require('express')

const controller = require('./controller')
const response = require('../../network/response')

const routes = express.Router()

routes.post('/', function(req, res) {
    controller.insertar_usuario( req.body )
        .then( (data) => response.success(req, res, data, 201) )
        .catch( (error) => response.error(req, res, error, 400) )
})
routes.get('/', function(req, res) {
    controller.obtener_usuario()
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

routes.get('/estudiantes', function(req, res) {
    controller.obtener_estudiantes()
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

routes.post('/updateScore', function(req, res) {
    const score = parseInt(req.body.score); // Asegurarse de que el score sea un número
    
    if (isNaN(score)) {
        return response.error(req, res, 'El puntaje debe ser un número válido', 400);
    }

    controller.actualizar_puntaje(score)
        .then((data) => response.success(req, res, data, 200))
        .catch((error) => response.error(req, res, error, 400));
});

module.exports = routes