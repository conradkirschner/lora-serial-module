import SerialPort from "serialport";
import {log} from "./logger";

const port = new SerialPort('/dev/ttyS0', {
    baudRate: 115200
});
port.on('error', function (err) {
    log('Error: ', err.message)
});

let streambuffer = null;

port.on('readable', function () {
    const result =  port.read();
    if (streambuffer === null) {
        streambuffer =  result;
    } else {
        streambuffer = streambuffer + result;
    }
    const match = /\r|\n/.exec(result);
    if (match) {
        /**
         * @BUGFIX -> Here we check the first 2 chars must be AT or LR,
         */
        if (
            streambuffer.length > 3 ||
            (streambuffer.toString()[0] === 'A'  && streambuffer.toString()[1]) === 'T' ||
            (streambuffer.toString()[0] === 'L'  && streambuffer.toString()[1] === 'R')
        ){

        }
        if (streambuffer.length > 1) {
            flush(streambuffer);
        }
        streambuffer = null;
    }
})

const flush = (data) => {
    console.log('FULL-MESSAGE:' ,data.toString() , data.length);
}

port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))

port.write('AT+RX\r\n', (e) => {
    console.log('AT+RX pushed to serial', e);
});
