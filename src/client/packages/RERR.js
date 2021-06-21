import {RERR} from "./types";

export const create = ( destinationCount, unreachableDestinationAddress, unreachableDestinationSequenceNumber, additionalAddresses, additionalSequenceNumber) => {
    return Buffer.from([RERR, destinationCount, unreachableDestinationAddress, unreachableDestinationSequenceNumber, additionalAddresses, additionalSequenceNumber]);
}

export function read(byteArray) {
    return {
        destinationCount: byteArray[0],
        unreachableDestinationAddress: byteArray[1],
        unreachableDestinationSequenceNumber: byteArray[2],
        additionalAddresses: byteArray[3],
        additionalSequenceNumber: byteArray[4],
    }
}
