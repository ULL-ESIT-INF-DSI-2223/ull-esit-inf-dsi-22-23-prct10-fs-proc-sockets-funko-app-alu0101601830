import * as net from 'net';

const SERVER_PORT = 8080;
const SERVER_HOST = 'localhost';

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Data received from client:', data.toString());
    // Aquí puedes procesar los datos recibidos y responder al cliente si es necesario
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
