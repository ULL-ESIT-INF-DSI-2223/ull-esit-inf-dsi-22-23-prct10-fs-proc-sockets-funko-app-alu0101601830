import * as net from 'net';
import {RequestType, ResponseType} from "./types.js";
import { FunkoOperations } from './funkoOperations.js';
import {Funko, Genero, Tipo} from './funko.js';
import chalk from 'chalk';

const SERVER_PORT = 8080;
const SERVER_HOST = 'localhost';

const server = net.createServer((socket) => {
  console.log(chalk.yellow('Client connected'));

  socket.on('data', (data) => {
    console.log(chalk.blue('Data received from client'));
    const message = JSON.parse(data.toString());
    const command = message.type;
    const user = message.user;
    const funko: Funko = message.funkoPop;
    const response: ResponseType = {
      type: 'read',
      success: true,
      funkoPop: funko,
      message: "test"
    };
    const funkoOperations = new FunkoOperations(user);
    switch (command) {
      case "add":
        const prueba_add = funkoOperations.addFunko(message.funkoPop, user);
        if (prueba_add === true){
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `New Funko added to ${user} collection!`;
        }else{
          response.success = false;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko already exists at ${user} collection!`;
        }
        socket.write(JSON.stringify(response));
        break;
      case "update":
        const prueba_update = funkoOperations.updateFunko(message.funkoPop, user);
        if (prueba_update === true){
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko updated at ${user} collection!`;
        }else{
          response.success = false;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko not found at ${user} collection!`;
        }
        socket.write(JSON.stringify(response));
        break;
      case "remove":
        const prueba_remove = funkoOperations.deleteFunko(message.funkoPop.id, user);
        if (prueba_remove === true){
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko removed from ${user} collection!`;
        }else{
          response.success = false;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko not found at ${user} collection!`;
        }
        socket.write(JSON.stringify(response));
        break;
      case "read":
        const prueba_read = funkoOperations.getFunkoById(message.funkoPop.id, user);
        if( prueba_read === "Error"){
          response.success = false;
          response.type = message.type;
          response.message = `Funko not found at ${user} collection!`;
        }else{
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = prueba_read;
        };
        socket.write(JSON.stringify(response));
        break;
      case "list":
        const prueba_list = funkoOperations.listFunkos(user);
        if(prueba_list === "Error"){
          response.success = false;
          response.type = message.type;
          response.message = `No Funkos in the list of ${user}`;
        }else{
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = prueba_list;
        }
        socket.write(JSON.stringify(response));
        break;
    }
  });

  socket.on('end', () => {
    console.log(chalk.red('Client disconnected'));
    console.log("---------------------------------------------------");
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log("---------------------CONEXION----------------------")
  console.log(chalk.yellow(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`));
});
