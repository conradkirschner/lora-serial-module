import packages from '../../src/client/packages/index';
import * as commands from '../../src/client/commands/lora';

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
    currentSerialConsole.elements.$windowCloseButton.addEventListener('click', ()=> {
        currentSerialConsole.actions.closeWindow();
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
    currentSerialConsole.elements.$menuButtons[7].addEventListener('click',()=> {
        currentSerialConsole.actions.showManageReciving();
    })
    currentSerialConsole.elements.$menuButtons[8].addEventListener('click',()=> {
        currentSerialConsole.actions.showLoraConfig();
    })
    /**
     * Send Packages
     */

    currentSerialConsole.elements.$menu[0].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[0].querySelectorAll('input');
        const messagePackage = packages.send.rreq(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value), parseInt(inputs[5].value), parseInt(inputs[6].value));
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[1].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[1].querySelectorAll('input');
        const messagePackage = packages.send.rrep(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value));
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[2].querySelector('button').addEventListener('click',()=> {
        const messagePackage = packages.send.rrep_ack();
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[3].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[3].querySelectorAll('input');
        const messagePackage = packages.send.rerr(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value));
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[4].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[4].querySelectorAll('input');
        const messagePackage = packages.send.send_hop_ack(parseInt(inputs[0].value));
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[5].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[5].querySelectorAll('input');
        const messagePackage = packages.send.send_text_request(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), inputs[3].value);
        currentSerialConsole.actions.sendMessage(messagePackage);
    })
    currentSerialConsole.elements.$menu[7].querySelectorAll('button')[0].addEventListener('click',()=> {
        const messagePackage = commands.getMessages()
        currentSerialConsole.actions.sendCommand(messagePackage);
    })
    currentSerialConsole.elements.$menu[7].querySelectorAll('button')[1].addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[7].querySelectorAll('input');
        currentSerialConsole.actions.sendCommand(commands.setDestination(inputs[0].value));
    })
    currentSerialConsole.elements.$menu[8].querySelector('button').addEventListener('click',()=> {
        const inputs = currentSerialConsole.elements.$menu[8].querySelectorAll('input');
        const messagePackage = commands.setConfig(
            parseInt(inputs[0].value),
            parseInt(inputs[1].value),
            parseInt(inputs[2].value),
            parseInt(inputs[3].value),
            parseInt(inputs[4].value),
            parseInt(inputs[5].value),
            parseInt(inputs[6].value),
            parseInt(inputs[7].value),
            parseInt(inputs[8].value),
            parseInt(inputs[9].value),
            parseInt(inputs[10].value),
            parseInt(inputs[11].value),
            parseInt(inputs[12].value),
            )
        currentSerialConsole.actions.sendCommand(messagePackage);
    })

    console.log(window.serialConsoleIds[id].actions.getDeviceId());
}

const sendBinaryPackage = ( ) => {

}
