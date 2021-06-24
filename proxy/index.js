import SerialPort from "serialport";
import {log} from "../src/logger";
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const connections = [];
let isStarted = false;
let port;

const flush = (data) => {
    for (let i = 0; i < connections.length; i++) {
        try {
            connections[i].send(data);
        } catch (e){
            console.error(e);
        }
    }
}

const startSerial = () => {
    if (isStarted) return;

    port = new SerialPort('/dev/ttyS0', {
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
    ws.send('#start#');
    startSerial();
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        port.write(message, (e)=> {
            flush(e);
        })
    });
});
