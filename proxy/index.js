import SerialPort from "serialport";

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
console.log(results);
const getNodeId = () => {
    const isLan = (results['eth0'].length === 0);
    const id = results['wlan0'][0].split('.')[3];
    let mappedId = undefined;
    switch(id) {
        case '131':
            mappedId = 1;
            break;
        case '132':
            mappedId = 2;
            break;
        case '133':
            mappedId = 3;
            break;
        case '134':
            mappedId = 4;
            break;
        case '135':
            mappedId = 5;
            break;
        case '136':
            mappedId = 6;
            break;
        case '137':
            mappedId = 7;
            break;
        case '138':
            mappedId = 8;
            break;
        case '139':
            mappedId = 9;
            break;
        case '140':
            mappedId = 10;
            break;
        case '141':
            mappedId = 11;
            break;
        case '142':
            mappedId = 12;
            break;
        case '143':
            mappedId = 13;
            break;
        case '144':
            mappedId = 14
            break;
        case '145':
            mappedId = 15
            break;
        case '146':
            mappedId = 16
            break;
        case '147':
            mappedId = 17
            break;
        case '148':
            mappedId = 18
            break;
        case '149':
            mappedId = 19;
            break;
        case '150':
            mappedId = 120;
            break;
    }
    return {isLan, mappedId}
}
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
    console.log('node information');
    const nodeInformation = getNodeId();
    console.log('#start#' + JSON.stringify(blacklist) + '#' + nodeInformation.mappedId + '#' + nodeInformation.isLan);
    ws.send('#start#' + JSON.stringify(blacklist) + '#' + nodeInformation.mappedId + '#' + nodeInformation.isLan);
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
