import {log} from "./logger";

export const ROUTE_LIFETIME = 180
export const DEVICEID = (process.env.DEVICE_ID)? process.env.DEVICE_ID:10;
log('DEVICE_ID: ', DEVICEID);
