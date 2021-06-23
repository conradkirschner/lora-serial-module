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

    addChatMessage(clientId, message, ownSender) {
        if (!this.chatMessages[clientId]) {
            this.chatMessages[clientId] = [];
        }
        this.chatMessages[clientId].push(this.addText(ownSender, message));
        //this also stops someone scrolling back and viewing sensitive data that may have been logged
        process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
        console.clear();
        console.log(JSON.stringify(this.chatMessages));
    }

    addText(isOwn, message) {
        return {own: !!isOwn, message};
    }
}
