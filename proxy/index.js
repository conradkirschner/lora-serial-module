import SerialPort from "serialport";

const nodes = { 1: 31, 2: 32, 3: 33, 4: 34, 5: 35, 6: 36, 7:37, 8:38, 9:39, 10:40, 11: 41, 12: 42, 13: 43, 14: 44, 15: 45, 16: 46, 17:47, 18:48, 19:49, 20:50}

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
    const isLan = (results['eth0'] !== undefined);
    const id = results['wlan0'][0].split('.')[3].substr(1,2);

    let mappedId = undefined;
    for(let node in nodes) {
        if (parseInt(nodes[node]) == id) {
            mappedId= node;
        }
    }
    return {isLan, mappedId}
}
const WebSocket = require('ws');

const SERVER_PORT = 8001;
const path = '/'+ getNodeId().mappedId
const wss = new WebSocket.Server({port: SERVER_PORT});
let connections = [];
// we block all nodes to avoid the traffic when other students use the network
// except the ones we work on -> 10, 11
let blacklist = (process.env.BLACKLIST)?process.env.BLACKLIST.split(','): ["1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
let isStarted = false;
let port;
console.log('BLACKLIST LOADED: ', blacklist);
console.log('running on: ',{port: SERVER_PORT,  path});

const isBlacklisted = (data) => {
    const strData = data.toString();
    const [command, sender, ...rest] = strData.split(',');
    if (command !== 'LR') return false;

    // ignore types
    if (blacklist.indexOf((parseInt(sender)).toString()) !== -1 || blacklist.indexOf(parseInt(sender)) !== -1) {
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
wss.on('connection', function connection(ws, req) {
    ws.uuid = makeid(5);
    connections.push(ws);
    const nodeInformation = getNodeId();
    ws.send('#start#' + JSON.stringify(blacklist) + '#' + nodeInformation.mappedId + '#' + nodeInformation.isLan);
    startSerial();
    ws.on('message', function incoming(message) {
        /**
         * upgrade protocol
         */
        if (message.startsWith('@@@UPGRADE@@@')){
            ws.upgradedProtocol = true;
            return;
        }
        if (message.startsWith('@@@DOWNGRADE@@@')){
            ws.upgradedProtocol = false;
            return;
        }
        /**
         * allow everyone for setup the blacklist
         */
        if (message.startsWith('@@@BLACKLIST@@@')){
            blacklist = message.split('@@@BLACKLIST@@@')[1].split(',');
            const nodeInformation = getNodeId();
            for (let i = 0; i < connections.length; i++ ) {
                if (connections[i].uuid === ws.uuid) continue;
                if (connections[i].upgradedProtocol) {
                    ws.send('#start#' + JSON.stringify(blacklist) + '#' + nodeInformation.mappedId + '#' + nodeInformation.isLan);
                }
            }
        }
        if (isStarted !== ws.uuid && isStarted !== false) { // only one session or if free
            ws.send('[used][readonly][rejected]'+ message);
            return;
        }


        /**
         * Forward read only requests if ws is upgraded
         */
        for (let i = 0; i < connections.length; i++ ) {
            if (connections[i].uuid === ws.uuid) continue;
            if (connections[i].upgradedProtocol) {
                connections[i].send('[used][readonly][input]'+message)
            }
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
