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
            that.pushSendCommand(rreq);
            const memorized = that.sendMessage;
            setTimeout(()=> {memorized(clientId, message, that, tries)},3*1000); // retry send message after 3min
            return;
        }
        that.pushCommand(setAddress(route));;
        that.messageHandler.addChatMessage(clientId, message, true);
        that.pushSendCommand(packages.send.send_text_request(DEVICEID, clientId, that.messageHandler.currentSequenceNumber, message));
        that.messageHandler.incrementSequenceNumber();
    }

    async runCommand() {
        console.log('RUN: ', JSON.parse(JSON.stringify(this.currentCommand)));
        if (this.currentWaitCounter !== 0) return false;
        if (this.currentCommand.command === undefined) return false;

        this.currentWaitCounter++;
        const command = JSON.parse(JSON.stringify(this.currentCommand));
        const that = this;
        const port = this.parser;

        return new Promise((resolve, reject) => {

            port.write(command.command + `\r\n`, function (err) {
                if (err) {
                    reject(false);
                }
                resolve(true);
                const copy = JSON.parse(JSON.stringify(command));
                that.history.push(copy);
            });
        });

    }

    getData(){
        const that = this;
        this.parser.on('data', (...data) => {
            try {

                that.workWithData(...data);
            } catch (e) {
                console.error('Got Unkown Data', data, data.toString());
            }
        })
    }
    workWithData(...data) {
        log('Got Input:',data);
        /*
          Empfange von 0001 - 5 bytes => hello
          [ 'LR,0001,05,hello' ]
         */
        const [command, ...datablock] = data[0].split(',');

        if (command === 'LR') {

            this.history[this.history.length - 1].answer = datablock;
            this.inputParser.recievedData(datablock);
            return;
        }
        if (data[0] === 'MODULE:HIMO-01M(V0.4)') {
            return;
        }
        if (data[0] === 'Vendor:Himalaya') {
            return;
        }
        if (data[0] === 'AT,ERR:ERR:ERR:CPU_BUSY' || data[0] === 'CPU_BUSY') {
            // restore last command
            this.buffer = [...[this.currentCommand],...this.buffer];
            this.currentWaitCounter--;
            return;
        }
        if (data[0] === 'AT,OK') {
            this.currentWaitCounter--;
            return;
        }
        if (data[0] === 'AT,SENDED') {
            this.currentWaitCounter--;
            return;
        }
        if (!isNaN(parseInt(datablock[0]))) {
            this.currentCommand.answer = parseInt(datablock[0]);
            console.log(this.currentCommand.answer);
            // sendText(`Got answer from you -> ${lastMessageStats.data[0]}<- ${lastMessageStats.db}`);
            return;
        }
        console.log('ERROR APPEARED', data);
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
