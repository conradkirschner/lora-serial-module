
import {SEND_TEXT_REQUEST} from "./types";

export const create = (originAddress, destinationAddress, messageSequenceNumber, payload) => {
    const bytesPayload = Buffer.from(payload);
    return Buffer.concat([Buffer.from([SEND_TEXT_REQUEST, parseInt(originAddress), parseInt(destinationAddress), messageSequenceNumber]), bytesPayload]);
}
export const read = (byteArray) => {
    const [ originAddress, destinationAddress, messageSequenceNumber, ...bytesPayload] = byteArray;

    return {
        originAddress,
        destinationAddress,
        messageSequenceNumber,
        message: Buffer.from(bytesPayload).toString('ascii'),
    }
}
const converToAscii = (byteArray) => {
    return String.fromCharCode(byteArray);
}

