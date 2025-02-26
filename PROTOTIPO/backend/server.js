const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const body_parser = require('body-parser');
const path = require('path');
const config = require('./config');
const routes = require('./network/routes');
const db = require('./db');
const cors = require('cors'); // Añadir CORS
const morgan = require('morgan'); // Añadir Morgan para logs

var app = express();
const server = http.createServer(app);
const io = socketIo(server);

db(config.DB_URL);

// Middleware para registrar solicitudes
app.use(morgan('combined')); // Logs detallados
app.use(cors()); // Habilitar CORS

// Middleware para servir archivos estáticos
app.use('/audio', express.static('../audio/angry-birds-videojuegos-.mp3'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// WebSocket: Manejar conexiones de clientes
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Rutas para manejar las solicitudes del ESP32
app.get('/respuesta1', (req, res) => {
  console.log("Respuesta 1 seleccionada");
  console.log("IP del cliente:", req.ip); // Imprime la IP del cliente
  io.emit('botonPresionado', { boton: 'respuesta1' });
  res.send("Respuesta 1 recibida");
});

app.get('/respuesta2', (req, res) => {
  console.log("Respuesta 2 seleccionada");
  io.emit('botonPresionado', { boton: 'respuesta2' });
  res.send("Respuesta 2 recibida");
});

app.get('/respuesta3', (req, res) => {
  console.log("Respuesta 3 seleccionada");
  io.emit('botonPresionado', { boton: 'respuesta3' });
  res.send("Respuesta 3 recibida");
});

app.get('/saltar', (req, res) => {
  console.log("Mover presionado");
  io.emit('botonPresionado', { boton: 'saltar' }); // Enviar evento a todos los clientes
  res.send("Mover recibido");
});

app.get('/salir', (req, res) => {
  console.log("Salir presionado");
  io.emit('botonPresionado', { boton: 'salir' });
  res.send("Salir recibido");
});

app.get('/cancelar', (req, res) => {
  console.log("Cancelar presionado");
  io.emit('botonPresionado', { boton: 'cancelar' });
  res.send("Cancelar recibido");
});

// Rutas para servir archivos HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'advjuego.html'));
});

app.get('/datosp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'datosp.html'));
});

app.get('/tabla', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'Tabla.html'));
});

app.get('/datosmaestro', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'datosmaestro.html'));
});

app.get('/gpregunta', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'gpregunta.html'));
});

app.get('/gestudiantes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'g-estudiantes.html'));
});

app.get('/admMaestro', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admMaestro.html'));
});

routes(app);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

server.listen(config.PORT, () => {
  console.log(`La aplicación se encuentra arriba en http://localhost:${config.PORT}`);
});