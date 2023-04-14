import * as net from 'net';
import {RequestType} from "./types.js"
import { Genero, Tipo, Funko } from './funko.js';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import yargs from 'yargs';


const SERVER_PORT = 8080;


const client = net.connect({port: SERVER_PORT});

console.log("---------------------CONEXION----------------------")

client.on('connect', async ()=>{
    
    console.log(chalk.green("Conexión satisfactoria"));

    const argv = await yargs(hideBin(process.argv))
      .command(
        'add',
        'Añade un Funko a la colección',
        (yargs) => {
            return yargs
              .option('user', { describe: 'Nombre de usuario', type: 'string', demandOption: true})
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
            const request: RequestType = {type: 'add', user: argv.user, funkoPop: newFunko};
            client.write(JSON.stringify(request));
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
            const newFunko: Funko = {
                id: '',
                nombre: '',
                descripcion: '',
                tipo: Tipo.Pop,
                genero: Genero.Animacion,
                franquicia: '',
                numero: 0,
                exclusivo: false,
                caracteristicasEspeciales: '',
                valorDeMercado: 0
            };
            const request: RequestType = {type: 'list', user: argv.user, funkoPop: newFunko};
            client.write(JSON.stringify(request));
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
            const request: RequestType = {type: 'update', user: argv.user, funkoPop: newFunko};
            client.write(JSON.stringify(request));
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
            const newFunko: Funko = {
                id: argv.id,
                nombre: '',
                descripcion: '',
                tipo: Tipo.Pop,
                genero: Genero.Animacion,
                franquicia: '',
                numero: 0,
                exclusivo: false,
                caracteristicasEspeciales: '',
                valorDeMercado: 0
            };
            const request: RequestType = {type: 'read', user: argv.user, funkoPop: newFunko};
            client.write(JSON.stringify(request));       
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
            const newFunko: Funko = {
                id: argv.id,
                nombre: '',
                descripcion: '',
                tipo: Tipo.Pop,
                genero: Genero.Animacion,
                franquicia: '',
                numero: 0,
                exclusivo: false,
                caracteristicasEspeciales: '',
                valorDeMercado: 0
            };
            const request: RequestType = {type: 'remove', user: argv.user, funkoPop: newFunko};
            client.write(JSON.stringify(request));      
        }
      )
      .help()
      .alias('help', 'h')
      .argv;

})

client.on('data', (data)=>{
    const message = JSON.parse(data.toString());
    console.log("---------------------DATA--------------------------")
    console.log(chalk.yellow("El servidor dice:"))
    if (message.success){
        console.log(chalk.green(message.message));
    }else{
        console.log(chalk.red(message.message));
    }
    console.log("---------------------------------------------------")
})

client.on('error', (err)=>{
    console.log(chalk.red(err.message));
    console.log("---------------------------------------------------")
})