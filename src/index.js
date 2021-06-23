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
    const port = new SerialPort('/dev/ttyS0', {
        baudRate: 115200,
        parity: 'none',
        flowControl: 0,
        stopBits: 1,
        dataBits: 8,
    });
    const parser = new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' });
    port.pipe(parser)

    /**
     * Client
     * @type {AODVClient}
     */
    client = new AODVClient(port);
    client.start();

    /**
     * Parser
     */


    port.on('error', function (err) {
        log('Error: ', err.message)
    });

    parser.on('data', function (data) {
            flush(data);
        }
    )

    const flush = (data) => {
        client.workWithData(data, data.toString())
    }

    port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))


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



