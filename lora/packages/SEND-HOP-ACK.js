
import {SEND_HOP_ACK} from "./types";

export const create = (uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber) => {
    return Buffer.from([SEND_HOP_ACK, uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber]);
}
export const read = (bytearray) => {
    return {
        uflag: bytearray[0],
        hopCount: bytearray[1],
        originAddress: bytearray[2],
        originSequenceNumber: bytearray[3],
        destinationAddress: bytearray[4],
        destinationSequenceNumber: bytearray[5]
    };
}
