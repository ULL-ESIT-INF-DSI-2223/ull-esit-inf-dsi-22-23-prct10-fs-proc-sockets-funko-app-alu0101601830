import { Funko } from './funko.js';
/**
 * Clase para todas las operaciones que se pueden realizar con los funkos
 * @class
 */
export declare class FunkoOperations {
    private funkos;
    private userDirectory;
    /**
     * Constructor de la clase FunkoOperations
     * @param username - nombre del usuario que está utilizando las acciones
     */
    constructor(username: string);
    /**
     * Función para añadir un Funko al usuario
     * @param funko - Funko a añadir
     * @param username - Nombre del usuario
     */
    addFunko(funko: Funko, username: string): void;
    /**
     * Actualiza la información de un Funko introducido
     * @param updatedFunko - Funko con la información actualizada
     * @param username - nombre del usuario
     */
    updateFunko(updatedFunko: Funko, username: string): void;
    /**
     * Elimina un Funko introducido por el usuario
     * @param id - id del Funko que se quiere eliminar
     * @param username - nombre del usuario
     */
    deleteFunko(id: string, username: string): void;
    /**
     * Función que comprueba si existe un Funko
     * @param funkoId - id del Funko para comprobar su existencia
     * @returns Devuelve el Funko en caso de encontrarlo u undefined en caso de que no exista
     */
    private findFunko;
    /**
     * Función para listar todos los Funkos de un usuario
     * @param username - nombre del usuario
     * @returns Devuelve la información de todos los Funkos del usuario
     */
    listFunkos(username: string): void;
    /**
     * Imprime la información de un Funko con su id
     * @param id - id del Funko a mostrar
     * @param username - nombre del usuario
     * @returns returnea para hacer un break en caso de que no encuentre el Funko
     */
    getFunkoById(id: string, username: string): void;
    /**
     * Función que imprime la información con detalles de un Funko
     * @param funko - Funko que hay que imprimir la información
     */
    printFunkoInfo(funko: Funko): void;
    /**
     * Función para devolver el color del chalk en función del precio de un Funko
     * @param value - Valor del Funko
     * @returns El color correspondiente dependiendo de su valor
     */
    getMarketValueColor(value: number): (text: string) => string;
    /**
     * Función que carga todos los archivos JSON de los Funkos del directorio de usuario en
     * this.userDirectory, los lee y los analiza en objetos Funko
     */
    private loadFunkos;
    /**
     * Función que recibe un objeto Funko y lo guarda como un archivo JSON en el
     * directorio de usuario en this.userDirectory. El archivo se nombra con el id del Funko
     * @param funko
     */
    private saveFunko;
    /**
     * Función que elimina el archivo JSON asociado al Funko con el id dado en el
     * directorio de usuario en this.userDirectory. Si no existe un archivo con ese id, la función no hace nada
     * @param funkoId
     */
    private deleteFunkoFile;
}
