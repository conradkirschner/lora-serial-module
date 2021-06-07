import {recievedData} from "./inputParser";
import {info, log} from "./logger";

const SerialPort = require('serialport')

const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
const lastMessageStats = {};

const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
let commandBuffer = [];
let currentCommand = null;
let commandBufferCounter = 0;
export const isFreeToSend = () => {
    console.log(commandBuffer);
    return (commandBuffer.length === 0);
}
export const sendCommand = (command) => {
    commandBuffer.push(command);
}

export const runCommands = () => {
    if (commandBuffer.length === 0) {
        console.log('No Commands in Buffer');
        return;
    }
    setTimeout(()=> {
        currentCommand = commandBuffer.splice(0,1);
        info('Execute - ' + currentCommand);

        return new Promise((resolve, reject) => {
            commandBufferCounter++;
            port.write(currentCommand + `\r\n`, function (err) {
                if (err) {
                    reject();
                }
                resolve();
            });
        });
    }, 1000);

}

parser.on('data', (...data) => {
    log('Got Input:',data, commandBufferCounter);
    if (data[0] === 'MODULE:HIMO-01M(V0.4)'){
        return;
    }
    if (data[0] === 'Vendor:Himalaya') {
        return;
    }
    if (data[0] === 'AT,ERR:ERR:ERR:CPU_BUSY' || data[0] === 'CPU_BUSY') {
        // restore last command
        commandBuffer = [...[currentCommand],...commandBuffer];
        return;
    }
    if (data[0] === 'AT,OK') {
        return;
    }
    if (data[0] === 'AT,SENDED') {
        log('Sended Message successfully', commandBufferCounter);
        return;
    }
    if (!isNaN(parseInt(data[0].split(',')[1]))) {
        lastMessageStats.db = parseInt(data[0].split(',')[1]);
        log('Got Message with dB: ', commandBufferCounter);
        return;
    }
    /*
     Empfange von 0001 - 5 bytes => hello
     [ 'LR,0001,05,hello' ]
    */
    const [command, ...datablock] = data[0].split(',');
    if (command === 'LR') {
        lastMessageStats.data = datablock;
        recievedData(datablock)
    }
    info('INPUT DATA:', data);
})

// Open errors will be emitted as an error event
port.on('error', function (err) {
    log('Error: ', err.message)
});
