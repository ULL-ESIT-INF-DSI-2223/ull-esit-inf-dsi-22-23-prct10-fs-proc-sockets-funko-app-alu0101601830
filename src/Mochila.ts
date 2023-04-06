import * as fs from 'fs';

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
abstract class Mochila {
  /**
   * Método abstracto para extraer datos de un archivo CSV
   * @param data - Datos en formato CSV
   * @returns Objeto con la capacidad y los elementos de la mochila
   */
  protected abstract extraerDatosCSV(data: string): { capacidad: number; elementos: ElementoMochila[] };
  /**
   * Método abstracto para extraer datos de un archivo JSON
   * @param data - Datos en formato JSON
   * @returns Objeto con la capacidad y los elementos de la mochila
   */
  protected abstract extraerDatosJSON(data: string): { capacidad: number; elementos: ElementoMochila[] };

  /**
   * Método para procesar un archivo de datos y obtener los beneficios y pesos de los elementos de la mochila
   * @param filePath - Ruta del archivo de datos
   * @returns  Objeto con los beneficios y pesos de los elementos de la mochila
   * @throws Error si el archivo no existe o el formato no es soportado
   */
  public procesar(filePath: string): { beneficios: number[]; pesos: number[] } {
    if (!fs.existsSync(filePath)) {
      throw new Error('El archivo no existe en la ruta especificada.');
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    let elementos: ElementoMochila[];

    if (extension === 'csv') {
      const { elementos: elementosExtraidos } = this.extraerDatosCSV(data);
      elementos = elementosExtraidos;
    } else if (extension === 'json') {
      const { elementos: elementosExtraidos } = this.extraerDatosJSON(data);
      elementos = elementosExtraidos;
    } else {
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
  protected extraerDatosJSON(data: string): { capacidad: number; elementos: ElementoMochila[]; } {
      throw new Error('Method not implemented.');
  }
  /**
   * Método para extraer datos de un archivo CSV
   * @param data - Datos en formato CSV
   * @returns Objeto con la capacidad y los elementos de la mochila
   */
  protected extraerDatosCSV(data: string): { capacidad: number; elementos: ElementoMochila[] } {
    const lines = data.trim().split('\n');
    const capacidad = parseInt(lines[0]);
    const numElemento = parseInt(lines[1]);

    const elementos: ElementoMochila[] = lines.slice(2).map((line, index) => {
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
  protected extraerDatosCSV(data: string): { capacidad: number; elementos: ElementoMochila[]; } {
      throw new Error('Method not implemented.');
  }
  /**
   * Método para extraer datos de un archivo JSON
   * @param data - Datos en formato JSON
   * @returns Objeto con la capacidad y los elementos de la mochila
   */
  protected extraerDatosJSON(data: string): { capacidad: number; elementos: ElementoMochila[] } {
    const jsonData = JSON.parse(data);
    const capacidad = jsonData.capacidad;
    const elementos: ElementoMochila[] = jsonData.elementos.map((elemento: any) => ({
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
