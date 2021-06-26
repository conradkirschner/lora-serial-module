import SerialPort from "serialport";
import {log} from "./logger";
 const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200,
    parity: 'none',
    flowControl: 0,
    stopBits: 1,
    dataBits: 8,
});
const dataLog = new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' });
const flush = (data) => {
    /**
     * do something
     */
}

dataLog.on('data', function (data) {
    flush(data);
})
dataLog.on('error', function (err) {
    log('Error: ', err.message)
});

port.pipe(dataLog)

port.write('AT+RX\r\n', (e) => {
    /**
     * we do not transmit errors
     */
});
