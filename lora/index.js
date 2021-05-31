const {info} = require("./logger");
const commands = require("./commands");
const {isFreeToSend} = require("./serialConnector");
const {runCommands} = require("./serialConnector");

setInterval(async () => {
    await runCommands();
}, 50);

(async ()=>{
    commands.lora.resetModule();
    commands.lora.setAddress(16);
    commands.lora.setConfig(); // uses default config
    commands.lora.getMessages();
    info('Start sending Hello');
    setInterval(() => {
        if (isFreeToSend()){
            commands.lora.sendText('hello');
        }
    }, 5000);
})();



