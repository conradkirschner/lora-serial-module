import "core-js/stable";
import "regenerator-runtime/runtime";
require('dotenv').config()

import {AODVClient} from "../src/client/AODVClient";
import {fakeResponse, mockedSerial} from "./mockedParser";
import packages from '../src/client/packages';
import {B_route_reply_unicast, B_route_request_broadcast, B_send_hop_ack, C_route_request_broadcast} from "./responses";

process.env.DEVICE_ID = 10;

test('Sends a Message to 15', async () => {

    const mockedPort = mockedSerial();

    const client = new AODVClient(mockedPort);
    client.start();
    await flush(client);

    /**
     * Routing Table is Empty
     * Send a Message to 15
     */
    client.sendMessage('13', 'Hallo Welt');
    /**
     * Send route request broadcast
     */
    await flush(client);
    /**
     * simulate B to answer with route request broadcast
     */


    fakeResponse(B_route_request_broadcast);
    fakeResponse(B_route_reply_unicast);
    await new Promise((resolve, reject) => {
        setTimeout(async ()=> {
            await flush(client);
            resolve();
        }, 500);
    })
    fakeResponse(B_send_hop_ack);
    await new Promise((resolve, reject) => {
        setTimeout(async ()=> {
            await flush(client);
            resolve();
        }, 500);
    })
    fakeResponse(C_route_request_broadcast);
    await new Promise((resolve, reject) => {
        setTimeout(async ()=> {
            await flush(client);
            resolve();
        }, 500);
    })
    await new Promise((resolve, reject) => {
        setTimeout(()=> {
            const history = client.getHistory();
            JSON.stringify(history);
            resolve();
        }, 10*1000);
    });
});

const flush = async (client)=> {
    do{
        // run until it's flushed
    }while (await nextInterval(client))
    console.info('------FLUSHED------');
    // console.info(client.getHistory());
    // console.info('------HISTORY------');
}
const nextInterval =async (client) => {
    client.nextCommand();
    return await client.runCommand();
}
