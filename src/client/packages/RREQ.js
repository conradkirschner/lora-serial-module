import {RREQ} from "./types";

export const create = (
    uflag,
    hopCount,
    rreq_id,
    originAddress,
    originSequenceNumber,
    destinationAddress,
    destinationSequenceNumber
) => {
    return Buffer.from([
        RREQ,
        (uflag) ? uflag : 1,
        hopCount,
        rreq_id,
        originAddress,
        originSequenceNumber,
        destinationAddress,
        destinationSequenceNumber,
    ]);
}
export const read = (byteArray) => {
    return {
        uflag: byteArray[0],
        hopCount: byteArray[1],
        rreq_id: byteArray[2],
        originAddress: parseInt(byteArray[3]),
        originSequenceNumber: byteArray[4],
        destinationAddress: parseInt(byteArray[5]),
        destinationSequenceNumber: byteArray[6],
    }
}
