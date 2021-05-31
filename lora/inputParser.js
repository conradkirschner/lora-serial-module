import {addToRoutingTable} from "./routing";
import {log} from "./logger";

export const recievedData = ([source, size, bytes]) => {
    addToRoutingTable(source);
    log(size, bytes);
}
