
import {SEND_TEXT_REQUEST} from "./types";

export const create = (originAddress, destinationAddress, MessageSequenceNumber, payload) => {
    console.log('SEND TEXT TO ' , originAddress, destinationAddress, MessageSequenceNumber, payload);
    const bytesPayload = Buffer.from(payload);
    return Buffer.concat([Buffer.from([SEND_TEXT_REQUEST, parseInt(originAddress), parseInt(destinationAddress), MessageSequenceNumber]), bytesPayload]);
}
export const read = (byteArray) => {
    const [ originAddress, destinationAddress, MessageSequenceNumber, ...bytesPayload] = byteArray;

    return {
        originAddress,
        destinationAddress,
        MessageSequenceNumber,
        message: Buffer.from(bytesPayload).toString('ascii'),
    }
}
const converToAscii = (byteArray) => {
    return String.fromCharCode(byteArray);
}

