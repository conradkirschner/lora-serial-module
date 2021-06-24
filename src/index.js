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

    console.info('Connect to -> ', 'ws://localhost:'+ process.env.port)
    const ws = new WebSocket('ws://localhost:'+ process.env.port);
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
        console.log('data input:', data, isConnected)
        if (isConnected) {
            flush(data);
        }

        if (data.indexOf('#start#') !== -1) {
            const blacklist = 'JSON.parse(data.split()[2])';
            console.log('blacklist', data.split('#')[1] ,blacklist);
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
    },2000)

    /**
     * CMD Interface
     */
    while(await askValue("Sende eine weitere Nachricht( 'yes' ) ") === "yes") {
        const clientId = await askValue("ClientId:");
        const message = await askValue("Nachricht:");
        client.sendMessage(clientId, message);
    }
    process.exit(0)
})();



