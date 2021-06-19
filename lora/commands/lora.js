/**
 * Lora specific commands
 */
import {sendCommand} from "../serialConnector";
import {log} from "../logger";

export const resetModule = () => {
    sendCommand(`AT+RST`);
}
export const setAddress =  (address) => {
    sendCommand(`AT+ADDR=${address}`);
}

export const setDestination =  (address) => {
    sendCommand(`AT+DEST=${address}`);
}
export const setBroadcast =  () => {
    sendCommand(`AT+DEST=FFFF`);
}

export const getStatsFromLastMessage =  () => {
    sendCommand(`AT+RSSI?`);
}

export const setConfig =  (
    rfFrequency = 433000000,
    power = 5,
    bandwidth = 9,
    spreadingFactor = 6,
    errorCoding = 4,
    crc = 1,
    implicitHeader = 0,
    rxSingleOn = 0,
    frequencyHopOn = 0,
    hopPeriod = 0,
    rxPacketTimeout = 3000,
    payloadLength = 8,
    preambleLength = 10
) => {
    sendCommand(`AT+CFG=${rfFrequency},${power},${bandwidth},${spreadingFactor},${errorCoding},${crc},${implicitHeader},${rxSingleOn},${frequencyHopOn},${hopPeriod},${rxPacketTimeout},${payloadLength},${preambleLength}`)
}

export const getMessages =  () => {
    sendCommand('AT+RX');
}
export const sendText = (text) => {
    sendCommand(`AT+SEND=${text.length}`)
    sendCommand(text)
    log('send text', text);
}
export const sendPackage = (bytes) => {
    sendCommand(`AT+SEND=${bytes.length}`)
    sendCommand(bytes);
    log('send bytes', bytes);
}
