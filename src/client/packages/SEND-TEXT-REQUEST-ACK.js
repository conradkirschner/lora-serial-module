
import {SEND_TEXT_REQUEST_ACK} from "./types";

export const create = ( originAddress, destinationAddress, messageNumber) => {
    return Buffer.from([SEND_TEXT_REQUEST_ACK, originAddress, destinationAddress, messageNumber]);
}
export const read = (byteArray) => {
    const [ originAddress, destinationAddress, messageNumber] = byteArray;
    return {
        originAddress, destinationAddress, messageNumber
    }
}
