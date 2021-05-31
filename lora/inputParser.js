const routingTable = {};

// define default values for routing
const defaults = {
    isBlacklisted: false
};

const addToRoutingTable = (source, parameter = {}) => {
    if (!routingTable[source]) {
        routingTable[source] = {
            ...defaults,
            ...parameter
        }
    }
}

export const recievedData = ([source, size, bytes]) => {
    addToRoutingTable(source);
    console.log(size, bytes);
}
