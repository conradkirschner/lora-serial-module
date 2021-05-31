import {sendCommand} from "./serialConnector";

export const resetModule = async () => {
    await sendCommand(`AT+RST`);
}
export const setAddress =  async (address) => {
    await sendCommand(`AT+ADDR=${address}`);
}

export const setConfig =  async (
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
    await sendCommand(`AT+CFG=${rfFrequency},${power},${bandwidth},${spreadingFactor},${errorCoding},
${crc},${implicitHeader},${rxSingleOn},${frequencyHopOn},${hopPeriod},${rxPacketTimeout},
${payloadLength},${preambleLength}`)
}

export const getMessages =  async () => {
    await sendCommand('AT+RX');
}
export const sendHello =  async () => {
    await sendCommand('AT+SEND=5')
}
