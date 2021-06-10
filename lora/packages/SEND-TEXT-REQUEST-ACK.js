
import {SEND_TEXT_REQUEST_ACK} from "./types";

export const create = (uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber) => {
    return Buffer.from([SEND_TEXT_REQUEST_ACK, uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber]);
}
export const read = (byteArray) => {
    const [uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber] = byteArray;
    return {
        uflag, hopCount, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber
    }
}
