// Import events module
import events from 'events';

// Create an eventEmitter object
const eventEmitter = new events.EventEmitter();
let isSendingCustomText = false;
let isWaitingForResponse = false;
export const fakeResponse = (mockedAnswer) => {
    if (isWaitingForResponse) {
        if (mockedAnswer === '') {
            throw new Error('mocked Answer is empty');
        }
        eventEmitter.emit('data', mockedAnswer)
    }
}

export const mockedSerial = () => {

    eventEmitter.write = (message, callback) => {
        console.log('message', JSON.stringify(message));
        if(message.indexOf('AT+RST') !== -1) {
            eventEmitter.emit('data', 'AT,OK')
            eventEmitter.emit('data', 'MODULE:HIMO-01M(V0.4)')
            eventEmitter.emit('data', 'Vendor:Himalaya')
        } else if(message.indexOf('AT+ADDR') !== -1) {
            eventEmitter.emit('data', 'AT,OK')
        } else if(message.indexOf('AT+CFG') !== -1) {
            eventEmitter.emit('data', 'AT,OK')
        } else if(message.indexOf('AT+RX') !== -1) {
            isWaitingForResponse = true;
            eventEmitter.emit('data', 'AT,OK')
        } else if(message.indexOf('AT+SEND') !== -1) {
            eventEmitter.emit('data', 'AT,OK')
            isSendingCustomText = true;
        } else if(message.indexOf('AT+DEST') !== -1) {
            eventEmitter.emit('data', 'AT,OK')
        } else if(isSendingCustomText) {
            eventEmitter.emit('data', 'AT,SENDING')
            eventEmitter.emit('data', 'AT,SENDED')
            isSendingCustomText = false;
        } else {
            console.error('not catched');
            eventEmitter.emit('data', message)
        }
        callback(false);
    }
    return eventEmitter;
}
