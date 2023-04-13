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