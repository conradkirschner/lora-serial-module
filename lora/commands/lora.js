/**
 * Lora specific commands
 */
import {lastMessageStats, sendCommand} from "../serialConnector";

export const resetModule = () => {
    sendCommand(`AT+RST`);
}
export const setAddress =  (address) => {
    lastMessageStats.timestamp = new Date();
    sendCommand(`AT+ADDR=${address}`);
}

export const getStatsFromLastMessage =  () => {
    sendCommand(`AT+RSSI?`);
}

export const setConfig =  (
    rfFrequency = 433000000,
    power = 20,
    bandwidth = 9,
    spreadingFactor = 12,
    errorCoding = 4,
    crc = 1,
    implicitHeader = 0,
    rxSingleOn = 0,
    frequencyHopOn = 0,
    hopPeriod = 0,
    rxPacketTimeout = 3000,
    payloadLength = 8,
    preambleLength = 4
) => {
    sendCommand(`AT+CFG=${rfFrequency},${power},${bandwidth},${spreadingFactor},${errorCoding},${crc},${implicitHeader},${rxSingleOn},${frequencyHopOn},${hopPeriod},${rxPacketTimeout},${payloadLength},${preambleLength}`)
}

export const getMessages =  () => {
    sendCommand('AT+RX');
}
export const sendText = (text) => {
    sendCommand(`AT+SEND=${text.length}`)
    sendCommand(text)
}
