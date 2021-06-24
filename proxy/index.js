import SerialPort from "serialport";
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8001 });
const connections = [];
const blacklist = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
let isStarted = false;
let port;

const isBlacklisted = (data) => {
    const [command, sender, ...rest] = data.split(',');
    console.log('COMMAND: ', command)
    console.log('SENDER: ', sender)
    if (command !== 'LR') return false;
    if(blacklist.indexOf(parseInt(sender)) !== -1 ){
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
        } catch (e){
            console.error('WS ERROR: ',e);
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
        console.error('Error: ', err.message)
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
            console.log('written to serial', message);
            if (e) {
                console.log('There was a error on writing to serial ')
                console.error(e);
                console.error(e.toString());
            }
            // flush(e);
        })
    });
    ws.on('close', function close() {
        console.log('websocket disconnected');
        if (port) {
            port.close(()=>{
                console.log('port closed');
                port = null;
                isStarted = false;
            });
        }


    });
});
