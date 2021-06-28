import packages from "../../src/client/packages";

export const prefillRouteReply = ($routeReplyPanel, routeRequestData) => {

}
/**
 *
 * @type function(*, *=, *): *
 * @type
 * @param $logEntry
 * @param type
 * @param deviceId
 * @param routeRequestResponse
 * @param tabShowActions
 */
export const prefillRouteReplyOnClick = ($logEntry, type, deviceId, routeRequestResponse, tabShowActions) => {
    $logEntry.addEventListener('dblclick', () => {
        switch (type) {
            case 'RREQ':
                if (routeRequestResponse.destinationAddress)
                tabShowActions.showNewRouteReply();
                break;
            case 'RREP':
                tabShowActions.showNewRouteReplyAck();
                break;
            case 'RERR':
                tabShowActions.showNewRouteRequest();
                break;
            case 'RREP_ACK':
                tabShowActions.showNewTextRequest();
                break;
            case 'SEND_TEXT_REQUEST':
                if (routeRequestResponse.destinationAddress === deviceId) {
                    tabShowActions.showNewTextRequestAck();
                } else {
                    tabShowActions.showNewHopAcknowledge();
                }
                break;
            case 'SEND_HOP_ACK':
                break;
            case 'SEND_TEXT_REQUEST_ACK':
                break;
        }
        console.log(routeRequestResponse)
    })
}
