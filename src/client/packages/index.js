import {create as createRREP, read as readRREP} from "./RREP";
import {create as createRREQ, read as readRREQ} from "./RREQ";
import {create as createRERR, read as readRERR} from "./RERR";
import {create as createRREP_ACK, read as readRREP_ACK} from "./RREP-ACK";
import {create as createSEND_TEXT_REQUEST, read as readSEND_TEXT_REQUEST} from "./SEND-TEXT-REQUEST";
import {create as createSEND_HOP_ACK, read as readSEND_HOP_ACK} from "./SEND-HOP-ACK";
import {create as createSEND_TEXT_REQUEST_ACK, read as readSEND_TEXT_REQUEST_ACK} from "./SEND-TEXT-REQUEST-ACK";

export const send = {
    rrep_ack: createRREP_ACK,
    rerr: createRERR,
    rreq: createRREQ,
    rrep: createRREP,
    send_hop_ack: createSEND_HOP_ACK,
    send_text_request: createSEND_TEXT_REQUEST,
    send_text_request_ack: createSEND_TEXT_REQUEST_ACK
}
export const read = {
    rrep_ack: readRREP_ACK,
    rerr: readRERR,
    rreq: readRREQ,
    rrep: readRREP,
    send_hop_ack: readSEND_HOP_ACK,
    send_text_request: readSEND_TEXT_REQUEST,
    send_text_request_ack: readSEND_TEXT_REQUEST_ACK
}
export default {
    read,
    send,
}
