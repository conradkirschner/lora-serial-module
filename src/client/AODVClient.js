import commands from "./commands";
import {DEVICEID} from "../_global_constrains";
import {log, info} from "../logger";
import {InputParser} from "./InputParser";
import {setAddress} from "./commands/lora";
import packages from "./packages";
import {RoutingHandler} from "./routing/RoutingHandler";
import {MessageHandler} from "./MessageHandler";

export class AODVClient {
    parser = null;
    inputParser = new InputParser(this);
    messageHandler = new MessageHandler();

    // used to restore AT,OK from AT, linebreak OK
    cache_answer_part;

    constructor(parser) {
        this.parser = parser;
        this.getData();
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
            const rreq = packages.send.rreq(1, 0, DEVICEID, that.messageHandler.currentSequenceNumber, clientId, 1);
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
        console.log('RUN: ', JSON.parse(JSON.stringify(this.currentCommand)), this.currentWaitCounter, this.currentCommand.command);
        if (this.currentWaitCounter !== 0) return false;
        if (this.currentCommand.command === undefined) return false;

        const command = JSON.parse(JSON.stringify(this.currentCommand));
        const that = this;
        const port = this.parser;

        return new Promise((resolve, reject) => {
            console.log("push to serial")
            port.write(command.command + `\r\n`, function (err) {
                if (err) {
                    reject(false);
                }
                resolve(true);
                console.log("written to serial")
                that.currentWaitCounter++;

                const copy = JSON.parse(JSON.stringify(command));
                that.history.push(copy);
            });
        });

    }

    getData(){
        const that = this;
        let lastStream = '';
        let tryMerge = false;

        this.parser.on('data', (data) => {
            try {
                tryMerge = (that.workWithData(data, data.toString()) === false);
            } catch (e) {
                console.error(e);
                console.error('Got Unkown Data', data, data.toString());
            }
            if (tryMerge) {
                tryMerge = (that.workWithData(lastStream+data, (lastStream+data).toString()) === false);
            }
            lastStream = data;
        })
    }
    workWithData(data, stringData) {
        log('Got Input:',stringData);
        /*
          Empfange von 0001 - 5 bytes => hello
          [ 'LR,0001,05,hello' ]
         */
        const [command, ...datablock] = stringData.split(',');

        if (command === 'LR') {
            this.history[this.history.length - 1].answer = datablock;
            this.inputParser.recievedData(datablock);
            return;
        }
        if (stringData.indexOf('MODULE:HIMO-01M(V0.4)') !== -1) {
            return;
        }
        if (stringData.indexOf('Vendor:Himalaya') !== -1) {
            return;
        }
        if (stringData.indexOf('CPU_BUSY') !== -1) {
            // restore last command
            this.buffer = [...[this.currentCommand],...this.buffer];
            this.currentWaitCounter--;
            return;
        }
        if (stringData.indexOf('AT,OK') !== -1) {
            this.currentWaitCounter--;
            return;
        }
        if (stringData.indexOf('AT,SENDED') !== -1) {
            this.currentWaitCounter--;
            return;
        }
        if (!isNaN(parseInt(datablock[0]))) {
            this.currentCommand.answer = parseInt(datablock[0]);
            console.log(this.currentCommand.answer);
            // sendText(`Got answer from you -> ${lastMessageStats.data[0]}<- ${lastMessageStats.db}`);
            return;
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
