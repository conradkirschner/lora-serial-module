import {log} from "./logger";

const routingTable = {};

// define default values for routing
const defaults = {
    isBlacklisted: false
};

export const addToRoutingTable = (source, parameter = {}) => {
    log("Routing Table" + routingTable);
    if (!routingTable[source]) {
        routingTable[source] = {
            ...defaults,
            ...parameter
        }
    }
}
