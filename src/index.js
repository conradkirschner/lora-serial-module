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
        baudRate: 115200
    });
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

    let streambuffer = null;

    port.on('readable', function () {
        const result =  port.read();
        if (streambuffer === null) {
            streambuffer =  result;
        } else {
            streambuffer = streambuffer + result;
        }
        const match = /\r|\n/.exec(result);
        if (match) {
            /**
             * @BUGFIX -> Here we check the first 2 chars must be AT or LR,
             */
            if (
                streambuffer.length > 3 ||
                (streambuffer.toString()[0] === 'A'  && streambuffer.toString()[1]) === 'T' ||
                (streambuffer.toString()[0] === 'L'  && streambuffer.toString()[1] === 'R')
            ){

            }
            if (streambuffer.length > 1) {
                flush(streambuffer);
            }
            streambuffer = null;
        }
    })

    const flush = (data) => {
        client.workWithData(data, data.toString())
    }

    port.pipe(new SerialPort.parsers.Readline({ delimiter: `\r\n`, encoding:'ascii' }))


    /**
     * Run Commands
     */
    setInterval(async ()=> {
       await client.runCommand();
    },5000)

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



