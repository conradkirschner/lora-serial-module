import {getStatsFromLastMessage, setBroadcast, setDestination} from "./commands/lora";
import {log} from "../logger";
import {getType} from "./packages/types";
import {DEVICEID, ROUTE_LIFETIME} from "../_global_constrains";
import packages from "./packages";
import {LIFETIME, RouteEntry} from "./routing/RouteEntry";

/**
 *
 * @type {number}
 */
export let sequenceNumber = 0;
export let requestId = 0;

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
        const type = getType(data[0]);
        const byteData = Buffer.from(data);
        const packageData = byteData.slice(1, byteData.length);
        log('Type: ', type, byteData );

        switch (type) {
            case 'RREQ':
                const rreq_data = packages.read.rreq(packageData);
                if ( rreq_data.originAddress == DEVICEID) {
                    break;
                }

                const reversereRoute = new RouteEntry(
                    parseInt(source),
                    rreq_data.hopCount,
                    0,
                    0,
                    [],
                    Date.now() + LIFETIME,
                    false
                );
                // @todo add if not valid || not there
                this.client.router.addRouteIfNotExist(reversereRoute, parseInt(source));
                /**
                 *
                 * @type {RouteEntry|null}
                 */
                const routeFound = this.client.router.getRoute(rreq_data.originAddress);
                // -128 - 127 = -255

                /**
                 * if bigger 0 then request data is new
                 * if 0 is equal
                 * if less shit
                 *
                 * if route undefined
                 * @type {number}
                 */
                if (routeFound !== null){
                    const calculate = (routeFound.sequenceNumber == null)?1:(rreq_data.originSequenceNumber - routeFound.sequenceNumber) & 0xff;
                    if (calculate < 0) { break; }
                    else if (calculate === 0) { // equal
                        const calculate = (routeFound.requestId == null)?1:(rreq_data.rreq_id - routeFound.requestId) & 0xff; // <= 0 break; (ignore)
                        if (calculate <= 0) break;
                    }
                }
                /** update broadcast ID **/
                if (routeFound) {
                    routeFound.requestId = rreq_data.rreq_id
                }
                rreq_data.hopCount   += 1;

                /**
                 * reverse route to origin
                 */
                const reverserRouteOrigin = new RouteEntry(
                    parseInt(rreq_data.originAddress),
                    rreq_data.hopCount,
                    rreq_data.rreq_id,
                    rreq_data.originSequenceNumber,
                    [],
                    Date.now() + LIFETIME,
                    true
                );
                // @todo add if not valid || not there
                this.client.router.addRouteIfNotExist(reverserRouteOrigin, parseInt(source));

                if (rreq_data.destinationAddress == DEVICEID) {
                    log('Got Route:', source, { nodes: [rreq_data.originAddress]})
                    /**
                     *   this.nextNode = nextNode;
                     this.hopCount = hopCount;
                     this.sequenceNumber = sequenceNumber;
                     this.precursors = precursors;
                     this.expiringTime = expiringTime;
                     this.valid = valid;
                     * @type {RouteEntry}
                     */
                    // const newRoute = new RouteEntry(
                    //     parseInt(source),
                    //     rreq_data.hopCount,
                    //     rreq_data.destinationSequenceNumber,
                    //     rreq_data.destinationAddress
                    // );
                    console.log("Added routes");

                    this.client.pushCommand(setDestination(source));
                    // this.client.router.addRouteIfNotExist(newRoute);
                    console.log('GOT ROUTES:', this.client.router.routes);

                        /**
                         * incremental unsigned "binary-like"
                         */
                    const newSequenceNumber = (sequenceNumber === 127)?-128:++sequenceNumber;
                    if (newSequenceNumber === rreq_data.destinationSequenceNumber) {
                        sequenceNumber = newSequenceNumber;
                    }
                    /***
                     * check if already sended
                     */
                    this.client.pushSendCommand(packages.send.rrep(
                        rreq_data.hopCount,
                        rreq_data.originAddress,
                        rreq_data.destinationAddress,
                        sequenceNumber,
                        ROUTE_LIFETIME
                    ));
                    break;
                }

                // check if node can route this request
                const id = process.env.DEVICE_ID;

                // const getNodeId = this.client.router.getRoutingNode(rreq_data.destinationAddress);
                // const possibleRoute = this.client.router.getRoute(getNodeId);
                // console.log('possibleRoute', possibleRoute, JSON.stringify(this.client.router.routes));

                /**
                 * We don't answer that
                 */
                // if (possibleRoute === null) {
                //     if (possibleRoute.dest_sequence_num <= rreq_data.originSequenceNumber) {
                //         this.client.pushCommand(setDestination(source));
                //         this.client.pushSendCommand(packages.send.rrep(
                //             possibleRoute.hops++,
                //             rreq_data.originAddress,
                //             rreq_data.destinationAddress,
                //             rreq_data.destinationSequenceNumber,
                //             ROUTE_LIFETIME
                //         ));
                //     }
                //     break;
                // }

                this.client.pushCommand(setBroadcast());

                let sequenceMax = rreq_data.destinationSequenceNumber
                const calculate = ( rreq_data.uflag === 1)?0:( rreq_data.destinationSequenceNumber - sequenceNumber) & 0xff;
                if (calculate <= 0) {
                    sequenceMax =  sequenceNumber;
                } else {
                    sequenceMax =  rreq_data.destinationSequenceNumber;
                }
                this.client.pushSendCommand(
                    packages.send.rreq(
                        rreq_data.uflag,
                        rreq_data.hopCount,
                        rreq_data.rreq_id,
                        rreq_data.originAddress,
                        rreq_data.originSequenceNumber,
                        rreq_data.destinationAddress,
                        sequenceMax,
                    ));

                this.client.pushCommand(setDestination(source));
                this.client.pushSendCommand(packages.send.send_hop_ack());
                break;
            case 'RREP':
                const rrep_data = packages.read.rrep(packageData);

                /**
                 * Acknowledge
                 */

                this.client.pushCommand(setDestination(source));
                this.client.pushSendCommand(packages.send.rrep_ack());

                /**
                 * check if source is already in routing table
                 */
                const sourceRoute = this.client.router.getRoute(parseInt(source));
                if (sourceRoute === null) {
                    const sourceRouteEntry = new RouteEntry(
                        parseInt(source),
                        1,
                        0,
                        0,
                        [],
                        Date.now() + LIFETIME,
                        true
                    );
                    this.client.router.addRouteIfNotExist(sourceRouteEntry, parseInt(source));
                }
                /**
                 * Check if this node can route this request
                 */
                const destinationRoute = this.client.router.getRoute(rrep_data.destinationAddress);
                let sequenceMaxRREP = rrep_data.destinationSequenceNumber;
                const valid = ( rrep_data.uflag === 1)?0:( rrep_data.destinationSequenceNumber - sequenceNumber) & 0xff;

                if (destinationRoute === null) {
                    const routeReplySourceEntry = new RouteEntry(
                        rrep_data.destinationAddress,
                        rrep_data.hopCount,
                0,
                        0,
                        [],
                        Date.now() + LIFETIME,
                        true
                    );
                    this.client.router.addRouteIfNotExist(routeReplySourceEntry, source);
                } else if (
                    (
                        destinationRoute.sequenceNumber == null ||
                        destinationRoute.sequenceNumber === 0
                    )
                    ||
                    (
                        valid <= 0 ||
                        rrep_data.hopCount < destinationRoute.hopCount
                    )
                ) {
                    /**
                     * Update Route
                     * @type {RouteEntry}
                     */
                        const updateRouteEntry = new RouteEntry(
                            rrep_data.destinationAddress,
                            rrep_data.hopCount,
                            0,
                            rrep_data.destinationSequenceNumber,
                            [],
                            Date.now() + LIFETIME,
                            true
                        );
                        this.client.router.addRouteIfNotExist(updateRouteEntry, parseInt(source));
                    }

                /**
                 * @type {{destinationAddress: *, originAddress: *, hopCount: *, lifetime: *, destinationSequenceNumber: *}}
                 */
                if (destinationRoute !== null) {
                    console.log('current log', JSON.stringify(this.client.router));
                    this.client.pushCommand(setDestination(destinationRoute.source));
                    this.client.pushSendCommand(
                        packages.send.rrep(
                            rrep_data.originAddress,
                            rrep_data.destinationAddress,
                            rrep_data.hopCount,
                            rrep_data.lifetime,
                        )
                    );
                }

                break;
            case 'RERR':
                break;
            case 'RREP_ACK':

                break;
            case 'SEND_TEXT_REQUEST':
                const send_text_request_data = packages.read.send_text_request(packageData);
                // yay we got a message for us, so we can store them
                if (send_text_request_data.destinationAddress == DEVICEID) {
                    this.client.messageHandler.addChatMessage(send_text_request_data.originAddress, send_text_request_data.message, send_text_request_data.destinationAddress);
                    break;
                }
                /**
                 *
                 * @type {}
                 */
                const route = this.client.router.getRoute(send_text_request_data.destinationAddress);
                if (route) {
                    this.client.pushCommand(setDestination(route.source));
                    this.client.pushSendCommand(
                        packages.send.send_text_request(
                            send_text_request_data.originAddress,
                            send_text_request_data.destinationAddress,
                            send_text_request_data.MessageSequenceNumber,
                            send_text_request_data.message
                        )
                    );
                    this.client.pushCommand(setDestination(source));
                    this.client.pushSendCommand(
                        packages.send.send_hop_ack()
                    );

                }

                break;
            case 'SEND_HOP_ACK':

                break;
            case 'SEND_TEXT_REQUEST_ACK':
                    this.client.pushCommand(setDestination(source));
                    this.client.pushSendCommand(packages.send.send_text_request_ack());
                break;
            case 'RERR':
                break;
            case 'RREP_ACK':
        }
    }
}
