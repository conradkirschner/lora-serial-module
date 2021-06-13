export const RREQ = 1;
export const RREP = 2;
export const RERR = 3;
export const RREP_ACK = 4;
export const SEND_TEXT_REQUEST = 5;
export const SEND_HOP_ACK = 6;
export const SEND_TEXT_REQUEST_ACK = 7;

/**
 *
 * @var Buffer byteArray
 * @param byteArray
 */
export const getType = (byteArray ) => {
    console.log(byteArray);
    /** @type Buffer**/
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([RREQ]).readUInt8(0)) {
        return 'RREQ';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([RREP]).readUInt8(0)) {
        return 'RREP';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([RERR]).readUInt8(0)) {
        return 'RERR';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([RREP_ACK]).readUInt8(0)) {
        return 'RREP_ACK';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([SEND_TEXT_REQUEST]).readUInt8(0)) {
        return 'SEND_TEXT_REQUEST';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([SEND_HOP_ACK]).readUInt8(0)) {
        return 'SEND_HOP_ACK';
    }
    if (Buffer.from(byteArray).readUInt8(0) !== Buffer.from([SEND_TEXT_REQUEST_ACK]).readUInt8(0)) {
        return 'SEND_TEXT_REQUEST_ACK';
    }
}

