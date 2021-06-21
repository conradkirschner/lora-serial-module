import {log} from "./logger";

export const ROUTE_LIFETIME = 3000
export const DEVICEID = (process.env.DEVICE_ID)? process.env.DEVICE_ID:10;
log('DEVICE_ID: ', DEVICEID);
