import commands from "./commands";
import {DEVICEID} from "../_global_constrains";
import {log, info} from "../logger";
import {InputParser} from "./InputParser";
import {setAddress} from "./commands/lora";
import packages from "./packages";
import {RoutingHandler} from "./routing/RoutingHandler";
import {MessageHandler} from "./MessageHandler";

console.log(DEVICEID);
export class AODVClient {
    parser = null;
    inputParser = new InputParser(this);
    messageHandler = new MessageHandler();

    // used to restore AT,OK from AT, linebreak OK
    cache_answer_part;

    constructor(parser) {
        this.parser = parser;
    }

    router = new RoutingHandler();

    buffer = [];
    history = [];
    currentCommand = {
        command: null,
        answer: null,
    };
    currentWaitCounter = 0;


    pushSendCommand(command) {
        this.buffer.push(commands.lora.sendText(command))
        this.pushCommand(command);
    }
    pushCommand(command) {
        this.buffer.push(command);
    }

    nextCommand() {
        this.currentCommand.command = (this.buffer.splice(0,1))[0];
    }

    sendMessage(clientId, message, thatCopy, tries) {
        if (!tries) {
            tries = 0;
        }
        if (tries === 4) return;
        tries++;

        let that;
        if (thatCopy) {
            that = thatCopy;
        }else {
            that = this;

        }
        const route = that.router.getRoutingNode(clientId);
        if (route === null) {
            const rreq = packages.send.rreq(1, 0, DEVICEID,1, that.messageHandler.currentSequenceNumber, clientId, 1);
            console.log('REQUEST OBJECT', rreq);
            that.pushCommand(commands.lora.setBroadcast());
            that.pushSendCommand(rreq);
            const memorized = that.sendMessage;
            setTimeout(()=> {memorized(clientId, message, that, tries)},3*1000); // retry send message after 3min
            return;
        }
        that.pushCommand(setAddress(route));
        that.messageHandler.addChatMessage(clientId, message, true);
        that.pushSendCommand(packages.send.send_text_request(DEVICEID, clientId, that.messageHandler.currentSequenceNumber, message));
        that.messageHandler.incrementSequenceNumber();
    }

    async runCommand() {
        this.nextCommand();
        if (this.currentWaitCounter > 0) return false;
        if (this.currentCommand.command === undefined) return false;
        console.log('RUN:1 ', JSON.parse(JSON.stringify(this.currentCommand)), this.currentWaitCounter, this.currentCommand.command);
        this.currentWaitCounter = this.currentWaitCounter + 1;
        console.log('RUN:2 ', JSON.parse(JSON.stringify(this.currentCommand)), this.currentWaitCounter, this.currentCommand.command);

        const command = JSON.parse(JSON.stringify(this.currentCommand));
        const that = this;
        const port = this.parser;
        return new Promise((resolve, reject) => {
            if (typeof command.command === "string") {
                port.write(command.command + '\r\n', function (err) {
                    if (err) {
                        reject(false);
                    }
                    resolve(true);
                    const copy = JSON.parse(JSON.stringify(command));
                    that.history.push(copy);
                });
                return;
            }
            console.log("push to serial", JSON.stringify(command.command));
            console.log("push to serial", command.command);
            console.log("push to serial", command.command.data);

            port.write(Buffer.from(command.command.data).toString('ascii') + '\r\n', function (err) {
                if (err) {
                    reject(false);
                }
                resolve(true);
                const copy = JSON.parse(JSON.stringify(command));
                that.history.push(copy);
            });
        });

    }


    workWithData(data, stringData) {
        log('Got Input:',stringData);
        /*
          Empfange von 0001 - 5 bytes => hello
          [ 'LR,0001,05,hello' ]
         */
        const [command, ...datablock] = stringData.split(',');

        if (command === 'LR') {
            try {
                this.inputParser.recievedData(datablock);
                this.history[this.history.length].answer = datablock;

            } catch (e) {
                console.log(e);
            }

            return true;
        }
        if (stringData.indexOf('MODULE:HIMO-01M(V0.4)') !== -1) {
            return  true;
        }
        if (stringData.indexOf('Vendor:Himalaya') !== -1) {
            return  true;
        }
        if (stringData.indexOf('CPU_BUSY') !== -1) {
            // restore last command
            this.buffer = [...[this.currentCommand],...this.buffer];
            this.currentWaitCounter--;
            return  true;
        }
        if (stringData.indexOf('AT,OK') !== -1) {
            this.currentWaitCounter--;
            return  true;
        }
        if (stringData.indexOf('AT,SENDED') !== -1) {
            this.currentWaitCounter--;
            return  true;
        }
        if (!isNaN(parseInt(datablock[0]))) {
            this.currentCommand.answer = parseInt(datablock[0]);
            console.log(this.currentCommand.answer);
            // sendText(`Got answer from you -> ${lastMessageStats.data[0]}<- ${lastMessageStats.db}`);
            return true;
        }
        console.log('ERROR APPEARED', stringData, data);
        return false;
    }


    start() {
        info('Start Module');
        this.pushCommand(commands.lora.resetModule());
        this.pushCommand(commands.lora.setAddress(DEVICEID));
        this.pushCommand(commands.lora.setConfig()); // uses default config
        this.pushCommand(commands.lora.getMessages());
    }

    getHistory() {
        return this.history;
    }
}
