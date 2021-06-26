
import {SEND_TEXT_REQUEST_ACK} from "./types";

export const create = ( originAddress, destinationAddress, destinationSequenceNumber, messageNumber) => {
    return Buffer.from([SEND_TEXT_REQUEST_ACK, originAddress, destinationAddress, destinationSequenceNumber, messageNumber]);
}
export const read = (byteArray) => {
    const [ originAddress, destinationAddress, destinationSequenceNumber, messageNumber] = byteArray;
    return {
        originAddress, destinationAddress, destinationSequenceNumber, messageNumber
    }
}
