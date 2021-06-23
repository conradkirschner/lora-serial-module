import SerialPort from "serialport";
import {log} from "./logger";
const toString = (bytes) => {
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        console.log(bytes, 'convert ', Buffer.from(bytes[i].toString()) , ' to ', Buffer.from(bytes[i].toString()).toString('ascii') , '.');
        result = result + bytes[i].toString()
    }
}
const parser = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
parser.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
parser.on('error', function (err) {
    log('Error: ', err.message)
});
parser.on('data', (e)=> {
    console.log('-----------------------------')
    toString(e);
    console.log('-----------------------------')
    console.log(e.toString());
})
parser.write('AT+RX\r\n', (e) => {
    console.log('done', e);
});

