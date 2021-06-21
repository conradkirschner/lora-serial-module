/**
 * Lora specific commands
 */
export const resetModule = () => {
   return `AT+RST`;
}
export const setAddress =  (address) => {
    return `AT+ADDR=${address}`;
}

export const setDestination =  (address) => {
    return `AT+DEST=${address}`;
}
export const setBroadcast =  () => {
    return `AT+DEST=FFFF`;
}

export const getStatsFromLastMessage =  () => {
    return `AT+RSSI?`;
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
    return `AT+CFG=${rfFrequency},${power},${bandwidth},${spreadingFactor},${errorCoding},${crc},${implicitHeader},${rxSingleOn},${frequencyHopOn},${hopPeriod},${rxPacketTimeout},${payloadLength},${preambleLength}`
}

export const getMessages =  () => {
    return 'AT+RX';
}
export const sendText = (text) => {
    return `AT+SEND=${text.length}`;
}
