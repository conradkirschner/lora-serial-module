import SerialPort from "serialport";

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8001});
const connections = [];
// we block all nodes to avoid the traffic when other students use the network
// except the ones we work on -> 10, 11
const blacklist = (process.env.BLACKLIST)?process.env.BLACKLIST.split(','): [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20]
let isStarted = false;
let port;
console.log('BLACKLIST LOADED: ', blacklist);

const isBlacklisted = (data) => {
    const strData = data.toString();
    const [command, sender, ...rest] = strData.split(',');

    console.log('sender ', sender);
    console.log('blacklist ', blacklist)
    console.log('info ', blacklist.indexOf((parseInt(sender)).toString()))

    if (command !== 'LR') return false;
    if (blacklist.indexOf((parseInt(sender)).toString()) !== -1) {

        return true;
    }
    return false;
}
const flush = (data) => {
    if (isBlacklisted(data)) {
        console.log('blacklisted');
        return;
    }
    for (let i = 0; i < connections.length; i++) {
        try {
            connections[i].send(data);
            console.log('transmitting to client', data);
        } catch (e) {
            console.error('WS ERROR: ', e);
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
    const parser = new SerialPort.parsers.Readline({delimiter: `\r\n`, encoding: 'ascii'});
    port.pipe(parser)

    parser.on('data', function (data) {
            flush(data);
        }
    )


    port.pipe(new SerialPort.parsers.Readline({delimiter: `\r\n`, encoding: 'ascii'}))

    port.on('error', function (err) {
        console.error('Error: ', err.message)
    });
}
/**
 WEBSOCKET
 **/

wss.on('connection', function connection(ws) {
    connections.push(ws);
    ws.send('#start#' + JSON.stringify(blacklist));
    startSerial();
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        port.write(message, (e) => {
            console.log('written to serial', message);
            if (e) {
                console.log('There was a error on writing to serial ')
                console.error(e);
                console.error(e.toString());
            }
            // flush(e); @todo should we transmit errors or restart proxy
        })
    });
    ws.on('close', function close() {
        console.log('websocket disconnected');
        if (port) {
            port.close(() => {
                console.log('port closed');
                port = null;
                isStarted = false;
            });
        }
    });
});
