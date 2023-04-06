import * as fs from 'fs';
/**
 * Clase abstracta para representar una mochila
 * @abstract
 */
class Mochila {
    /**
     * Método para procesar un archivo de datos y obtener los beneficios y pesos de los elementos de la mochila
     * @param filePath - Ruta del archivo de datos
     * @returns  Objeto con los beneficios y pesos de los elementos de la mochila
     * @throws Error si el archivo no existe o el formato no es soportado
     */
    procesar(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error('El archivo no existe en la ruta especificada.');
        }
        const data = fs.readFileSync(filePath, 'utf8');
        const extension = filePath.split('.').pop()?.toLowerCase() || '';
        let elementos;
        if (extension === 'csv') {
            const { elementos: elementosExtraidos } = this.extraerDatosCSV(data);
            elementos = elementosExtraidos;
        }
        else if (extension === 'json') {
            const { elementos: elementosExtraidos } = this.extraerDatosJSON(data);
            elementos = elementosExtraidos;
        }
        else {
            throw new Error('Formato de archivo no soportado.');
        }
        const beneficios = elementos.map((elemento) => elemento.beneficio);
        const pesos = elementos.map((elemento) => elemento.peso);
        return { beneficios, pesos };
    }
}
/**
 * Clase concreta para representar una mochila con datos en formato CSV
 * @extends Mochila
 */
export class MochilaCSV extends Mochila {
    /**
     * Método implementado en la otra clase
     * @param data - Datos en formato JSON
     * @throws Error por no estar implementado
     */
    extraerDatosJSON(data) {
        throw new Error('Method not implemented.');
    }
    /**
     * Método para extraer datos de un archivo CSV
     * @param data - Datos en formato CSV
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    extraerDatosCSV(data) {
        const lines = data.trim().split('\n');
        const capacidad = parseInt(lines[0]);
        const numElemento = parseInt(lines[1]);
        const elementos = lines.slice(2).map((line, index) => {
            const [beneficio, peso] = line.split(' ').map(Number);
            return { numElemento: index + 1, beneficio, peso };
        });
        return { capacidad, elementos };
    }
}
/**
 * Clase concreta para representar una mochila con datos en formato JSON
 * @extends Mochila
 */
export class MochilaJSON extends Mochila {
    /**
     * Método implementado en la otra clase
     * @param data - Datos en formato CSV
     * @throws Error por no estar implementado
     */
    extraerDatosCSV(data) {
        throw new Error('Method not implemented.');
    }
    /**
     * Método para extraer datos de un archivo JSON
     * @param data - Datos en formato JSON
     * @returns Objeto con la capacidad y los elementos de la mochila
     */
    extraerDatosJSON(data) {
        const jsonData = JSON.parse(data);
        const capacidad = jsonData.capacidad;
        const elementos = jsonData.elementos.map((elemento) => ({
            numElemento: elemento.numElemento,
            peso: elemento.peso,
            beneficio: elemento.beneficio,
        }));
        return { capacidad, elementos };
    }
}
/* Funcionamiento de prueba*/
const extractorCSV = new MochilaCSV();
const resultadoCSV = extractorCSV.procesar('src/data/archivo.csv');
console.log(resultadoCSV);
const extractorJSON = new MochilaJSON();
const resultadoJSON = extractorJSON.procesar('src/data/archivo.json');
console.log(resultadoJSON);
