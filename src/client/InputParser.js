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
        const possibleRoute = new RouteEntry(source, 0, 0, null);
        this.client.router.addRouteIfNotExist(possibleRoute)

        const type = getType(data[0]);
        const byteData = Buffer.from(data);
        const packageData = byteData.slice(1, byteData.length);
        log('Type', byteData, type);

        switch (type) {
            case 'RREQ':
                const rreq_data = packages.read.rreq(packageData);
                if (rreq_data.destinationAddress == DEVICEID) {
                    log('Got Route:', source, { nodes: [rreq_data.originAddress]})
                    this.client.pushCommand(setDestination(source));
                    const newRoute = new RouteEntry(rreq_data.destinationAddress, rreq_data.hopCount, rreq_data.destinationSequenceNumber, source)
                    this.client.router.addRouteIfNotExist(newRoute);
                    console.log("Added routes");
                    console.log(this.client.router.routes);
                    this.client.pushSendCommand(packages.send.rrep(
                        rreq_data.hopCount,
                        rreq_data.originAddress,
                        rreq_data.destinationAddress,
                        rreq_data.destinationSequenceNumber,
                        ROUTE_LIFETIME
                    ));
                    break;
                }
                // check if node can route this request
                const possibleRoute = this.client.router.getRoute(rreq_data.destinationAddress);
                console.log(possibleRoute, JSON.stringify(this.client.router.routes));
                if (possibleRoute) {
                    if (possibleRoute.dest_sequence_num >= rreq_data.originSequenceNumber) {
                        this.client.pushCommand(setDestination(source));
                        this.client.pushSendCommand(packages.send.rrep(
                            possibleRoute.hops++,
                            rreq_data.originAddress,
                            rreq_data.destinationAddress,
                            rreq_data.destinationSequenceNumber,
                            ROUTE_LIFETIME
                        ));
                    }
                    break;
                }

                this.client.pushCommand(setBroadcast());
                rreq_data.hopCount = rreq_data.hopCount++;

                this.client.pushSendCommand(
                    packages.send.rreq(
                        (rreq_data.uflag),
                        rreq_data.hopCount,
                        rreq_data.rreq_id,
                        rreq_data.originAddress,
                        rreq_data.originSequenceNumber,
                        rreq_data.destinationAddress,
                        rreq_data.destinationSequenceNumber
                    ));

                setTimeout(()=> {
                    this.client.pushCommand(setDestination(source));
                    this.client.pushSendCommand(packages.send.send_hop_ack());
                }, 4000);
                break;
            case 'RREP':
                const rrep_data = packages.read.rrep(packageData);
                const newRoute = new RouteEntry(rrep_data.destinationAddress, rrep_data.hopCount, rrep_data.destinationSequenceNumber, source)
                const index = this.client.router.findRoute(newRoute);
                if (index === -1 ) {
                    this.client.router.addRouteIfNotExist(newRoute)
                } else {
                    console.log('FOUND ROUTE ', index, ' - update it');

                    this.client.router.updateRoute(newRoute)
                }
                console.log('current log',   this.client.router);
                this.client.pushCommand(setDestination(source));
                this.client.pushSendCommand(packages.send.rrep_ack());
                break;
            case 'RERR':
                break;
            case 'RREP_ACK':

                break;
            case 'SEND_TEXT_REQUEST':
                const send_text_request_data = packages.read.send_text_request(packageData);
                // yay we got a message for us, so we can store them
                if (send_text_request_data.destinationAddress === DEVICEID) {
                    this.client.messageHandler.addChatMessage(send_text_request_data.originAddress, send_text_request_data.message, send_text_request_data.destinationAddress);
                    break;
                }
                const route = this.client.router.getRoute(send_text_request_data.destinationAddress);
                if (route) {
                    this.client.pushCommand(setDestination(route));
                    this.client.pushSendCommand(
                        packages.send.send_text_request(
                            send_text_request_data.originAddress,
                            send_text_request_data.destinationAddress,
                            send_text_request_data.MessageSequenceNumber,
                            send_text_request_data.message
                        )
                    );
                    setTimeout(()=> {
                        this.client.pushCommand(setDestination(source));
                        this.client.pushSendCommand(
                            packages.send.send_hop_ack()
                        );
                    }, 2000);

                }

                break;
            case 'SEND_HOP_ACK':

                break;
            case 'SEND_TEXT_REQUEST_ACK':
                setTimeout(()=> {
                    this.client.pushCommand(setDestination(source));
                    this.client.pushSendCommand(
                        packages.send.send_text_request_ack()
                    );
                }, 1000);
                break;
            case 'RERR':
                break;
            case 'RREP_ACK':
        }
    }
}
