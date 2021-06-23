import SerialPort from "serialport";
import {log} from "./logger";
const toString = (bytes) => {
    return bytes.toString('ascii');
}
const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
port.on('error', function (err) {
    log('Error: ', err.message)
});

let streambuffer = null;
// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
    const result =  port.read();
    if (streambuffer === null) {
        streambuffer =  result;
    } else {
        streambuffer = streambuffer + result;
    }
    var match = /\r|\n/.exec(result);
    if (match) {
        if (streambuffer.lenbits === 0) {

        }
        flush(streambuffer);
        streambuffer = null;
        // console.log('linebreak found in ', result, result.toString());
    }
    // console.log('Data - stopped:', result, result.toString())
})

const flush = (data) => {
    console.log('FULL-MESSAGE:' ,data.toString() , data.lenbits);
}
// Switches the port into "flowing mode"
port.on('data', function (data) {
    // console.log('Data - flow mode:', data, data.toString())
})

port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))
console.log('AT+RX push to serial');
port.write('AT+RX\r\n', (e) => {
    console.log('AT+RX pushed to serial', e);
});
