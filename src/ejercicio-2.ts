import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .command(
        'info',
        'Proporciona información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto',
        (yargs) => {
            return yargs
                .option('ruta', { describe: 'Ruta del fichero', type: 'string', demandOption: true})
                .option('opcion', { describe: 'Opciones de visualización (lineas, palabras, caracteres)', type: 'string', demandOption: true})
                .option('pipe', { describe: 'Uso de pipe', type: 'boolean', demandOption: true})

        },
        (argv) => {
            if (!fs.existsSync(argv.ruta)){
                console.error('Error: El archivo no existe');
                process.exit(1);
            }
            const fichero = fs.readFileSync(argv.ruta, 'utf-8');
            if (argv.pipe === true){
                pipe(argv.ruta, argv.opcion);
            }else if (argv.pipe === false){
                noPipe(argv.ruta, argv.opcion);        
            }else{
                console.log("Error con la opción de pipe");
            }
        }
    )
    .help()
    .alias('help', 'h')
    .argv;

/**
 * Método para contar caracteres, palabras o líneas.
 * @param opcion - Lineas, palabras o caracteres
 * @param texto - Todo el texto del fichero
 */
function contar(opcion: string, texto: string) {
  switch (opcion) {
    case 'lineas':
      return texto.split('\n').length;
    case 'palabras':
      return texto.split(/\s+/).length;
    case 'caracteres':
      return texto.length;
    default:
      console.error('Error: Opción no válida');
      process.exit(1);
  }
}

/**
 * Método para usar el pipe
 * @param ruta  - Ruta del fichero
 * @param opciones - Opción de caracteres, lineas o palabras
 */
function pipe(ruta: string, opciones: string) {
  const lectura = fs.createReadStream(ruta, 'utf-8');
  let data = '';

  lectura.on('data', (chunk) => {
    data += chunk;
  });

  lectura.on('end', () => {
    console.log(contar(opciones, data));
  });

  lectura.on('error', (err) => {
    console.error('Error: ', err.message);
  });
}

/**
 * Método para no usar el pipe
 * @param ruta  - Ruta del fichero
 * @param opciones - Opción de caracteres, lineas o palabras
 */
function noPipe(ruta: string, opciones: string) {
  fs.readFile(ruta, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error: ', err.message);
      return;
    }
    console.log(contar(opciones, data));
  });
}
