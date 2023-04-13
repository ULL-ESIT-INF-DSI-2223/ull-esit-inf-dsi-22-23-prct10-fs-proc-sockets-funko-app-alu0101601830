import net from 'net';
import {watchFile} from 'fs';

  const fileName = process.argv[2];

  net.createServer((connection) => {
    console.log('A client has connected.');
    
    connection.write(JSON.stringify({'type': 'watch', 'file': fileName}) +
      '\n');

    watchFile(fileName, (curr, prev) => {
      connection.write(JSON.stringify({
        'type': 'change', 'prevSize': prev.size, 'currSize': curr.size}) +
         '\n');
    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });
/*

import net from 'net';
import { exec } from 'child_process';

net.createServer((connection) => {
  console.log('A client has connected.');

  connection.on('data', (data) => {
    const { command, args } = JSON.parse(data.toString());
    exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        connection.write(JSON.stringify({ type: 'error', message: error.message }) + '\n');
      } else {
        connection.write(JSON.stringify({ type: 'result', stdout, stderr }) + '\n');
      }
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
*/
