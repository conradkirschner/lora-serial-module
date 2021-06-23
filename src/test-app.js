import SerialPort from "serialport";
import {log} from "./logger";

const parser = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
parser.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n` }))
parser.on('error', function (err) {
    log('Error: ', err.message)
});
parser.on('data', (e)=> {
    console.log(e);
})
parser.write('AT+RX\r\n', (e) => {
    console.log('done', e);
});
