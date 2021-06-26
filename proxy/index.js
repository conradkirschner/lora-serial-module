import SerialPort from "serialport";
// require os module
const os = require("os");

// invoke userInfo() method
const userInfo = os.userInfo();

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8001});
let connections = [];
// we block all nodes to avoid the traffic when other students use the network
// except the ones we work on -> 10, 11
let blacklist = (process.env.BLACKLIST)?process.env.BLACKLIST.split(','): [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20]
let isStarted = false;
let port;
console.log('BLACKLIST LOADED: ', blacklist);
console.log('running on port ', 8001);

const isBlacklisted = (data) => {
    const strData = data.toString();
    const [command, sender, ...rest] = strData.split(',');
    if (command !== 'LR') return false;

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
    ws.send('#start#' + JSON.stringify(blacklist) + '#' + userInfo);
    startSerial();
    ws.on('message', function incoming(message) {
        if (isStarted !== ws.uuid && isStarted !== false) { // only one session or if free
            ws.send('[used][readonly][rejected]'+ message);
            return;
        }
        /**
         * check for change blacklist request
         */
        if (message.startsWith('@@@BLACKLIST@@@')){
            blacklist = message.split('@@@BLACKLIST@@@')[1].split(',');
        }
        /**
         * set session and forward to serial
         */
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
        if (port) {
            removeConnection(ws.uuid);
            if (isStarted !== ws.uuid) {
                return;
            }
            setTimeout(()=> {
                console.log('free to connect');
                port = null;
                isStarted = false;
            }, 1500);

            port.close(() => {
                console.log('resetting module and reset session');
                /**
                 * reset port after connection loss
                 */
                const spawn = require("child_process").spawn;
                const pythonProcess = spawn('python',["/home/pi/conrad/lora-serial-module/proxy/reset.py"]);

            });
        }
    });
});
