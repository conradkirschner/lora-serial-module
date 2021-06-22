import {RREQ} from "./types";

export const create = (uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber) => {
    return Buffer.from([RREQ, (uflag)?uflag:1, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber]);
}
export const read = (byteArray) => {
    return {
        uflag: byteArray[0],
        hopCount: byteArray[1],
        originAddress: byteArray[2],
        originSequenceNumber: byteArray[3],
        destinationAddress: byteArray[4],
        destinationSequenceNumber: byteArray[5],
    }
}