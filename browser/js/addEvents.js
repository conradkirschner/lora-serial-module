import packages from '../../src/client/packages/index';

export const attachEvents = (id) => {
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
    const $container = document.querySelector('#'+ id);

    if (window.serialConsoleIds[id].actions === undefined){
        setTimeout(()=> {
            attachEvents(id);
        }, 300);
        return;
    }
    const currentSerialConsole = window.serialConsoleIds[id];
    currentSerialConsole.elements.$fullLogToggleButton.addEventListener('click', ()=> {
        currentSerialConsole.actions.toggleFullLog();
    });
    currentSerialConsole.elements.$sendCommandButton.addEventListener('click', ()=> {
        currentSerialConsole.actions.sendCommand(currentSerialConsole.elements.$sendCommandButtonInput.value);
        currentSerialConsole.elements.$sendCommandButtonInput.value = '';
    });
    currentSerialConsole.elements.$followLogToggle.addEventListener('click', ()=> {
        currentSerialConsole.actions.toggleFollowLog();
    });
    currentSerialConsole.elements.$followLogToggle.addEventListener('click', ()=> {
        currentSerialConsole.actions.toggleFollowLog();
    });
    currentSerialConsole.elements.$menuButtons[0].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewRouteRequest();
    })
    currentSerialConsole.elements.$menuButtons[1].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewRouteReply();
    })
    currentSerialConsole.elements.$menuButtons[2].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewRouteReplyAck();
    })
    currentSerialConsole.elements.$menuButtons[3].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewRouteError();
    })
    currentSerialConsole.elements.$menuButtons[4].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewHopAcknowledge();
    })
    currentSerialConsole.elements.$menuButtons[5].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewTextRequest();
    })
    currentSerialConsole.elements.$menuButtons[6].addEventListener('click',()=> {
        currentSerialConsole.actions.showNewTextRequestAck();
    })
    /**
     * Send Packages
     */

    currentSerialConsole.elements.$menu[0].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[0].querySelectorAll('input');
        const rreq_package = packages.send.rreq(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value, inputs[5].value, inputs[6].value);
        currentSerialConsole.actions.sendCommand(rreq_package + '\r\n');
    })

    console.log(window.serialConsoleIds[id].actions.getDeviceId());
}

const sendBinaryPackage = ( ) => {

}
