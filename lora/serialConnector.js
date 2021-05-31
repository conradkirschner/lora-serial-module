import {recievedData} from "./InputParser";

const SerialPort = require('serialport')

const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
const commandBuffer = [];
let okCounter = 0;
let commandBufferCounter = 0;
export const isFreeToSend = () => {
    return (commandBuffer.length === 0);
}
export const sendCommand = (command) => {
    commandBuffer.push(command);
}

export const runCommands = () => {
    if (commandBuffer.length === 0) {
        return;
    }
    if (okCounter < commandBufferCounter ) {
        console.log('Waiting for finishing previous commands');
        return ;
    }

    const command = commandBuffer.splice(0,1);
    console.log('Execute ' + command);

    return new Promise((resolve, reject) => {
        commandBufferCounter++;
        port.write(command + `\r\n`, function (err) {
            if (err) {
                reject();
            }
            resolve();
        });
    });
}

parser.on('data', (...data) => {
    console.log(data)
    if (data[0] === 'AT,OK') {
        okCounter++;
        console.log('Got response from module', okCounter, commandBufferCounter);
        return;
    }
    if (data[0] === 'AT,SENDED') {
        okCounter++;
        console.log('Sended Message successfully', okCounter, commandBufferCounter);
        return;
    }
    /*
     Empfange von 0001 - 5 bytes => hello
     [ 'LR,0001,05,hello' ]
    */
    const [command, ...datablock] = data.split(',');
    if (command === 'LR') {
        recievedData(datablock)
    }
    console.info('GOT DATA');
})

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message)
});
