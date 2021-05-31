const {info} = require("./logger");
const {sendText} = require("./commands");
const {runCommands} = require("./serialConnector");
const {isFreeToSend} = require("./serialConnector");
const {getMessages} = require("./commands");
const {setConfig} = require("./commands");
const {setAddress} = require("./commands");
const {resetModule} = require("./commands");

setInterval(async () => {
    await runCommands();
}, 50);

(async ()=>{
    resetModule();
    setAddress(16);
    setConfig(); // uses default config
    getMessages();
    info('Start sending Hello');
    setInterval(() => {
        if (isFreeToSend()){
            sendText('hello');
        }
    }, 5000);

})();



