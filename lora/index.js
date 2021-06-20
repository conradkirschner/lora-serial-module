import {DEVICEID} from "./_global_constrains";

const {info} = require("./logger");
import commands from './commands'
import {RESET_gpio} from "./reset";
import {askValue} from "./consoleInput";
const {isFreeToSend} = require("./serialConnector");
const {runCommands} = require("./serialConnector");
RESET_gpio()
setInterval(async () => {
    await runCommands();
}, 800);

(async ()=>{
    commands.lora.resetModule();
    commands.lora.setAddress(DEVICEID);
    commands.lora.setConfig(); // uses default config
    commands.lora.getMessages();
    info('Start sending Hello');

    while(await askValue("Sende eine weitere Nachricht( 'yes' ) ") === "yes") {
        const clientId = await askValue("ClientId:");
        const message = await askValue("Nachricht:");
        commands.messaging.sendChatMessage(clientId,message);
    }
    process.exit(0)


    // setInterval(() => {
    //     console.log('can send', isFreeToSend())
    //     if (isFreeToSend()){
    //         commands.messaging.sendChatMessage(13,'hello');
    //     }
    // }, 6000);
})();



