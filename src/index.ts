import net from 'net';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Funko, Tipo, Genero } from './funko.js';
import { RequestType, ResponseType } from './types.js';
import { FunkoOperations } from './funkoOperations.js';

const SERVER_PORT = 8081;
const SERVER_HOST = 'localhost';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command(
      'add',
      'Añade un Funko a la colección',
      (yargs) => {
        return yargs
          .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true })
          .option('id', { describe: 'ID del Funko', type: 'string', demandOption: true })
          .option('name', { describe: 'Nombre del Funko', type: 'string', demandOption: true })
          .option('desc', { describe: 'Descripción del Funko', type: 'string', demandOption: true })
          .option('type', { describe: 'Tipo del Funko', choices: Object.values(Tipo), demandOption: true })
          .option('genre', { describe: 'Género del Funko', choices: Object.values(Genero), demandOption: true })
          .option('franchise', { describe: 'Franquicia del Funko', type: 'string', demandOption: true })
          .option('number', { describe: 'Número del Funko', type: 'number', demandOption: true })
          .option('exclusive', { describe: 'Exclusividad del Funko', type: 'boolean', demandOption: true })
          .option('specialCharacter', { describe: 'Características especiales del Funko', type: 'string', demandOption: true })
          .option('value', { describe: 'Valor de mercado del Funko', type: 'number', demandOption: true });
      },
      (argv) => {
        const funkoOperations = new FunkoOperations(argv.user);
        const newFunko: Funko = {
          id: argv.id,
          nombre: argv.name,
          descripcion: argv.desc,
          tipo: argv.type,
          genero: argv.genre,
          franquicia: argv.franchise,
          numero: argv.number,
          exclusivo: argv.exclusive,
          caracteristicasEspeciales: argv.specialCharacter,
          valorDeMercado: argv.value
        };
        funkoOperations.addFunko(newFunko, argv.user);
      }
    )
    .command(
      'list',
      'Listar todos los Funkos',
      (yargs) =>{
        return yargs
        .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true })
      },
      (argv) => {
        const funkoOperations = new FunkoOperations(argv.user);
        funkoOperations.listFunkos(argv.user)
      }
    )
    .command(
      'update',
      'Modifica un Funko',
      (yargs) => {
        return yargs
        .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true })
        .option('id', { describe: 'ID del Funko', type: 'string', demandOption: true })
        .option('name', { describe: 'Nombre del Funko', type: 'string', demandOption: true })
        .option('desc', { describe: 'Descripción del Funko', type: 'string', demandOption: true })
        .option('type', { describe: 'Tipo del Funko', choices: Object.values(Tipo), demandOption: true })
        .option('genre', { describe: 'Género del Funko', choices: Object.values(Genero), demandOption: true })
        .option('franchise', { describe: 'Franquicia del Funko', type: 'string', demandOption: true })
        .option('number', { describe: 'Número del Funko', type: 'number', demandOption: true })
        .option('exclusive', { describe: 'Exclusividad del Funko', type: 'boolean', demandOption: true })
        .option('specialCharacter', { describe: 'Características especiales del Funko', type: 'string', demandOption: true })
        .option('value', { describe: 'Valor de mercado del Funko', type: 'number', demandOption: true });
      },
      (argv) => {
        const funkoOperations = new FunkoOperations(argv.user);
        const newFunko: Funko = {
          id: argv.id,
          nombre: argv.name,
          descripcion: argv.desc,
          tipo: argv.type,
          genero: argv.genre,
          franquicia: argv.franchise,
          numero: argv.number,
          exclusivo: argv.exclusive,
          caracteristicasEspeciales: argv.specialCharacter,
          valorDeMercado: argv.value
        };
        funkoOperations.updateFunko(newFunko, argv.user);
      }
    )
    .command(
      'read',
      'Dar la información de un Funko en concreto',
      (yargs) => {
        return yargs
        .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true })
        .option('id', { describe: 'ID del Funko', type: 'string', demandOption: true })
      },
      (argv) => {
        const funkoOperations = new FunkoOperations(argv.user);
        funkoOperations.getFunkoById(argv.id, argv.user)
      }

    )
    .command(
      'remove',
      'Eliminar un Funko',
      (yargs) => {
        return yargs
        .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true })
        .option('id', { describe: 'ID del Funko', type: 'string', demandOption: true })
      },
      (argv) => {
        const funkoOperations = new FunkoOperations(argv.user);
        funkoOperations.deleteFunko(argv.id, argv.user)
      }
    )
    .help()
    .alias('help', 'h')
    .argv as { [x: string]: unknown; _: (string | number)[]; $0: string; 
      id: string, 
      nombre: string,               
      descripcion: string,
      tipo: Tipo,
      genero: Genero,
      franquicia: string,
      numero: number,
      exclusivo: boolean,
      caracteristicasEspeciales: string,
      valorDeMercado: number};

    if (argv._[0]) {
      const command = argv._[0].toString();
    
      if (isValidCommand(command)){
    
        const request: RequestType = { type: command };
    
        switch (command) {
          case 'add':
          case 'update':
            request.funkoPop = {
              id: argv.id,
              nombre: argv.nombre,
              descripcion: argv.descripcion,
              tipo: argv.tipo,
              genero: argv.genero,
              franquicia: argv.franquicia,
              numero: argv.numero,
              exclusivo: argv.exclusivo,
              caracteristicasEspeciales: argv.caracteristicasEspeciales,
              valorDeMercado: argv.valorDeMercado
            };
            break;
          case 'read':
          case 'remove':
            //request.funkoPop = { id: argv.id };
            break;
        }
    
        sendRequest(request);
      } else {
        console.log(chalk.yellow('Por favor, introduzca un comando válido.'));
      }
    } 
}

function handleResponse(response: ResponseType) {
  if (response.success) {
    switch (response.type) {
      case 'add':
        console.log(chalk.green('Funko añadido con éxito'));
      case 'update':
        console.log(chalk.green('Funko actualizado con éxito'));
        break;
      case 'remove':
        console.log(chalk.green('Funko eliminado con éxito'));
        break;
      case 'read':
        console.log(chalk.green('Funko encontrado:'));
        console.log(response.funkoPops![0]);
        break;
      case 'list':
        console.log(chalk.green('Lista de Funkos:'));
        response.funkoPops!.forEach((funko) => console.log(funko));
        break;
    }
  } else {
    console.log(chalk.red('Operación fallida'));
  }
}

function sendRequest(request: RequestType){
  const client = net.createConnection({ port: SERVER_PORT, host: SERVER_HOST }, () => {
    client.write(JSON.stringify(request));
  });

  let responseData = '';

  client.on('data', (data) => {
    responseData += data;
  });

  client.on('end', () => {
    const response: ResponseType = JSON.parse(responseData);
    handleResponse(response);
  });
}

function isValidCommand(command: string): command is 'add' | 'list' | 'update' | 'read' | 'remove' {
  return ['add', 'list', 'update', 'read', 'remove'].includes(command);
}

main();

