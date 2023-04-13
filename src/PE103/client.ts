import {connect} from 'net';
import {MessageEventEmitterClient} from './eventEmitterClient.js';

const command = process.argv[2];
const args = process.argv.slice(3);

const client = new MessageEventEmitterClient(connect({port: 60300}));

client.on('message', (message) => {
  console.log("HEY")
  if (message.type === 'watch') {
    console.log(`Connection established: watching file ${message.file}`);
  } else if (message.type === 'change') {
    console.log('File has been modified.');
    console.log(`Previous size: ${message.prevSize}`);
    console.log(`Current size: ${message.currSize}`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
  }
});

/*
import { connect } from 'net';

const command = process.argv[2];
const args = process.argv.slice(3);

const client = net.connect({port: 60300})
client.write(JSON.stringify({ command, args }));

client.on('data', (dataJSON) => {
  if (message.type === 'error') {
    console.error(`Error: ${message.message}`);
  } else if (message.type === 'result') {
    console.log(`stdout: ${message.stdout}`);
    console.log(`stderr: ${message.stderr}`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
  }
});

import net from 'net';

const client = net.connect({port: 60300});

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  const message = JSON.parse(wholeData);

  if (message.type === 'watch') {
    console.log(`Connection established: watching file ${message.file}`);
  } else if (message.type === 'change') {
    console.log('File has been modified.');
    console.log(`Previous size: ${message.prevSize}`);
    console.log(`Current size: ${message.currSize}`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
  }
});*/
