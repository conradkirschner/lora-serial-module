import {RREP_ACK} from "./types";

export const create = () => {
    return Buffer.from([RREP_ACK]);
}
export const read = () => {
    return true;
}
