import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FunkoOperations } from './funkoOperations.js';
import { Funko, Tipo, Genero } from './funko.js';

const argv = yargs(hideBin(process.argv))
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
  // Aquí puedes agregar los comandos para modificar, eliminar, listar y leer la información de un Funko específico.
  .help()
  .alias('help', 'h')
  .argv;
