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
    try {
        const returnObject =  {
            uflag: byteArray[0],
            hopCount: byteArray[1],
            rreq_id: byteArray[2],
            originAddress: parseInt(byteArray[3]),
            originSequenceNumber: byteArray[4],
            destinationAddress: parseInt(byteArray[5]),
            destinationSequenceNumber: byteArray[6],
        }
        console.log(returnObject.originAddress)
        if (isNaN(returnObject.uflag)) {
            returnObject.uflag = byteArray[0].charCodeAt(0);;
        }
        if (isNaN(returnObject.hopCount)) {
            returnObject.hopCount = byteArray[1].charCodeAt(0);;
        }
        if (isNaN(returnObject.rreq_id)) {
            returnObject.rreq_id = byteArray[2].charCodeAt(0);;
        }
        if (isNaN(returnObject.originAddress)) {
            returnObject.originAddress = byteArray[3].charCodeAt(0);;
        }
        if (isNaN(returnObject.destinationAddress)) {
            returnObject.destinationAddress = byteArray[5].charCodeAt(0);;
        }
        return returnObject;
    } catch (e) {
        return {
            uflag: byteArray[0],
            hopCount: byteArray[1],
            rreq_id: byteArray[2],
            originAddress: parseInt(byteArray[3].toString(2), 2),
            originSequenceNumber: byteArray[4],
            destinationAddress: parseInt(byteArray[3].toString(2), 2),
            destinationSequenceNumber: byteArray[6],
        }
    }

}
