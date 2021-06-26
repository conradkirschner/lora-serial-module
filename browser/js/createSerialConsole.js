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
const formatBinaryInput = ( sended, showText = '' )=> {
    for (let i = 0; i < sended.length; i++) {
        try {
            if (sended instanceof Uint8Array) {
                showText += parseInt(sended[i].toString(2), 2) + '-';
            } else {
                showText += parseInt(sended[i].charCodeAt(i).toString(2), 2) + '-';

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
                        <div>Route Request Ack </div>
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
                        <div><span>Lifetime</span><span><input type="number" min="1" max="20" value="1"></span> </div>
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
                <div data-id="expaneded-modal-new-input-container"></div>
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
        $header.addEventListener('mouseup', () => {
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
               showText = formatBinaryInput(sended, '');
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
        const appendLog = (data, type) => {
            const logentry = createLogEntryTemplate(data, type);
            $log.appendChild(logentry);
            if (shouldFollow) {
                $logContainer.scrollTo($logContainer.scrollWidth, $logContainer.scrollHeight);
            }

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
            appendLog(formatBinaryInput(message, 'sended binary:  ', 'output')); // optimistic update
            connection.send(`AT+SEND=${message.length}\r\n`);
            setTimeout(() => {connection.send(message + '\r\n');},250);

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
