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

## Ejercicio III
En este ejercicio debía adaptar el sistema de Funkos implementado en la práctica 9 y hacerlo con un sistema de cliente y servidor de petición-respuesta. Para esto, he eliminado mi antiguo **index.ts** y he creado dos ficheros, **cliente.ts** y **servidor.ts**.
Primero voy a explicar cliente.ts:
Lo primero que hago en este fichero es conectarme al puerto dónde el servidor está escuchando con el módulo *net* de **Node.js**:
`const client = net.connect({port: SERVER_PORT});`
Lo siguiente que hago es el client.on para conectarme, leer la información de la consola y enviar la petición al servidor. Voy a explicar por ejemplo como hago add y el resto de comandos sigo la misma dinámica. Para add: 
```ts
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
```
Leo primero la información por la consola con los datos del funko utilizando el módulo **yargs**, luego creo un funko nuevo y por último lo que he utilizado para enviar la petición es crear un tipo como el que nos dan en el enunciado de la práctica, en mi caso es así:
```ts
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  funkoPop?: Funko;
};
```
Entonces creo una variable `request` de tipo `RequestType` y ahí añado el comando `add`, el nombre del usuario con `argv.user` y el funko nuevo que he creado. Luego utilizo `client.write` y mando al servidor el tipo con `JSON.stringify`. Esto mismo lo utilizo en cada comando pero adaptando al tipo de comando y por ejemplo para read, list o remove, creo funkos vación solo con el id y en el servidor se encarga solo de leer el id y hacer lo que tenga que hacer.

Después de manejar toda la parte de enviar datos al servidor, creo la parte para recibir datos:
```ts
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
```
En esta parte estoy escuchando lo que haya recibido de información para mostrar en rojo, para ello hago el parse del JSON que explicaré más tarde en el servidor, pero básicamente tengo una variable que se llama success para asegurarme de que el resultado sea válido o no, si ha ido bien lo imprimo verde y si no, en rojo.
Lo último que tengo es la parte de error que muestro en rojo si hay alguno:
```ts
client.on('error', (err)=>{
    console.log(chalk.red(err.message));
    console.log("---------------------------------------------------")
})
```

Ahora para el servidor, realizo lo siguiente:
Primero creo el server con `net.createServer` y dentro manejo el coket de la siguiente forma, primero debo recibir información del cliente ya que el servidor se queda a la escucha y espera a que reciba datos, asi que dentro de `socket.on('data)` primero parseo la información que me ha llegado del cliente (en nuestro caso un tipo de RequestType con la información necesaria). Ajusto el usuario recibido y el funko recibido:
```ts
    const message = JSON.parse(data.toString());
    const command = message.type;
    const user = message.user;
    const funko: Funko = message.funkoPop;
```
Luego genero una respuesta que voy a pasarle de JSON pero de tipo ResponseType y un funkoOperations con el usuario recibido desde el cliente para realizar las operaciones:
```ts
    const response: ResponseType = {
      type: 'read',
      success: true,
      funkoPop: funko,
      message: "test"
    };
    const funkoOperations = new FunkoOperations(user);

```
ResponseType tiene una estructura de la siguiente forma:
```ts
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  funkoPop?: Funko;
  message: string;
};
```
Después voy a manejar cada uno de los comandos con un switch y voy a explicar como funciona para el comando **add** ya que el resto funcionan de la misma forma: 
```ts
    switch (command) {
      case "add":
        const prueba_add = funkoOperations.addFunko(message.funkoPop, user);
        if (prueba_add === true){
          response.success = true;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `New Funko added to ${user} collection!`;
        }else{
          response.success = false;
          response.type = message.type;
          response.funkoPop = message.funko;
          response.message = `Funko already exists at ${user} collection!`;
        }
        socket.write(JSON.stringify(response));
        break;
```
He modificado el fichero funkoOperations para recibir información de si se ha ejecutado la operación correctamente o no, por eso tengo la variable `prueba_add`. Hago un if con la condición necesaria y en caso de que sea true, la respuesta tiene la variable success en true, el mensaje tiene el tipo (el comando introducido), el funkoPop es el mismo que se ha enviado y finalmente el mensaje que le va a enviar al cliente y este va a imprimir por la terminal. En algunos casos el mensaje es simplemente para ver si ya existe o no como en el ejemplo de add pero por ejemplo en read, en el mensaje si se ha encontrado el funko es imprimir la información sobre el funko, asi que el mensaje es la propia información.
Finalmente utilizo `socket.write(JSON.stringify(response))` y un *break* para enviar al cliente por el socket y salir del switch.

Después de todos los comandos tengo para mostrar información si el cliente se desconecta:
```ts
  socket.on('end', () => {
    console.log(chalk.red('Client disconnected'));
    console.log("---------------------------------------------------");
  });
```
Y dónde está escuchando el server:
```ts
server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log("---------------------CONEXION----------------------")
  console.log(chalk.yellow(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`));
});
```
## Tests y GitHub Actions
Todos los GitHub Actions me dan sin error:
<p align="center">

</p>
Los tests se han realizado con Mocha Chai y sus resultados son los siguientes:
<p align="center">

</p>
Los resultados del Coverall son los siguientes:
<p align="center">

</p>
No está todo el código cubierto pero hay mucha parte de los JSON que no se como tratarlo o sobre errores en pantalla.
## Ejemplos de ejecución
**Añado un Funko**
<p align="center">

</p>
**Añado el mismo Funko**
<p align="center">

</p>
**Muestro la información del primer Funko**
<p align="center">

</p>
**Elimino el primer Funko**
<p align="center">

</p>

## Conclusión
En esta práctica he aprendido a utilizar la petición-respuesta de un cliente y servidor utilizando el módulo net de Node.js y otras herramientas. Una cosa que no he conseguido arreglar es cerrar el cliente buscando una solución alternativa al end.
