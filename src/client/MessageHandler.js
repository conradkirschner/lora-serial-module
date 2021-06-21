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
    }

    addText(isOwn, message) {
        return {own: !!isOwn, message};
    }
}
