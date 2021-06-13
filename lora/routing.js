const routingTable = {};

// define default values for routing
const defaults = (id) => {
    const timestamp = new Date();
    return {
        isBlacklisted: false,
        timestamp,
        nodes: [],
        id,
    }
};
routingTable[12] ={
    isBlacklisted: false,
    timestamp: new Date(),
    nodes: [13],
    id: 12,
}
routingTable[13] ={
    isBlacklisted: false,
    timestamp: new Date(),
    nodes: [],
    parent: 12,
    id: 13,
}
export const addToRoutingTable = (source, parameter = { nodes: []}) => {
    if (!routingTable[source]) {
        routingTable[source] = {
            ...defaults(),
            ...parameter
        }
        return;
    }
    for (let i = 0; i < parameter.nodes.length; i++ ) {
        const currentParameter = parameter.nodes[i];
        if (!routingTable[currentParameter]) {
            routingTable[source] = defaults(source);
        }
    }
    routingTable[source].nodes = [...routingTable[source].nodes, ...parameter.nodes ]
}
/***
 * - nodes:
 *   - 11:
 *       - 12:
 *           - 13
 *
 *
 *
 * @param deviceId
 * @param routingTable
 */

export const getRoute = (deviceId, routingTable) => {
    if (!routingTable) return null;
    return Object.keys(routingTable).forEach(k => {
        const routingObject = routingTable[k];
        for (let i = 0; i < routingObject.nodes.length; i++) {
            const currentNode = routingObject.nodes[i]
            const item = found(routingObject, currentNode, deviceId);
            if (item !== null) {
                return item;
            }
        }
        return null;
    })
}
const found = (routingObject,currentNode,deviceId) => {
    if (currentNode === deviceId) {
        if (!routingObject[currentNode].parent) {
            return routingObject[currentNode];
        }
        return found(routingObject, routingObject[routingObject[currentNode].parent], deviceId);
    }
    return null;
}
