import {getType} from "./../../src/client/packages/types";
import packages from "../../src/client/packages";
import {DEVICEID, ROUTE_LIFETIME} from "../../src/_global_constrains";
import {LIFETIME, RouteEntry} from "../../src/client/routing/RouteEntry";
import {log} from "../../src/logger";
import {setBroadcast, setDestination} from "../../src/client/commands/lora";
import {incrementSequenceNumber} from "../../src/client/InputParser";

/**
 * @var renderInto HTMLElement
 * @param renderInto
 **/
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
const formattedTimestamp = () => {
    const currentdate = new Date();
    return currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
}
const formatBinaryInput = ( sended, showText = '' )=> {
    for (let i = 0; i < sended.length; i++) {
        try {
            debugger;
            if (sended instanceof Uint8Array) {
                showText += parseInt(sended[i].toString(2), 2) + '-';
            } else {
                showText += parseInt(sended[i].charCodeAt(0)) + '-';
            }
        } catch (e) {
            showText += sended[i];
        }
    }
   return showText.substring(0, showText.length -1 ) ;
}
export const createSerialConsole = (renderInto, connectToDeviceId, attachEvents) => {
    /**
     * first create container
     **/
    const id = makeid(5);
    const serialConsole = document.createElement('div');
    serialConsole.id = id;
    serialConsole.classList.add('serial-console-window');

    serialConsole.innerHTML = `
            <div style="width:100%"> <div data-id="header" class="serial-console-header">
                <span>Serial Console -  <span data-id="device-id">...</span></span>
                 <span data-id="readonly-label" class="readonly-label hidden">readonly <a class="full-log-toggle"  href="javascript:false" data-id="full-log-toggle"> (active full log)</a></span>
                 <span data-id="window-close-button" class="serial-console-close-button">❌</span>
            </div></div>
            <div class="serial-console-wrapper">
            <div data-id="serial-console-container" class="serial-console-container serial-console-container--active">

            <div data-id="status-bar">
                <div> Ist im Wlan: <span data-id="is-lan">...</span></div>
                <div> Blacklist: <span class="blacklist-container" data-id="blacklist">...</span></div>
            </div>
            <div data-id="log-container" class="serial-console-log-container">
                Log:
                <div data-id="log"></div>
            </div>
            <div data-id="footer" class="serial-console-footer">
                <div data-id="send-text-serial">
                    <div>Serial Text Input</div>
                    <input data-id="send-text-serial-button-input" type="text" />
                    <button data-id="send-text-serial-button">senden</button>
                </div>
                <button data-id="show-packages-button">Show packages</button>
                 <div data-id="show-packages-container">
                    <button data-id="show-packages-button"><label><input data-id="follow-log-toggle" type="checkbox"> follow log </label></button>
                </div>

            </div>
            <div data-id="expanded-modal" class="modal-container">
                <div data-id="expanded-modal-menu">
                    <button class="expaneded-modal-menu-item" data-id="show-new-route-request">Route Request</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-route-reply">Route Reply</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-route-reply-ack">Route Reply Acknowledge</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-route-error">Route Error</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-send-hop-acknowledge">Send Hop Acknowledge</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-send-text-request">Send Text Request</button>
                    <button class="expaneded-modal-menu-item" data-id="show-new-send-text-request-acknowledge">Send Text Request Acknowledge</button>
                </div>
                <hr>
                <div data-id="expanded-modal-body">
                    <div class="expaneded-modal-new-input-container " data-id="expaneded-modal-new-route-request">
                        <div>Route Request</div>
                        <div><span>uflag</span><span><input type="text" value="1"></span> </div>
                        <div><span>Hop Count</span><span><input type="text" value="1"></span> </div>
                        <div><span>Request Id</span><span><input type="text" value="1"></span> </div>
                        <div><span>Origin Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Origin Sequence Number</span><span><input type="text" value="1"></span> </div>
                        <div><span>Destination Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Destination Sequence Number</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><button>senden</button> </div>
                    </div>

                    <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-route-reply-ack">
                        <div>Route Reply Acknowledge </div>
                        <div><button>senden</button> </div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-route-reply">
                        <div>Route Reply</div>
                        <div><span>Hop Count</span><span><input type="text" value="1"></span> </div>
                        <div><span>Origin Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Origin Sequence Number</span><span><input type="text" value="1"></span> </div>
                        <div><span>Destination Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Lifetime</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><button>senden</button> </div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-route-error">
                        <div>Route Error</div>
                        <div><span>Destination Count</span><span><input type="text" value="1"></span> </div>
                        <div><span>Unreachable Destination Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Unreachable Destination Sequence Number</span><span><input type="text" value="1"></span> </div>
                        <div><span>additionalAddresses</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>additionalSequenceNumber</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><button>senden</button> </div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-send-hop-acknowledge">
                        <div>Send Hop Acknowledge</div>
                        <div><span>messageSequenceNumber</span><span><input type="text" value="1"></span> </div>
                        <div><button>senden</button> </div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-send-text-request">
                        <div>Send Text Request</div>
                        <div><span>Origin Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>Destination Address</span><span><input type="number" min="1" max="20" value="1"></span> </div>
                        <div><span>messageSequenceNumber</span><span><input type="text" value="1"></span> </div>
                        <div><span>message</span><span><input type="text" maxlength="30" value="payload"></span> </div>
                        <div><button>senden</button> </div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-new-send-text-request-acknowledge">
                        <div>Send Text Request Acknowledge</div>
                        <div><button>senden</button></div>
                    </div>
                </div>
            </div>
            </div>
            <div class="sorted-logs-wrapper">
                <div data-id="expaneded-modal-new-input-container">
                <div>
                    <div class="table-title">Route Requests</div>
                    <div class="table8" data-id="log-route-request">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>U-Flag</span>
                            <span>Request Id</span>
                            <span>Origin Address</span>
                            <span>Origin SequenceNumber</span>
                            <span>Destination Address</span>
                            <span>Destination Sequence Number</span>
                        </div>
                        <div>
                            <span>1:56:7</span>
                            <span>10</span>
                            <span>1</span>
                            <span>1</span>
                            <span>1</span>
                            <span>1</span>
                            <span>1</span>
                            <span>1</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-title">Route Reply</div>
                    <div class="table7" data-id="log-route-reply">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>Hop Count</span>
                            <span>Origin Address</span>
                            <span>Destination Address</span>
                            <span>Destination Sequence Number</span>
                            <span>Lifetime</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-title">Route Errors</div>
                    <div class="table7" data-id="log-route-error">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>Destination Count</span>
                            <span>Unreachable Destination Address</span>
                            <span>Unreachable Destination Sequence Number</span>
                            <span>Additional Addresses</span>
                            <span>Additional Sequence Number</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-title">Send Text Request</div>
                    <div class="table6" data-id="log-send-text-request">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>Origin Address</span>
                            <span>Destination Address</span>
                            <span>Message Number</span>
                            <span>Message</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-title">Route Reply Acknowledge</div>
                    <div class="table2" data-id="log-route-reply-ack">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-title">Send Text Request Acknowledge</div>
                    <div class="table3" data-id="log-send-text-ack">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>Origin Address</span>
                        </div>
                    </div>
                </div>
                  <div>
                    <div class="table-title">Send Hop Acknowledge</div>
                    <div class="table3" data-id="log-send-hop-ack">
                        <div>
                            <span>Time</span>
                            <span>Sender</span>
                            <span>Message Sequence Number</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
</div>
    `;

    renderInto.appendChild(serialConsole);
    setTimeout(()=> {
        const connection = new WebSocket('ws://localhost:8001/'+connectToDeviceId, ['soap', 'xmpp']);
        const log = [];
        let deviceId = undefined;
        let isReadOnly = undefined;
        let blacklist = undefined;
        let lan = undefined;
        let zIndex = 0;
        let shouldFollow = false;
        let isFullLog = false;
        const $windowCloseButton = document.querySelector(getQuerySelector(id,'window-close-button'));
        const $header = document.querySelector(getQuerySelector(id,'header'));
        const $log = document.querySelector(getQuerySelector(id,'log'));
        const $logContainer = document.querySelector(getQuerySelector(id,'log-container'));
        const $deviceId = document.querySelector(getQuerySelector(id, 'device-id'));
        const $readonlyLabel = document.querySelector(getQuerySelector(id, 'readonly-label'));
        const $blacklist = document.querySelector(getQuerySelector(id ,'blacklist'));
        const $lanContainer = document.querySelector(getQuerySelector(id, 'is-lan'));
        const $fullLogToggleButton = document.querySelector(getQuerySelector(id, 'full-log-toggle'));
        const $sendCommandButton = document.querySelector(getQuerySelector(id,'send-text-serial-button'));
        const $sendCommandButtonInput = document.querySelector(getQuerySelector(id,'send-text-serial-button-input'));
        const $followLogToggle = document.querySelector(getQuerySelector(id,'follow-log-toggle'));
        const $serialConsoleContainer = document.querySelector(getQuerySelector(id,'serial-console-container'));

        /**
         * Table Log
         */
        const $logRouteRequest =  document.querySelector(getQuerySelector(id,'log-route-request'));
        const $logRouteReply =  document.querySelector(getQuerySelector(id,'log-route-reply'));
        const $logRouteReplyAck =  document.querySelector(getQuerySelector(id,'log-route-reply-ack'));
        const $logRouteError =  document.querySelector(getQuerySelector(id,'log-route-error'));
        const $logSendText =  document.querySelector(getQuerySelector(id,'log-send-text-request'));
        const $logSendTextAck =  document.querySelector(getQuerySelector(id,'log-send-text-ack'));
        const $logSendHopAck =  document.querySelector(getQuerySelector(id,'log-send-hop-ack'));

        /**
         * Add table entries
         *
         * ALWAYS REMOVE TYPE FROM PAYLOAD
         */
        const addTableEntry = (sender, type, payload) => {
            debugger;
            payload = Buffer.from(payload);
            let payloadObject;
            let row;
            switch (type) {
                case 'RREQ':
                    payloadObject = packages.read.rreq(payload);
                    row = document.createElement('div');
                    row.classList.add('blink-on-create');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.uflag}</span>
<span>${payloadObject.rreq_id}</span>
<span>${payloadObject.originAddress}</span>
<span>${payloadObject.originSequenceNumber}</span>
<span>${payloadObject.destinationAddress}</span>
<span>${payloadObject.destinationSequenceNumber}</span>`;
                    $logRouteRequest.appendChild(row)
                    break;
                case 'RREP':
                    payloadObject = packages.read.rrep(payload);
                    debugger;
                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.hopCount}</span>
<span>${payloadObject.originAddress}</span>
<span>${payloadObject.destinationAddress}</span>
<span>${payloadObject.destinationSequenceNumber}</span>
<span>${payloadObject.lifetime}</span>`;
                    $logRouteReply.appendChild(row)
                    break;
                case 'RERR':
                    payloadObject = packages.read.rerr(payload);
                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.destinationCount}</span>
<span>${payloadObject.unreachableDestinationAddress}</span>
<span>${payloadObject.unreachableDestinationSequenceNumber}</span>
<span>${payloadObject.additionalAddresses}</span>
<span>${payloadObject.additionalSequenceNumber}</span>`;
                    $logRouteError.appendChild(row);
                    break;
                case 'RREP_ACK':
                    payloadObject = packages.read.rrep_ack(payload);
                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>`;
                    $logRouteReplyAck.appendChild(row)
                    break;
                case 'SEND_TEXT_REQUEST':
                    payloadObject = packages.read.send_text_request(payload);
                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.originAddress}</span>
<span>${payloadObject.destinationAddress}</span>
<span>${payloadObject.messageSequenceNumber}</span>
<span>${payloadObject.message}</span>`;
                    $logSendText.appendChild(row)
                    break;
                case 'SEND_HOP_ACK':
                    payloadObject = packages.read.send_hop_ack(payload);

                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.messageSequenceNumber}</span>`;
                    $logSendHopAck.appendChild(row)
                    break;
                case 'SEND_TEXT_REQUEST_ACK':
                    payloadObject = packages.read.send_text_request_ack(payload);

                    row = document.createElement('div');
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.originAddress}</span>`;
                    $logSendTextAck.appendChild(row)
                    break;
            }
        }

        /**
         * Predefined Packages Show Button
         **/
        const $showNewRouteRequest = document.querySelector(getQuerySelector(id,'show-new-route-request'));
        const $showNewRouteReplyAck = document.querySelector(getQuerySelector(id,'show-new-route-reply-ack'));
        const $showNewRouteReply = document.querySelector(getQuerySelector(id,'show-new-route-reply'));
        const $showNewRouteError = document.querySelector(getQuerySelector(id,'show-new-route-error'));
        const $showNewHopAcknowledge = document.querySelector(getQuerySelector(id,'show-new-send-hop-acknowledge'));
        const $showNewTextRequest = document.querySelector(getQuerySelector(id,'show-new-send-text-request'));
        const $showNewTextRequestAck = document.querySelector(getQuerySelector(id,'show-new-send-text-request-acknowledge'));

        /**
         * Predefined Packages
         **/
        const $newRouteRequest = document.querySelector(getQuerySelector(id,'expaneded-modal-new-route-request'));
        const $newRouteReplyAck = document.querySelector(getQuerySelector(id,'expaneded-modal-new-route-reply-ack'));
        const $newRouteReply = document.querySelector(getQuerySelector(id,'expaneded-modal-new-route-reply'));
        const $newRouteError = document.querySelector(getQuerySelector(id,'expaneded-modal-new-route-error'));
        const $newHopAcknowledge = document.querySelector(getQuerySelector(id,'expaneded-modal-new-send-hop-acknowledge'));
        const $newTextRequest = document.querySelector(getQuerySelector(id,'expaneded-modal-new-send-text-request'));
        const $newTextRequestAck = document.querySelector(getQuerySelector(id,'expaneded-modal-new-send-text-request-acknowledge'));

        /**
         * Root Container
         **/
        const $container = document.querySelector('#'+ id);
        const $menu = [
            $newRouteRequest,
            $newRouteReply,
            $newRouteReplyAck,
            $newRouteError,
            $newHopAcknowledge,
            $newTextRequest,
            $newTextRequestAck
        ];
        const $menuButtons = [
            $showNewRouteRequest,
            $showNewRouteReply,
            $showNewRouteReplyAck,
            $showNewRouteError,
            $showNewHopAcknowledge,
            $showNewTextRequest,
            $showNewTextRequestAck
        ];

        const elements = {
            $windowCloseButton,
            $header,
            $log,
            $logContainer,
            $deviceId,
            $readonlyLabel,
            $serialConsoleContainer,
            $blacklist,
            $lanContainer,
            $fullLogToggleButton,
            $sendCommandButton,
            $sendCommandButtonInput,
            $followLogToggle,
            $menu,
            $menuButtons,
            $newRouteRequest,
            $newRouteReply,
            $newRouteError,
            $newHopAcknowledge,
            $newTextRequest,
            $newTextRequestAck,
            $container,
        }
        /**
         * close window
         */
        const closeWindow = () => {
            $container.remove();
            connection.close();
        }
        /**
         * create draggable window
         */
        // move to top on move
        const moveToTop = () => {
            debugger
            zIndex = window.zIndexHandler + 1;
            window.zIndexHandler = zIndex;
            $container.style.zIndex = zIndex;
        }
        let windowFollowMouse = false;
        $header.addEventListener('mousedown', () => {
            windowFollowMouse = true;
            moveToTop();
        }, true);
        document.addEventListener('mouseup', () => {
            windowFollowMouse = false;
        }, true);
        window.addEventListener('mousemove', (event) => {
            if (windowFollowMouse) {
                var deltaX = event.movementX;
                var deltaY = event.movementY;
                var rect = $container.getBoundingClientRect();
                $container.style.left = rect.x + deltaX + 'px';
                $container.style.top  = rect.y + deltaY + 'px';
            }
        }, true);
        const showNewRouteRequest = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newRouteRequest.classList.remove('hidden');
        }
        const showNewRouteReplyAck = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newRouteReplyAck.classList.remove('hidden');
        }
        const showNewRouteReply = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newRouteReply.classList.remove('hidden');
        }
        const showNewRouteError = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newRouteError.classList.remove('hidden');
        }
        const showNewHopAcknowledge = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newHopAcknowledge.classList.remove('hidden');
        }
        const showNewTextRequest = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newTextRequest.classList.remove('hidden');
        }
        const showNewTextRequestAck = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $newTextRequestAck.classList.remove('hidden');
        }
        const toggleFullLog = () => {
            if (!isFullLog) {
                connection.send('@@@UPGRADE@@@');
                $fullLogToggleButton.innerText = '(deactive full log)';
                isFullLog = true;
            } else {
                connection.send('@@@DOWNGRADE@@@');
                $fullLogToggleButton.innerText = '(active full log)';
                isFullLog = false;
            }

        }
        const toggleFollowLog = () => {
            const toggled = $followLogToggle.checked;
            shouldFollow = toggled;
        }
        const setReadOnly = () => {
            /**
             * Upgrade Protocol
             * @type {boolean}
             */
            toggleFullLog();
            isReadOnly = true;
            $container.classList.add('disabled');
            $sendCommandButtonInput.classList.add('disabled');
            $sendCommandButtonInput.setAttribute('disabled', 'true');
            $sendCommandButton.classList.add('disabled');
            $sendCommandButton.setAttribute('disabled', 'true');
            $serialConsoleContainer.classList.remove('serial-console-container--active');
            $serialConsoleContainer.classList.add('serial-console-container--disabled');
            $container.classList.remove('enabled');
            $readonlyLabel.classList.remove('hidden');
        }
        const getReadOnlyStatus = () => {
            return isReadOnly;
        }
        const setReadOnlySendedRequest = (sended) => {
            const newLogEntry = document.createElement('div');
            let showText = 'BINARY PACKAGE:  [';
            if (sended[0] === 'A'  && sended[1] === 'T' ) {
                showText = sended;
            } else  {
               showText = formatBinaryInput(sended, 'sended: ');
            }
            newLogEntry.innerText = showText;
            $log.appendChild(newLogEntry)
            return ;
        }

        const setBlacklist = (newBlacklist) => {
            $blacklist.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const blackListBoxes = document.createElement('div');
                blackListBoxes.classList.add('blacklist-item');
                blackListBoxes.innerText = (i).toString();
                if (newBlacklist.indexOf(i.toString()) === -1) {
                    blackListBoxes.classList.add('green-blacklist-status');
                } else {
                    blackListBoxes.classList.add('red-blacklist-status');
                }
                blackListBoxes.addEventListener('click', (event) => {
                    const blackListId = event.target.innerText;
                    const index = newBlacklist.indexOf(blackListId);
                    if (index === -1) {
                        newBlacklist.push(blackListId);
                    } else {
                        const removedItem = newBlacklist.splice(index, 1);
                    }
                    connection.send('@@@BLACKLIST@@@'+newBlacklist.join(','))

                    setBlacklist(newBlacklist);
                })
                $blacklist.appendChild(blackListBoxes)
            }
        }
        const getBlacklist = () => {
            return blacklist;
        }
        const setLan = (value) => {
            lan = value;
            if (value === 'true') {
                $lanContainer.innerText = '✓'
                return;
            }
            $lanContainer.innerText = '❌';
        }
        const getLan = () => {
            return lan;
        }
        const setDeviceId = (newDeviceId) => {
            deviceId = newDeviceId;
            $deviceId.innerText = deviceId;
        }
        const getDeviceId = () => {
            return deviceId;
        }

        const createLogEntryTemplate = (log, type) => {
            const newLogEntry = document.createElement('div');
            newLogEntry.innerText = log;
            newLogEntry.classList.add(type);

            return newLogEntry;
        }
        const followLogAction = () => {
            if (shouldFollow) {
                $logContainer.scrollTo($logContainer.scrollWidth, $logContainer.scrollHeight);
            }
        }
        const appendLog = (data, type) => {
            let logentry = createLogEntryTemplate(data, type);
            if (data[0] === 'L' && data[1] === 'R') {
                /* try to parse binary packages*/
                let [LRorAT, sender, size, payloadData] = data.split(',')
                const type = getType(payloadData);
                if (type == null) {
                    $log.appendChild(logentry);
                    followLogAction();
                    return;
                }
                let binaryAsJson = null;
                switch (type) {
                    case 'RREQ':
                        binaryAsJson = packages.read.rreq(payloadData);
                        break;
                    case 'RREP':
                        binaryAsJson = packages.read.rrep(payloadData);
                        break;
                    case 'RERR':
                        binaryAsJson = packages.read.rerr(payloadData);
                        break;
                    case 'RREP_ACK':
                        binaryAsJson = packages.read.rrep_ack(payloadData);
                        break;
                    case 'SEND_TEXT_REQUEST':
                        binaryAsJson = packages.read.send_text_request(payloadData);
                        break;
                    case 'SEND_HOP_ACK':
                        binaryAsJson = packages.read.send_hop_ack(payloadData);
                        break;
                    case 'SEND_TEXT_REQUEST_ACK':
                        binaryAsJson = packages.read.send_text_request_ack(payloadData);
                      break;
                }


                logentry = createLogEntryTemplate(`[${formattedTimestamp()}][${parseInt(sender).toString().padStart(2,'0')}] (${type})` + JSON.stringify(binaryAsJson), type);
                $log.appendChild(logentry);
                followLogAction();
                /**
                 * add to sorted log
                 */
                debugger;
                const payloadWithoutType = payloadData.slice(1, payloadData.length);
                addTableEntry(sender, type, payloadWithoutType);
                return;
            } else {
                $log.appendChild(logentry);
            }

            followLogAction();
        }
        const pushToLog = (data) => {
            log.push(data);
            appendLog(data, 'input');

        }
        // When the connection is open, send some data to the server
        connection.onopen = function () {
            connection.send('AT+RST\r\n');
        };

        // Log errors
        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        // Log messages from the server
        connection.onmessage = function (e) {
            if(e.data.startsWith('[used][readonly][rejected]')) {
                setReadOnly();
                return;
            }
            if(e.data.startsWith('[used][readonly][input]')) {
                setReadOnlySendedRequest(e.data.split('[used][readonly][input]')[1]);
                return;
            }
            if(e.data.startsWith('#start#')) {
                setBlacklist(JSON.parse(e.data.split('#start#')[1].split('#')[0].split(',')));
                setDeviceId(e.data.split('#start#')[1].split('#')[1]);
                setLan(e.data.split('#start#')[1].split('#')[2]);
                return;
            }
            pushToLog(e.data);
        };
        const sendCommand = (command) => {
            appendLog(command, 'output'); // optimistic update
            connection.send(command + '\r\n');
        }
        const sendMessage = (message) => {
            appendLog(`AT+SEND=${message.length}`, 'output'); // optimistic update
            const type = getType(message);
            const messageWithoutType = message.slice(1,message.length);
            let binaryAsJson = null;
            switch (type) {
                case 'RREQ':
                    binaryAsJson = packages.read.rreq(messageWithoutType);
                    break;
                case 'RREP':
                    binaryAsJson = packages.read.rrep(messageWithoutType);
                    break;
                case 'RERR':
                    binaryAsJson = packages.read.rerr(messageWithoutType);
                    break;
                case 'RREP_ACK':
                    binaryAsJson = packages.read.rrep_ack();
                    break;
                case 'SEND_TEXT_REQUEST':
                    binaryAsJson = packages.read.send_text_request(messageWithoutType);
                    break;
                case 'SEND_HOP_ACK':
                    binaryAsJson = packages.read.send_hop_ack(messageWithoutType);
                    break;
                case 'SEND_TEXT_REQUEST_ACK':
                    binaryAsJson = packages.read.send_text_request_ack(messageWithoutType);
                    break;
            }

            const formattedLogEntry = createLogEntryTemplate(`[${formattedTimestamp()}][${parseInt(deviceId).toString().padStart(2,'0')}] (${type})` + JSON.stringify(binaryAsJson), type);
            $log.appendChild(formattedLogEntry);
            followLogAction();
            /**
             * Add to sorted log
             */
            addTableEntry(deviceId, type, messageWithoutType);
            connection.send(`AT+SEND=${message.length}\r\n`);
            setTimeout(() => {
                debugger;
                connection.send(message + '\r\n');
                },350);

        }

        for (let i in window.serialConsoleIds){
            const currentConsole =  window.serialConsoleIds[i];
            if (currentConsole.id === id) {
                currentConsole.elements = elements;
                currentConsole.actions = {};
                currentConsole.actions.closeWindow = closeWindow;

                currentConsole.actions.showNewRouteRequest = showNewRouteRequest;
                currentConsole.actions.showNewRouteReply = showNewRouteReply;
                currentConsole.actions.showNewRouteReplyAck = showNewRouteReplyAck;
                currentConsole.actions.showNewRouteError = showNewRouteError;
                currentConsole.actions.showNewHopAcknowledge = showNewHopAcknowledge;
                currentConsole.actions.showNewTextRequest = showNewTextRequest;
                currentConsole.actions.showNewTextRequestAck = showNewTextRequestAck;
                currentConsole.actions.getReadOnlyStatus = getReadOnlyStatus;

                currentConsole.actions.getDeviceId = getDeviceId;
                currentConsole.actions.getBlacklist = getBlacklist;
                currentConsole.actions.getLan = getLan;
                currentConsole.actions.sendCommand = sendCommand;
                currentConsole.actions.sendMessage = sendMessage;
                currentConsole.actions.toggleFullLog = toggleFullLog;
                currentConsole.actions.toggleFollowLog = toggleFollowLog;
            }
        }
    }, 500);
    setTimeout(
        ()=> {
            attachEvents(id);
        },
        2000
    );

    return {id, connectToDeviceId};
}
