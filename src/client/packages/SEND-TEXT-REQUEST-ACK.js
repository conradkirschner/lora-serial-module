
import {SEND_TEXT_REQUEST_ACK} from "./types";

export const create = ( originAddress, destinationAddress, messageNumber) => {
    return Buffer.from([SEND_TEXT_REQUEST_ACK, originAddress, destinationAddress, messageNumber]);
}
export const read = (byteArray) => {
    debugger;
    const returnObject =  {
        originAddress: byteArray[0],
        destinationAddress: byteArray[1],
        messageNumber: byteArray[2],
    }
    if (isNaN(returnObject.originAddress)) {
        returnObject.originAddress = byteArray[0].charCodeAt(0);;
    }
    if (isNaN(returnObject.destinationAddress)) {
        returnObject.destinationAddress = byteArray[1].charCodeAt(0);;
    }
    if (isNaN(returnObject.messageNumber)) {
        returnObject.messageNumber = byteArray[2].charCodeAt(0);

    }

    return returnObject;
}
