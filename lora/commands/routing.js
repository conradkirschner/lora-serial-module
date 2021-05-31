/**
 * Routing specific commands
 */
import {SEPARATOR} from "../_global_constrains";
import {sendText} from "./lora";

export const ROUTE_REQUEST = 'ROUTE_REQUEST';
export const ROUTE_REPLIES = 'ROUTE_REPLIES';
export const ROUTE_ERROR = 'ROUTE_ERROR';

export const routeRequest = (requestToPartner) => {
    sendText(`${ROUTE_REQUEST}${SEPARATOR}${requestToPartner}`);
}

export const routeReplies = (routePossibilities) => {
    sendText(`${ROUTE_REPLIES}${SEPARATOR}${routePossibilities}`);
}

export const routeErrors = (errorCode) => {
    sendText(`${ROUTE_ERROR}${SEPARATOR}${errorCode}`);
}
