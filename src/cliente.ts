import * as net from 'net';
import {RequestType} from "./types.js"
import { Genero, Tipo } from './funko.js';
import chalk from 'chalk';


const SERVER_PORT = 8080;

const client = net.connect({port: SERVER_PORT});

console.log("---------------------CONEXION----------------------")

client.on('connect', ()=>{
    
    console.log(chalk.green("Conexión satisfactoria"));
    const request: RequestType = {type: 'update', user: 'diego', funkoPop: {'id': "1", 'nombre': "Classic Sonic", 'descripcion': "Sonic Azul", 'tipo': Tipo.Pop, 'genero': Genero.Animacion, franquicia: 'Warner', numero: 2, exclusivo: true, caracteristicasEspeciales: "Mola mucho", valorDeMercado: 25}};

    client.write(JSON.stringify(request));

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