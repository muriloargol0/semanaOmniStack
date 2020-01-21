const socketio = require('socket.io');
const parseStringasArray = require('./utils/parseStringAsArray');
const calculateDistance  = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = (server) => {
   io = socketio(server);

   // on serve para ouvir um evento
   io.on('connection', socket => {
      const { latitude, longitude, techs } = socket.handshake.query;

     // console.log(socket.handshake.query);

      connections.push({
        id: socket.id,
        coordinates: {
            latitude: Number(latitude),
            longitude: Number(longitude),
        },
        techs: parseStringasArray(techs),
       });
   })
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}