
import {SEND_TEXT_REQUEST} from "./types";

export const create = (originAddress, destinationAddress, MessageSequenceNumber, payload) => {
    const bytesPayload = Buffer.from(payload);
    return Buffer.from([SEND_TEXT_REQUEST, originAddress, destinationAddress, MessageSequenceNumber, bytesPayload]);
}
export const read = (byteArray) => {
    const [ originAddress, destinationAddress, MessageSequenceNumber, ...bytesPayload] = byteArray;

    return {
        originAddress,
        destinationAddress,
        MessageSequenceNumber,
        message: converToAscii(bytesPayload),
    }
}
const converToAscii = (byteArray) => {
    return String.fromCharCode(byteArray);
}

