/**
 * Chat specific commands
 */
import {SEPARATOR} from "../_global_constrains";
import {sendText} from "./lora";

export const SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE';
export const sendChatMessage = (deviceId, message) => {
    sendText(`${SEND_CHAT_MESSAGE}${SEPARATOR}${deviceId}${message}`);
}
