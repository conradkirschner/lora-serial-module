/**
 * Chat specific commands
 */
import {setAddress} from "./lora";
import {create} from "../packages/RREQ";

// let messageSequenceId = 0;
// export const SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE';
// export const waitForRoute = {};
// export const sendChatMessage = (deviceId, message) => {
//     const route = getRoute(deviceId);
//     if (route === null) {
//         if(waitForRoute[deviceId]) return;
//
//         sendPackage(create(1, 0, DEVICEID, messageSequenceId, deviceId, 1));
//         waitForRoute[deviceId] = true;
//         return;
//     }
//     setAddress(route[0]);
//     sendPackage(create(15, deviceId, messageSequenceId, message));
//     messageSequenceId++;
// }
