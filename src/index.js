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
    const parser = new SerialPort('/dev/ttyS0', {
        baudRate: 115200
    });
    parser.pipe(new SerialPort.parsers.Ready({ delimiter: 'READY' }))
    parser.on('error', function (err) {
        log('Error: ', err.message)
    });


    client = new AODVClient(parser);
    client.start();
    setInterval(async ()=> {
       await client.runCommand();
    },4000)

    while(await askValue("Sende eine weitere Nachricht( 'yes' ) ") === "yes") {
        const clientId = await askValue("ClientId:");
        const message = await askValue("Nachricht:");
        client.sendMessage(clientId, message);
    }
    process.exit(0)
})();



