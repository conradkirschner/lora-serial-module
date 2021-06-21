
import {SEND_HOP_ACK} from "./types";

export const create = (messageSequenceNumber) => {
    return Buffer.from([SEND_HOP_ACK, messageSequenceNumber]);
}
export const read = (bytearray) => {
    return {
        messageSequenceNumber: bytearray[0],
    };
}
