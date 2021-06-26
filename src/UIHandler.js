

/**
 * Blacklist from websocket
 */
let blacklist = [];
const getBlacklist = () => {
    return blacklist;
}
const setBlacklist= (newBlacklist)=> {
    blacklist = newBlacklist;
}
/**
 * ClientId
 * @type {null|number}
 */
let currentClient = null;
const getCurrentClient = () => {
    return currentClient;
}
const setCurrentClient = (clientId) => {
    currentClient = clientId;
}
/**
 * Event Logger
 * @type {*[]}
 */
const inputEvents = [];
const systemEvents = [];
const outputEvents = [];

const getOutputEvents=() => {
    return outputEvents;
}
const addOutputEvents = (item) => {
    outputEvents.push(item)
}
const getInputEvents=() => {
    return inputEvents;
}
const addInputEvents = (item) => {
    inputEvents.push(item)
}
const getSystemEvents=() => {
    return systemEvents;
}
const addSystemEvents = (item) => {
    systemEvents.push(item)
}

