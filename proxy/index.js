import SerialPort from "serialport";

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8001});
let connections = [];
// we block all nodes to avoid the traffic when other students use the network
// except the ones we work on -> 10, 11
const blacklist = (process.env.BLACKLIST)?process.env.BLACKLIST.split(','): [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20]
let isStarted = false;
let port;
console.log('BLACKLIST LOADED: ', blacklist);

const isBlacklisted = (data) => {
    const strData = data.toString();
    const [command, sender, ...rest] = strData.split(',');
    if (command !== 'LR') return false;

    console.log('sender ', sender);
    console.log('blacklist ', blacklist)
    console.log('info indexof: ', blacklist.indexOf((parseInt(sender)).toString()))
    console.log('info if :  ',  (blacklist.indexOf((parseInt(sender)).toString()) !== -1))

    if (blacklist.indexOf((parseInt(sender)).toString()) !== -1) {

        return true;
    }
    return false;
}
const flush = (data) => {
    if (isBlacklisted(data)) {
        return;
    }
    for (let i = 0; i < connections.length; i++) {
        if (connections[i] === null || connections[i] === undefined) continue;
        try {
            /**
             * connection in read only mode?
             */
            connections[i].send(data);
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
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
const removeConnection = (id) => {
    for (let i = 0; i < connections.length; i++){
        const currentConnection = connections[i];
        if (!currentConnection) continue;
        if (currentConnection.uuid === id) {
            delete connections[i];
        }
    }
    connections = connections.filter(function (el) {
        return el != null;
    });
}
wss.on('connection', function connection(ws) {
    ws.uuid = makeid(5);
    connections.push(ws);
    ws.send('#start#' + JSON.stringify(blacklist));
    startSerial();
    ws.on('message', function incoming(message) {
        if (isStarted !== ws.uuid && isStarted !== false) { // only one session or if free
            ws.send('[used][readonly][rejected]'+ message);
            return;
        }
        isStarted = ws.uuid;
        port.write(message, (e) => {
            if (e) {
                console.log('There was a error on writing to serial ')
                console.error(e);
            }
            // flush(e); @todo should we transmit errors or restart proxy
        })
    });
    ws.on('close', function close() {
        console.log('websocket disconnected');
        if (port) {
            port.close(() => {
                console.log('port closed');

                /**
                 * reset port after connection loss
                 */
                const spawn = require("child_process").spawn;
                const pythonProcess = spawn('python',["/home/pi/conrad/lora-serial-module/proxy/reset.py"]);
                setTimeout(()=> {
                    port = null;
                    isStarted = false;
                    removeConnection(ws.uuid);
                }, 1500);
            });
        }
    });
});
