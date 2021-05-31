const {runCommands} = require("./serialConnector");
const {isFreeToSend} = require("./serialConnector");
const {sendHello} = require("./commands");
const {getMessages} = require("./commands");
const {setConfig} = require("./commands");
const {setAddress} = require("./commands");
const {resetModule} = require("./commands");

setInterval(async () => {
    await runCommands();
}, 50);

(async ()=>{
    await resetModule();
    await setAddress(16);
    await setConfig(); // uses default config
    await getMessages();
    setInterval(async () => {
        if (isFreeToSend()){
            await sendHello();
        }
    }, 5000);

})();



