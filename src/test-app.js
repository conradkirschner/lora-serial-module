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

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
    console.log('Data:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data)
})

port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))

port.write('AT+RX\r\n', (e) => {
    console.log('done', e);
});
