import {recievedData} from "./inputParser";
import {info, log} from "./logger";
import {sendText} from "./commands/lora";

const SerialPort = require('serialport')

const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
export const lastMessageStats = {
    db: {},
    data:{},
    timestamp: {},
};

const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
let commandBuffer = [];
let currentCommand = null;
let commandBufferCounter = 0;
let commandBufferCounterOK = 1;
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
    console.log(commandBufferCounter, commandBufferCounterOK);
    if (commandBufferCounter > commandBufferCounterOK) {
        console.log("waitig");
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
    /*
      Empfange von 0001 - 5 bytes => hello
      [ 'LR,0001,05,hello' ]
     */
    const [command, ...datablock] = data[0].split(',');
    if (command === 'LR') {
        lastMessageStats.data = datablock;
        recievedData(datablock)
        return;
    }
    commandBufferCounterOK++;
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
        return;
    }
    if (!isNaN(parseInt(datablock[0]))) {
        lastMessageStats.db = parseInt(datablock[0]);
        console.log(lastMessageStats.data);
        sendText(`Got answer from you -> ${lastMessageStats.data[0]}<- ${lastMessageStats.db}`);
        return;
    }

})

// Open errors will be emitted as an error event
port.on('error', function (err) {
    log('Error: ', err.message)
});
