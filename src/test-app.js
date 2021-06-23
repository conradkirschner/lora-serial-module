import SerialPort from "serialport";
import {log} from "./logger";
const toString = (bytes) => {
    return bytes.toString('ascii');
}
const parser = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
parser.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))
parser.on('error', function (err) {
    log('Error: ', err.message)
});
parser.on('data', (e)=> {
    console.log('-----------------------------')
    console.log('Got Data: ', toString(e));
    console.log('-----------------------------')
    console.log(e.toString());
})
parser.write('AT+RX\r\n', (e) => {
    console.log('done', e);
});

