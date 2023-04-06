import { Funko } from './funko.js';
import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Clase para todas las operaciones que se pueden realizar con los funkos
 * @class
 */
export class FunkoOperations {
    private funkos: Funko[] = [];
    private userDirectory: string;

    /**
     * Constructor de la clase FunkoOperations
     * @param username - nombre del usuario que está utilizando las acciones
     */
    constructor(username: string) {
        this.userDirectory = `./users/${username}`;
        this.loadFunkos();
    }

    /**
     * Función para añadir un Funko al usuario
     * @param funko - Funko a añadir
     * @param username - Nombre del usuario
     */
    public addFunko(funko: Funko, username: string): void {
        const existingFunko = this.findFunko(funko.id);
        if (existingFunko) {
            console.log(chalk.red(`Funko already exists at ${username} collection!`));
        } else {
            this.funkos.push(funko);
            this.saveFunko(funko);
            console.log(chalk.green(`New Funko added to ${username} collection!`));
        }
    }

    /**
     * Actualiza la información de un Funko introducido
     * @param updatedFunko - Funko con la información actualizada
     * @param username - nombre del usuario
     */
    public updateFunko(updatedFunko: Funko, username: string): void {
        const index = this.funkos.findIndex(funko => funko.id === updatedFunko.id);
        if (index !== -1) {
            this.funkos[index] = updatedFunko;
            this.saveFunko(updatedFunko);
            console.log(chalk.green(`Funko updated at ${username} collection!`));
        } else {
            console.log(chalk.red(`Funko not found at ${username} collection!`));
        }
    }

    /**
     * Elimina un Funko introducido por el usuario
     * @param id - id del Funko que se quiere eliminar
     * @param username - nombre del usuario
     */
    public deleteFunko(id: string, username: string): void {
        const index = this.funkos.findIndex(funko => funko.id === id);
        if (index !== -1) {
            this.funkos.splice(index, 1);
            this.deleteFunkoFile(id);
            console.log(chalk.green(`Funko removed from ${username} collection!`));
        } else {
            console.log(chalk.red(`Funko not found at ${username} collection!`));
        }
    }

    /**
     * Función que comprueba si existe un Funko
     * @param funkoId - id del Funko para comprobar su existencia
     * @returns Devuelve el Funko en caso de encontrarlo u undefined en caso de que no exista
     */
    private findFunko(funkoId: string): Funko | undefined {
        return this.funkos.find((funko) => funko.id === funkoId);
    }

    /**
     * Función para listar todos los Funkos de un usuario
     * @param username - nombre del usuario 
     * @returns Devuelve la información de todos los Funkos del usuario
     */
    public listFunkos(username: string): void {
        if (this.funkos.length === 0) {
            console.log(chalk.red(`No Funkos in the list of ${username}`));
            return;
        }
        console.log(chalk.blue(`----------------------------------`));
        console.log(chalk.blue(`${username} Funko Pop Collection`));
        for (const funko of this.funkos) {
            this.printFunkoInfo(funko);
        }
    }

    /**
     * Imprime la información de un Funko con su id
     * @param id - id del Funko a mostrar
     * @param username - nombre del usuario
     * @returns returnea para hacer un break en caso de que no encuentre el Funko
     */
    public getFunkoById(id: string, username: string): void {
        const funko = this.funkos.find(f => f.id === id);
        if (!funko) {
            console.log(chalk.red(`Funko not found at ${username} collection!`));
            return;
        }
        this.printFunkoInfo(funko);
    }

    /**
     * Función que imprime la información con detalles de un Funko
     * @param funko - Funko que hay que imprimir la información
     */
    public printFunkoInfo(funko: Funko): void {
        console.log(chalk.blue(`----------------------------------`));
        console.log(chalk.green(`ID: ${funko.id}`));
        console.log(chalk.green(`Name: ${funko.nombre}`));
        console.log(chalk.green(`Description: ${funko.descripcion}`));
        console.log(chalk.green(`Type: ${funko.tipo}`));
        console.log(chalk.green(`Genre: ${funko.genero}`));
        console.log(chalk.green(`Franchise: ${funko.franquicia}`));
        console.log(chalk.green(`Number: ${funko.numero}`));
        console.log(chalk.green(`Exclusive: ${funko.exclusivo}`));
        console.log(chalk.green(`Special Features: ${funko.caracteristicasEspeciales}`));
        console.log(chalk.green(`Merch value: `) + this.getMarketValueColor(funko.valorDeMercado)(`${funko.valorDeMercado}`));
    }

    /**
     * Función para devolver el color del chalk en función del precio de un Funko
     * @param value - Valor del Funko
     * @returns El color correspondiente dependiendo de su valor
     */
    public getMarketValueColor(value: number): (text: string) => string{
        if (value < 20){
            return chalk.red;
        }else if (value >= 20 && value < 30){
            return chalk.blue;
        } else if (value >= 30 && value < 50){
            return chalk.yellow;
        } else{
            return chalk.green;
        }
    }
    

    /**
     * Función que carga todos los archivos JSON de los Funkos del directorio de usuario en 
     * this.userDirectory, los lee y los analiza en objetos Funko
     */
    private loadFunkos(): void {
        if (!fs.existsSync(this.userDirectory)) {
            fs.mkdirSync(this.userDirectory);
        }

        const files = fs.readdirSync(this.userDirectory);

        files.forEach((file) => {
            const content = fs.readFileSync(`${this.userDirectory}/${file}`, 'utf-8');
            const funko: Funko = JSON.parse(content);
            this.funkos.push(funko);
        });
    }

    /**
     * Función que recibe un objeto Funko y lo guarda como un archivo JSON en el 
     * directorio de usuario en this.userDirectory. El archivo se nombra con el id del Funko
     * @param funko 
     */
    private saveFunko(funko: Funko): void {
        const filePath = `${this.userDirectory}/${funko.id}.json`;
        const content = JSON.stringify(funko);
        fs.writeFileSync(filePath, content);
    }

    /**
     * Función que elimina el archivo JSON asociado al Funko con el id dado en el 
     * directorio de usuario en this.userDirectory. Si no existe un archivo con ese id, la función no hace nada
     * @param funkoId 
     */
    private deleteFunkoFile(funkoId: string): void {
        const filePath = `${this.userDirectory}/${funkoId}.json`;
        fs.unlinkSync(filePath);
    }
}