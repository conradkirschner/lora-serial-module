import {RREP} from "./types";

export const create = (hopCount=0, originAddress, destinationAddress, destinationSequenceNumber, lifetime) => {
    return Buffer.from([RREP, hopCount, originAddress, destinationAddress, destinationSequenceNumber, lifetime]);
}
export const read = (byteArray) => {
    return {
        hopCount: byteArray[0],
        originAddress: byteArray[1],
        destinationAddress: byteArray[2],
        destinationSequenceNumber: byteArray[3],
        lifetime: byteArray[4],
    }
}
