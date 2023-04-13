"use strict";
exports.__esModule = true;
var net = require("net");
var SERVER_PORT = 8080;
var SERVER_HOST = 'localhost';
var server = net.createServer(function (socket) {
    console.log('Client connected');
    socket.on('data', function (data) {
        console.log('Data received from client:', data.toString());
        // Aquí puedes procesar los datos recibidos y responder al cliente si es necesario
    });
    socket.on('end', function () {
        console.log('Client disconnected');
    });
});
server.listen(SERVER_PORT, SERVER_HOST, function () {
    console.log("Server listening on ".concat(SERVER_HOST, ":").concat(SERVER_PORT));
});
