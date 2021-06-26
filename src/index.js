import {log} from "./logger";

require('dotenv').config()


const {info} = require("./logger");
import {RESET_gpio} from "./reset";
import {askValue} from "./consoleInput";
import SerialPort from "serialport";
import {AODVClient} from "./client/AODVClient";
RESET_gpio()

let client = null;

(async ()=>{
    const WebSocket = require('ws');
    const websocketPort = 8001;
    console.info('Connect to -> ', 'ws://localhost:'+websocketPort + '/' + process.env.DEVICE_ID)
    const ws = new WebSocket('ws://localhost:'+ websocketPort + '/' + process.env.DEVICE_ID);
    let isConnected = false;
    ws.on('open', function open() {
        console.log('connected to serial');
    });
    ws.on('error', function open(e) {
        console.log('ws socket', e);
    });
    ws.write = (data) => {
        ws.send(data);
    }
    ws.on('message', function incoming(data) {
        console.log(data);
        if (isConnected) {
            flush(data);
        }

        if (data.startsWith('#start#')) {
            log('blacklist', data.split('#start#')[1]);
            isConnected = true;
        }
    });

    const flush = (data) => {
        client.workWithData(data, data.toString())
    }


    /**
     * Client
     * @type {AODVClient}
     */
    client = new AODVClient(ws);
    client.start();


    /**
     * Run Commands
     */
    setInterval(async ()=> {
       await client.runCommand();
    },1000)

    /**
     * CMD Interface
     */
    while(await askValue("Sende eine weitere Nachricht( 'yes' ) ") === "y") {
        const clientId = await askValue("ClientId:");
        const message = await askValue("Nachricht:");
        client.sendMessage(clientId, message);
    }
    process.exit(0)
})();



