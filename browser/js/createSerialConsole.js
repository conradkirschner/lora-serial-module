import {getType} from "./../../src/client/packages/types";
import packages from "../../src/client/packages";

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
                <div class="log-title">Log</div>
                <hr>
                <div data-id="log"></div>
            </div>
            <div data-id="footer" class="serial-console-footer">
                <div data-id="send-text-serial">
                    <div>Serial Text Input</div>
                    <input data-id="send-text-serial-button-input" type="text" />
                    <button data-id="send-text-serial-button">senden</button>
                </div>
                 <div data-id="show-packages-container">
                    <button><label><input data-id="follow-log-toggle" type="checkbox"> follow log </label></button>
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
                    <button class="expaneded-modal-menu-item" data-id="show-manage-receiving">Manage Receiving</button>
                    <button class="expaneded-modal-menu-item" data-id="show-lora-config">Lora Config</button>
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
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-manage-receiving">
                        <div>Lora Receiving Modes</div>
                        <div><button>ENABLE Receiving</button></div>
                        <hr>
                         <div><span>Destination (FFFF = Broadcast)</span><span><input type="text" maxlength="30" value="FFFF"></span> </div>
                        <div><button>Set Destination</button></div>
                        <hr>
                         <div><span>Address (1-20)</span><span><input type="text" maxlength="30" value="15"></span> </div>
                        <div><button>Set Addressf</button></div>
                    </div>
                     <div class="expaneded-modal-new-input-container hidden" data-id="expaneded-modal-lora-config">
                        <div>Lora Config</div>
                         <div>
                             <span>
                                 <a href="javascript:false" 
                                 title="Die Trägerfrequenz, wenn das Modul arbeitet, in Dezimalzahlen, ausgedrückt in 9 Zeichen (410 MHz bis 470 MHz)">
                                    Trägerfrequenz
                                </a>
                            </span>
                            <span>
                                <input type="text" value="433000000">
                            </span> 
                        </div>
                         <div>
                            <div>
                                <a href="javascript:false" title="Sendeleistung, dezimal, ausgedrückt in 2 Zeichen( 5dBm-20dBm)">
                                    Power
                                </a>
                            </div>
                            <span>
                                <input type="text" value="20">
                            </span>
                         </div>
                         <div>
                            <div>
                                <a href="javascript:false" title="Die Bandbreite des belegten Kanals wird übertragen: Je größer die Bandbreite, desto schneller werden die Daten übertragen, desto geringer ist jedoch die Empfindlichkeit. Im Konfigurationsbefehl wird nur der Bandbreitencode verwendet, und die tatsächliche Bandbreite wird nicht verwendet.">
                                    Modulationsbandbreite
                                </a>
                            </div>
                            <span>
                                <input type="text" value="9" />
                            </span>
                         </div>
                         <div>
                            <div>
                                <a href="javascript:false" title="Die Schlüsselparameter der Spread-Spectrum-Kommunikation sind, je größer der SpreadingFaktor ist, desto langsamer werden die Daten gesendet, desto höher ist jedoch die Empfindlichkeit. Im Konfigurationsbefehl wird nur der Code des Spreizfaktors verwendet, und der tatsächliche Spreizfaktor wird nicht angezeigt">
                                    Spread-Faktor
                                </a>
                            </div>
                            <div>
                                <input type="text" value="10" />
                            </div> 
                            </div>
                         <div>
                            <div>
                                <a href="javascript:false" title="Für die Schlüsselparameter der Spread-Spectrum-Kommunikation wird im Konfigurationsbefehl nur der Code des Fehlerkorrekturcodes verwendet, und der eigentliche Fehlerkorrekturcode wird nicht angezeigt">
                                    Fehler beim Korrigieren des Codes
                                </a>
                            </div>
                            <div>
                                <input type="text" value="4" />
                             </div>
                          </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="CRC-Prüfung der Benutzerdaten">
                                    CRC-Prüfung
                                </a>
                            </span>
                            <span>
                                <input type="text" value="1" />
                            </span>
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="0 explizit | 1 implizit">
                                    Implizite Kopfzeile
                                </a>
                            </span>
                            <span>
                                <input type="text" value="0" />
                            </span>
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="Empfangsmoduseinstellung (0 kontinuierlich | 1 einmalig)">
                                    Einzelempfang
                                </a>
                            </span>
                            <span>
                                <input type="text" value="0" />
                             </span>
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="0 Wird nicht unterstützt | 1 Unterstützung">
                                    Frequenzsprungeinstellung
                                </a>
                            </span>
                            <span>
                                <input type="text" value="0" />
                            </span> 
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="Timeout-Zeit für Datenempfang: Wenn im Einzelempfangsmodus die Datensoftware nicht über diese Zeit hinaus empfangen wurde, meldet das Modul einen Timeout-Fehler und wechselt automatisch in Dezimal-Schreibweise in Millisekunden in den SLEEP-Modus (1-65535)">
                                    Timeout für den Empfang von Daten
                                </a>
                            </span>
                            <span>
                                <input type="text" value="0" />
                            </span>
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="Benutzerdatenlänge, Dezimaldarstellung: Anwendung im impliziten Header-Modus, gibt die Länge der vom Modul gesendeten und empfangenen Daten an (diese Länge = tatsächliche Benutzerdatenlänge + 4). Der Anzeigekopf ist ungültig.(5-255)">
                                    Benutzerdatenlänge
                                </a>
                            </span>
                            <span>
                                <input type="text" value="3000" />
                            </span>
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="Präambellänge, Dezimaldarstellung(4-65535)">
                                    Benutzerdatenlänge
                                </a>
                            </span>
                            <span>
                                <input type="text" value="8" />
                            </span> 
                         </div>
                         <div>
                            <span>
                                <a href="javascript:false" title="">
                                    Länge der Präambel
                                </a>
                            </span>
                            <span>
                                <input type="text" value="10">
                            </span>
                         </div>
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
        const addTableEntry = (sender, type, payload, isOwn) => {

            payload = Buffer.from(payload);
            let payloadObject;
            let row;
            row = document.createElement('div');
            row.classList.add('blink-on-create');
            if (isOwn) {
                row.classList.add('own-log-entry');
            } else {
                row.classList.add('other-log-entry');
            }
            switch (type) {
                case 'RREQ':
                    payloadObject = packages.read.rreq(payload);

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
                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>`;
                    $logRouteReplyAck.appendChild(row)
                    break;
                case 'SEND_TEXT_REQUEST':
                    payloadObject = packages.read.send_text_request(payload);
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

                    row.innerHTML = `
<span>${formattedTimestamp()}</span>
<span>${sender}</span>
<span>${payloadObject.messageSequenceNumber}</span>`;
                    $logSendHopAck.appendChild(row)
                    break;
                case 'SEND_TEXT_REQUEST_ACK':
                    payloadObject = packages.read.send_text_request_ack(payload);

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

        const $showManageReceiving = document.querySelector(getQuerySelector(id,'show-manage-receiving'));
        const $showLoraConfig = document.querySelector(getQuerySelector(id,'show-lora-config'));
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

        const $manageReceiving = document.querySelector(getQuerySelector(id,'expaneded-modal-manage-receiving'));
        const $loraConfig = document.querySelector(getQuerySelector(id,'expaneded-modal-lora-config'));
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
            $newTextRequestAck,
            $manageReceiving,
            $loraConfig,
        ];
        const $menuButtons = [
            $showNewRouteRequest,
            $showNewRouteReply,
            $showNewRouteReplyAck,
            $showNewRouteError,
            $showNewHopAcknowledge,
            $showNewTextRequest,
            $showNewTextRequestAck,
            $showManageReceiving,
            $showLoraConfig,
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
            zIndex = window.zIndexHandler + 1;
            window.zIndexHandler = zIndex;
            $container.style.zIndex = zIndex;
        }
        let windowFollowMouse = false;
        $container.addEventListener('mousedown', () => {
            windowFollowMouse = true;
            moveToTop();
        }, false);
        document.addEventListener('mouseup', () => {
            windowFollowMouse = false;
        }, false);
        window.addEventListener('mousemove', (event) => {
            if (windowFollowMouse) {
                var deltaX = event.movementX;
                var deltaY = event.movementY;
                var rect = $container.getBoundingClientRect();
                $container.style.left = rect.x + (deltaX*1.6) + 'px';
                $container.style.top  = rect.y + (deltaY*1.6) + 'px';
            }
        }, false);
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
        const showManageReciving = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $manageReceiving.classList.remove('hidden');
        }
        const showLoraConfig = () => {
            for (let i = 0; i < $menu.length ; i++ ){
                if(!$menu[i].classList.contains('hidden')){
                    $menu[i].classList.add('hidden');
                }
            }
            $loraConfig.classList.remove('hidden');
        }
        let once = false;
        const toggleFullLog = (oneTimeFlag) => {
            if (once && oneTimeFlag === true) {
                return;
            }
            if (!isFullLog) {
                connection.send('@@@UPGRADE@@@');
                $fullLogToggleButton.innerText = '(deactive full log)';
                isFullLog = true;
            } else {
                connection.send('@@@DOWNGRADE@@@');
                $fullLogToggleButton.innerText = '(active full log)';
                isFullLog = false;
            }
            once = true;
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
            toggleFullLog(true);
            isReadOnly = true;
            $serialConsoleContainer.classList.add('disabled');
            $header.classList.add('application-menu--disabled');
            $sendCommandButtonInput.classList.add('disabled');
            $sendCommandButtonInput.setAttribute('disabled', 'true');
            $sendCommandButton.classList.add('disabled');
            $sendCommandButton.setAttribute('disabled', 'true');
            $serialConsoleContainer.classList.remove('serial-console-container--active');
            $serialConsoleContainer.classList.add('serial-console-container--disabled');
            $container.classList.remove('enabled');
            $readonlyLabel.classList.remove('hidden');

            /**
             * disable predefined events
             */
            elements.$menuButtons.forEach((element) => {
                element.setAttribute('disabled', "true");
            })

            for (let i = 0; i < elements.$menu.length; i++) {
                debugger;
                elements.$menu[i].querySelectorAll('input').forEach((element) => {
                    element.setAttribute('disabled', true);
                })
                elements.$menu[i].querySelectorAll('* button').forEach((element) => {
                    element.setAttribute('disabled', true);
                })
            }
        }
        const getReadOnlyStatus = () => {
            return isReadOnly;
        }
        const setReadOnlySendedRequest = (sended) => {
            const newLogEntry = document.createElement('div');
            let showText = 'BINARY PACKAGE:  [';
            if (sended[0] === 'A'  && sended[1] === 'T' ) {
                showText = sended;
            } else if (sended[0] === 'L'  && sended[1] === 'R' )  {

            } else {
                const type = getType(sended);
                _appendLogFormatted(deviceId, type, sended.slice(1, sended.length), true);
                return ;
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
        const appendLog = (data, type, isOwn = false) => {
            let logentry = createLogEntryTemplate(data, type);
            if (data[0] === 'L' && data[1] === 'R') {
                /* try to parse binary packages*/
                let [LRorAT, sender, size, payloadData] = data.split(',')
                const type = getType(payloadData);
                const payloadDataWithoutType = payloadData.slice(1, payloadData.length);
                if (type == null) {
                    $log.appendChild(logentry);
                    followLogAction();
                    return;
                }
                _appendLogFormatted(sender, type, payloadDataWithoutType, isOwn);
            } else {
                $log.appendChild(logentry);
            }

            followLogAction();
        }
        const _appendLogFormatted = (sender, type, payloadDataWithoutType, isOwn = false) => {
            let binaryAsJson = null;
            switch (type) {
                case 'RREQ':
                    binaryAsJson = packages.read.rreq(payloadDataWithoutType);
                    break;
                case 'RREP':
                    binaryAsJson = packages.read.rrep(payloadDataWithoutType);
                    break;
                case 'RERR':
                    binaryAsJson = packages.read.rerr(payloadDataWithoutType);
                    break;
                case 'RREP_ACK':
                    binaryAsJson = packages.read.rrep_ack(payloadDataWithoutType);
                    break;
                case 'SEND_TEXT_REQUEST':
                    binaryAsJson = packages.read.send_text_request(payloadDataWithoutType);
                    break;
                case 'SEND_HOP_ACK':
                    binaryAsJson = packages.read.send_hop_ack(payloadDataWithoutType);
                    break;
                case 'SEND_TEXT_REQUEST_ACK':
                    binaryAsJson = packages.read.send_text_request_ack(payloadDataWithoutType);
                    break;
            }


            let logentry = createLogEntryTemplate(`[${formattedTimestamp()}][${parseInt(sender).toString().padStart(2,'0')}] (${type})` + JSON.stringify(binaryAsJson), type);
            if (isOwn) {
                logentry.classList.add('own-log-entry');
            } else {
                logentry.classList.add('other-log-entry');
            }
            $log.appendChild(logentry);
            followLogAction();
            /**
             * add to sorted log
             */

            addTableEntry(sender, type, payloadDataWithoutType, isOwn);
            return logentry;
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
            appendLog(command, 'output', true); // optimistic update
            connection.send(command + '\r\n');
        }
        const sendMessage = (message) => {
            appendLog(`AT+SEND=${message.length}`, 'output', true); // optimistic update
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
            $log.classList.add('own-log-entry');

            $log.appendChild(formattedLogEntry);
            followLogAction();
            /**
             * Add to sorted log
             */
            addTableEntry(deviceId, type, messageWithoutType, true);
            connection.send(`AT+SEND=${message.length}\r\n`);
            setTimeout(() => {

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
                currentConsole.actions.showManageReciving = showManageReciving;
                currentConsole.actions.showLoraConfig = showLoraConfig;

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
        moveToTop();
    }, 250);
    setTimeout(
        ()=> {
            attachEvents(id);
        },
        500
    );

    return {id, connectToDeviceId};
}
