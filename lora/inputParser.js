import {addToRoutingTable} from "./routing";
import {log} from "./logger";
import {getType} from "./packages/types";
import {getStatsFromLastMessage, sendPackage, setBroadcast, setDestination} from "./commands/lora";
import {createPackage} from "./packages";
import {create as createRREP, read as readRREP} from "./packages/RREP";
import {create as createRREQ, read as readRREQ} from "./packages/RREQ";
import {create as createRERR, read as readRERR} from "./packages/RERR";
import {create as createRREP_ACK} from "./packages/RREP-ACK";
import {create as createSEND_TEXT_REQUEST} from "./packages/SEND-TEXT-REQUEST";
import {create as createSEND_HOP_ACK} from "./packages/SEND-HOP-ACK";
import {create as createSEND_TEXT_REQUEST_ACK} from "./packages/SEND-TEXT-REQUEST-ACK";
import {DEVICEID} from "./index";
import {ROUTE_LIFETIME} from "./_global_constrains";
import {waitForRoute} from "./commands/messaging";

export const recievedData = ([source, size, bytes]) => {
    getStatsFromLastMessage();
    log(size, bytes);
    parseData(source, bytes);
}
const parseData = (source, data) => {
    const [typeByte, ...restData] = data;
    const type = getType(typeByte);
    switch (type) {
        case 'RREQ':
            const rreq_data = readRREQ(restData);
            if (rreq_data.destinationAddress === DEVICEID) {
                addToRoutingTable(source, { nodes: [rreq_data.originAddress]});
                setDestination(source);
                delete waitForRoute[rreq_data.originAddress];
                log('Got Route:', source, { nodes: [rreq_data.originAddress]})
                sendPackage(
                    createRREP( rreq_data.hopCount,  rreq_data.originAddress,  rreq_data.destinationAddress,  rreq_data.destinationSequenceNumber, ROUTE_LIFETIME)
                );
                break;
            }
            setBroadcast();
            rreq_data.hopCount++;
            sendPackage(
                createRREQ((rreq_data.uflag), rreq_data.hopCount, rreq_data.originAddress, rreq_data.originSequenceNumber, rreq_data.destinationAddress, rreq_data.destinationSequenceNumber)
            );
            setTimeout(()=> {
                createSEND_HOP_ACK();
            }, 1000);
            break;
        case 'RREP':
            setDestination(source);
            sendPackage(
                createRREP_ACK()
            );
            break;
        case 'RERR':
            break;
        case 'RREP_ACK':
            /**
             * maybe set here to routeing table?
             */

            break;
        case 'SEND_TEXT_REQUEST':
            break;
        case 'SEND_HOP_ACK':
            break;
        case 'SEND_TEXT_REQUEST_ACK':
            break;

    }
}
