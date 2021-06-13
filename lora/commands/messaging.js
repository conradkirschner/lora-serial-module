/**
 * Chat specific commands
 */
import {sendPackage, sendText, setAddress} from "./lora";
import {create as createSEND_TEXT_REQUEST} from "../packages/SEND-TEXT-REQUEST";
import {sendCommand} from "../serialConnector";
import {getRoute} from "../routing";
import {create} from "../packages/RREQ";
import {DEVICEID} from "../_global_constrains";

let messageSequenceId = 0;
export const SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE';
export const waitForRoute = {};
export const sendChatMessage = (deviceId, message) => {
    const route = getRoute(deviceId);
    if (route === null) {
        if(waitForRoute[deviceId]) return;

        sendPackage(create(1, 0, DEVICEID, messageSequenceId, deviceId, 1));
        waitForRoute[deviceId] = true;
        return;
    }
    setAddress(route[0]);
    sendPackage(create(16, deviceId, messageSequenceId, message));
    messageSequenceId++;
}
