import SerialPort from "serialport";
import {log} from "../src/logger";
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const connections = [];

const startSerial = () => {


    const port = new SerialPort('/dev/ttyS0', {
        baudRate: 115200,
        parity: 'none',
        flowControl: 0,
        stopBits: 1,
        dataBits: 8,
    });
    port.close();
    port.open();
    const parser = new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' });
    port.pipe(parser)

    parser.on('data', function (data) {
            flush(data);
        }
    )

    const flush = (data) => {
        for (let i = 0; i < connections.length; i++) {
            connections[i].send(data);
        }
    }

    port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))

    port.on('error', function (err) {
        log('Error: ', err.message)
    });
}
/**
 WEBSOCKET
 **/

wss.on('connection', function connection(ws) {
    connections.push(ws);
    startSerial();
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});
