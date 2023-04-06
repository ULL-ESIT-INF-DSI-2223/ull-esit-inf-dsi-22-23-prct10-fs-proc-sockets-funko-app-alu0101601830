# Práctica 10: Sockets
##### Diego Wiederkehr Bruno, alu0101601830  

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101601830/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101601830?branch=main)

### El GitHub Pages se encuentra en el siguiente [link](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101601830/).

## Introducción
En esta práctica vamos a aprender a utilizar y familiarizarnos con los módulos `Events`, `fs`, `child_process` y `net` de Node.js. A parte deberemos utilizar otra vez los paquetes `yargs` y `chalk`.

## Ejercicio I
En este ejercicio nos dan un código que hace uso del módulo `fs` de Node.js. Es un código que observa un fichero y cuando el fichero es modificado avisa por consola. Debemos realizar una traza de ejecución mostrando el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores, además de lo mostrado en consola. Ejecutamos el programa y hacemos dos modificaciones de un fichero `helloworld.txt`:
1. Se hace una llamada a la función `access` y es agregada a la pila de llamadas.
2. La función `access` es completada y se extrae de la pila de llamadas.
3. Se muestra en la consola: `Starting to watch file src/files/helloworld.txt`.
4. Se hace una llamada a la función `watch` y se agrega a la pila de llamadas.
5. La función `watch` es completada y se extrae de la pila de llamadas.
6. Es registrado un manejador de eventos para `change` del objeto `watcher`.
7. Se muestra en la consola: `File src/files/helloworld.txt is no longer watched`.
8. Se modifica el archivo `src/files/helloworld.txt` y es detectada esta modificación por lo que se agrega un manejador a la cola de manejadores.
9. Se muestra en la consola: `File src/files/helloworld.txt has been modified somehow`.
10. Se ejecuta el manejador de eventos y se saca de la cola de manejadores.
11. Se modifica de nuevo el archivo y se detecta la modificación por lo que se agrega otro manejador a la cola de manejadores.
12. Se muestra en la consola: `File src/files/helloworld.txt has been modified somehow`.
12. Se ejecuta el manejador de eventos y se saca de la cola de manejadores.

Una cosa que no entiendo muy bien por qué ocurre es que cada vez que el archivo es modificado, se muestra dos veces por pantalla el mensaje: `File src/files/helloworld.txt has been modified somehow`.

En el código del ejercicio I, la función `access` se utiliza para la comprobación de que un archivo exista. Para asegurarnos de que existe se utiliza el objeto `constants`. Este objeto tiene varias constantes disponibles pero en nuestro caso utiliza `constants.F_OK`, que es el que funciona exactamente para asegurarnos de que exista el fichero. Otra opción podría ser `constants.R_OK` que sirve para saber si un usuario tiene permisos de lectura sobre el archivo.

## Ejercicio II
En este ejercicio debemos realizar un código que nos permita leer un fichero y analizar el número de lineas, caracteres o palabras que hay en total a través de comandos por la terminal. En la función se puede hacer uso o no del método pipe. Primero de todo, leemos con yargs los argumentos de la terminal:
```ts
    .command(
        'info',
        'Proporciona información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto',
        (yargs) => {
            return yargs
                .option('ruta', { describe: 'Ruta del fichero', type: 'string', demandOption: true})
                .option('opcion', { describe: 'Opciones de visualización (lineas, palabras, caracteres)', type: 'string', demandOption: true})
                .option('pipe', { describe: 'Uso de pipe', type: 'boolean', demandOption: true})

        },
```
En esta parte leemos las tres opciones y obligamos que el usuario introduzca cada una de las variables.
```ts
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
```
En esta parte hacemos primero un control de errores para asegurarnos de que el archivo existe y a continuación lo guardamos. Hacemos otro control sobre la variable **pipe** que se encarga de llamar a una función u a otra dependiendo del input. Después he realizado tres funciones distintas, la primera es `contar()`:
```ts
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
```
En esta función básicamente lo que hago es introducir el texto y la opción de lectura, si es *líneas*, lo separo por los saltos de líneas y cuento. Si es *palabras* utilizo en vez del salto de línea, una expresión regular que representa primero `\s` un caracter de espacio en blanco y después el `+` que indica que indica que debe haber uno o más caracteres de espacio en blanco para que se produzca una división en el texto. Finalmente utilizo *caracteres* que devuelve el tamaño del texto entero. Después de esto debo analizar si utiliza el método `pipe` o no. Mi función para usar el pipe, `pipe()`:
```ts
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
```
La función utiliza el módulo `fs` de Node.js para leer el contenido del archivo de texto de forma asíncrona y en tiempo real a través de un flujo de lectura. Almaceno el contenido de todo el archivo en `data`. El primer controlador de eventos se activa cada vez que se recibe un fragmento (chunk) de dateos del flujo de lectura y voy concatenandolo. Cuando termina de leer el archivo se activa el segundo controlador de eventos y al terminar se llama a la función `contar()`. El último se registra un controlador de eventos de error y solo se activa si se produce algún error durante la lectura. La otra función para no usar el pipe, `noPipe()`:
```ts
function noPipe(ruta: string, opciones: string) {
  fs.readFile(ruta, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error: ', err.message);
      return;
    }
    console.log(contar(opciones, data));
  });
}
```
En esta función no uso el flujo de lectura y lee todo el archivo de una sola vez. Leo el archivo, hago un control de errores y si todo va correcto llamo a la función contar() con todo el contenido del archivo contenido en la variable `data`.
## Conclusión
Conclusion
