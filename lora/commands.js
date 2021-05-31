import {sendCommand} from "./serialConnector";

export const resetModule = async () => {
    await sendCommand(`AT+RST`);
}
export const setAddress =  async (address) => {
    await sendCommand(`AT+ADDR=${address}`);
}
export const setConfig =  async () => {
    await sendCommand('AT+CFG=433000000,5,4,12,4,1,0,0,0,0,3000,8,4')
}

export const getMessages =  async () => {
    await sendCommand('AT+RX');
}
export const sendHello =  async () => {
    await sendCommand('AT+SEND=5')
}
