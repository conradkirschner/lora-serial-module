import {recievedData} from "./inputParser";
import {info, log} from "./logger";

const SerialPort = require('serialport')

const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
const commandBuffer = [];
let okCounter = 0;
let commandBufferCounter = 0;
export const isFreeToSend = () => {
    return (okCounter < commandBufferCounter);
}
export const sendCommand = (command) => {
    commandBuffer.push(command);
}

export const runCommands = () => {
    if (commandBuffer.length === 0) {
        console.log('No Commands in Buffer');
        return;
    }
    if (  okCounter !== commandBufferCounter) {
        console.log('Waiting for command execution', okCounter, commandBufferCounter);
        return ;
    }

    const command = commandBuffer.splice(0,1);
    info('Execute - ' + command);

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
    log('Got Input:',data, okCounter, commandBufferCounter);
    if (data[0] === 'MODULE:HIMO-01M(V0.4)'){
        okCounter++;
        return;
    }
    if (data[0] === 'Vendor:Himalaya'){
        return;
    }
    if (data[0] === 'AT,OK') {
        okCounter++;
        return;
    }
    if (data[0] === 'AT,SENDED') {
        okCounter++;
        log('Sended Message successfully', okCounter, commandBufferCounter);
        return;
    }
    /*
     Empfange von 0001 - 5 bytes => hello
     [ 'LR,0001,05,hello' ]
    */
    console.log(data);
    const [command, ...datablock] = data.split(',');
    if (command === 'LR') {
        recievedData(datablock)
    }
    info('INPUT DATA:', data);
})

// Open errors will be emitted as an error event
port.on('error', function (err) {
    log('Error: ', err.message)
});
