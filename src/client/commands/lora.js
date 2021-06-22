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
// current: AT+CFG=433000000,20,9,10,4,1,0,0,0,0,3000,8,10
export const setConfig =  () => {
    return `AT+CFG=433000000,20,9,10,4,1,0,0,0,0,3000,8,10`
}

export const getMessages =  () => {
    return 'AT+RX';
}
export const sendText = (text) => {
    return `AT+SEND=${text.length}`;
}
