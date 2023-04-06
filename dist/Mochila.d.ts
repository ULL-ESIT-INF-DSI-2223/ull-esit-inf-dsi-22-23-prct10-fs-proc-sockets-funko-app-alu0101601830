/**
 * Elementos de la mochila
 * @type
 */
type ElementoMochila = {
    numElemento: number;
    peso: number;
    beneficio: number;
};
/**
 * Clase abstracta para representar una mochila
 * @abstract
 */
declare abstract class Mochila {
    /**
     * Método abstracto para extraer datos de un archivo CSV
     * @param data - Datos en formato CSV
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    protected abstract extraerDatosCSV(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
    /**
     * Método abstracto para extraer datos de un archivo JSON
     * @param data - Datos en formato JSON
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    protected abstract extraerDatosJSON(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
    /**
     * Método para procesar un archivo de datos y obtener los beneficios y pesos de los elementos de la mochila
     * @param filePath - Ruta del archivo de datos
     * @returns  Objeto con los beneficios y pesos de los elementos de la mochila
     * @throws Error si el archivo no existe o el formato no es soportado
     */
    procesar(filePath: string): {
        beneficios: number[];
        pesos: number[];
    };
}
/**
 * Clase concreta para representar una mochila con datos en formato CSV
 * @extends Mochila
 */
export declare class MochilaCSV extends Mochila {
    /**
     * Método implementado en la otra clase
     * @param data - Datos en formato JSON
     * @throws Error por no estar implementado
     */
    protected extraerDatosJSON(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
    /**
     * Método para extraer datos de un archivo CSV
     * @param data - Datos en formato CSV
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    protected extraerDatosCSV(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
}
/**
 * Clase concreta para representar una mochila con datos en formato JSON
 * @extends Mochila
 */
export declare class MochilaJSON extends Mochila {
    /**
     * Método implementado en la otra clase
     * @param data - Datos en formato CSV
     * @throws Error por no estar implementado
     */
    protected extraerDatosCSV(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
    /**
     * Método para extraer datos de un archivo JSON
     * @param data - Datos en formato JSON
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    protected extraerDatosJSON(data: string): {
        capacidad: number;
        elementos: ElementoMochila[];
    };
}
export {};
