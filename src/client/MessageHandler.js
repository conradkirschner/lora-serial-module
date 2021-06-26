import {log} from '../logger';

export class MessageHandler{
    sequenceNumber = 0;
    chatMessages = {
        //12: [, "test"]
    }
    incrementSequenceNumber() {
        this.sequenceNumber++;
        if (this.sequenceNumber === 128) { // BUFFER OVERFLOW
            this.sequenceNumber = 0;
        }
    }
    get currentSequenceNumber() {
        return this.sequenceNumber;
    }

    /**
     *
     * @param clientId origin
     * @param message
     * @param ownSender destination
     */
    addChatMessage(ownSender, message, clientId) {
        let isOwnSending = false;
        if (ownSender === process.env.DEVICE_ID) {
            isOwnSending = true;
        }

        if (!this.chatMessages[ownSender]) {
            this.chatMessages[ownSender] = [];
        }
        this.chatMessages[ownSender].push(this.addText(isOwnSending, message));

        //this also stops someone scrolling back and viewing sensitive data that may have been logged
        process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
        console.clear();
        log(JSON.stringify(this.chatMessages));
    }

    addText(isOwn, message) {
        return {own: isOwn, message};
    }
}
