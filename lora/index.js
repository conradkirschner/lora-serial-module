/**
 * RESET
 */
const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const RESET = new Gpio(18, 'in'); //use GPIO pin 4, and specify that it is output
RESET.writeSync(1);
RESET.writeSync(0);
const {info} = require("./logger");
import commands from './commands'
const {isFreeToSend} = require("./serialConnector");
const {runCommands} = require("./serialConnector");

setInterval(async () => {
    await runCommands();
}, 2000);

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



