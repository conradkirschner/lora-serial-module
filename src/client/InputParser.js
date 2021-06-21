import {getStatsFromLastMessage, setBroadcast, setDestination} from "./commands/lora";
import {log} from "../logger";
import {getType} from "./packages/types";
import {DEVICEID, ROUTE_LIFETIME} from "../_global_constrains";
import packages from "./packages";
import {RouteEntry} from "./routing/RouteEntry";

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
        const possibleRoute = new RouteEntry(source, null, 0, 0, 0);
        this.client.router.addRouteIfNotExist(possibleRoute)

        const type = getType(data[0]);
        const byteData = Buffer.from(data);
        const packageData = byteData.slice(1, byteData.length);
        log('Type', byteData, type);

        switch (type) {
            case 'RREQ':
                const rreq_data = packages.read.rreq(packageData);
                if (rreq_data.destinationAddress === DEVICEID) {
                    this.client.pushCommand(setDestination(source));
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

                this.client.pushSendCommand(packages.send.rreq((rreq_data.uflag), rreq_data.hopCount, rreq_data.originAddress, rreq_data.originSequenceNumber, rreq_data.destinationAddress, rreq_data.destinationSequenceNumber));

                setTimeout(()=> {
                    this.client.pushSendCommand(packages.send.send_hop_ack());
                }, 1000);
                break;
            case 'RREP':
                const rrep_data = packages.read.rrep(packageData);

                const route = new RouteEntry();
                this.client.router.addRoute()
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
