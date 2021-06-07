import {addToRoutingTable} from "./routing";
import {log} from "./logger";
import {SEPARATOR} from "./_global_constrains";
import {SEND_CHAT_MESSAGE} from "./commands/messaging";
import {ROUTE_ERROR, ROUTE_REPLIES, ROUTE_REQUEST} from "./commands/routing";
import {getStatsFromLastMessage, sendText} from "./commands/lora";

export const recievedData = ([source, size, bytes]) => {
    getStatsFromLastMessage();
    addToRoutingTable(source);
    log(size, bytes);
    parseData(bytes);

}
const parseData = (data) => {
    const [command, ...dataBlock] = data.split(SEPARATOR)
    if (command === SEND_CHAT_MESSAGE) {
        const [device, messageText] = dataBlock.split(SEPARATOR);
        return;
    }
    if (command === ROUTE_REQUEST) {
        const [device, messageText] = dataBlock.split(SEPARATOR);
        return;
    }
    if (command === ROUTE_REPLIES) {
        const [device, messageText] = dataBlock.split(SEPARATOR);

        return;
    }
    if (command === ROUTE_ERROR) {
        const [device, messageText] = dataBlock.split(SEPARATOR);

        return;
    }
}
