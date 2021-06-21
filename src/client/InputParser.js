import {getStatsFromLastMessage, setBroadcast, setDestination} from "./commands/lora";
import {log} from "../logger";
import {getType} from "./packages/types";
import {DEVICEID, ROUTE_LIFETIME} from "../_global_constrains";
import packages from "./packages";

export class InputParser {
    client;

    constructor(client) {
        this.client = client;
    }

    recievedData ([source, size, bytes]) {
        getStatsFromLastMessage();
        log(size, bytes);
        this.parseData(source, bytes);
    }
    parseData (source, data) {
        const [typeByte, ...restData] = data;

        const type = getType(typeByte);
        log('Type', typeByte, type);

        switch (type) {
            case 'RREQ':
                const rreq_data = packages.read.rreq(restData);
                if (rreq_data.destinationAddress === DEVICEID) {
                    setDestination(source);
                    log('Got Route:', source, { nodes: [rreq_data.originAddress]})
                    this.client.pushSendCommand(packages.send.rrep(
                        rreq_data.hopCount,
                        rreq_data.originAddress,
                        rreq_data.destinationAddress,
                        rreq_data.destinationSequenceNumber,
                        ROUTE_LIFETIME
                    ));
                    break;
                }
                this.client.pushCommand(setBroadcast());
                rreq_data.hopCount++;

                this.client.pushSendCommand(packages.send.rrep((rreq_data.uflag), rreq_data.hopCount, rreq_data.originAddress, rreq_data.originSequenceNumber, rreq_data.destinationAddress, rreq_data.destinationSequenceNumber));

                setTimeout(()=> {
                    this.client.pushSendCommand(packages.send.send_hop_ack());
                }, 1000);
                break;
            case 'RREP':
                this.client.pushCommand(setDestination(source));
                this.client.pushSendCommand(packages.send.rrep_ack());
                break;
            case 'RERR':
                break;
            case 'RREP_ACK':
                break;
            case 'SEND_TEXT_REQUEST':
                break;
            case 'SEND_HOP_ACK':
                break;
            case 'SEND_TEXT_REQUEST_ACK':
                break;

        }
    }
}
