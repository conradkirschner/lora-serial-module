const {info} = require("./logger");
import commands from './commands'
const {isFreeToSend} = require("./serialConnector");
const {runCommands} = require("./serialConnector");

setInterval(async () => {
    await runCommands();
}, 100);

(async ()=>{
    commands.lora.resetModule();
    commands.lora.setAddress(16);
    commands.lora.setConfig(); // uses default config
    commands.lora.getMessages();
    info('Start sending Hello');
    setInterval(() => {
        console.log('can send', isFreeToSend())
        if (isFreeToSend()){
            commands.lora.sendText('hello');
        }
    }, 6000);
})();



