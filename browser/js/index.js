/**
 * Buffer polyfill
 */
const Buffer = require('buffer/').Buffer;
import {createSerialConsole} from './createSerialConsole';
import {attachEvents} from './addEvents';

/**
 * Query Selector for unique windows
 * @param id
 * @param name
 * @returns {string}
 */
window.getQuerySelector = (id, name) => {
    return `#${id} [data-id="${name}"]`
}
/**
 * Header Handler
 **/
const $spawnButton = document.getElementById('spawnConsoleButton');
const $spawnButtonInput = document.getElementById('spawnConsoleButton-input');
$spawnButton.addEventListener('click', () => {
    const main = document.getElementsByTagName('main')[0];
    const serialConsoleId = createSerialConsole(main,$spawnButtonInput.value, attachEvents);
    serialConsoleIds[serialConsoleId.id] = serialConsoleId
})
/**
 * Serial Console Handler start with terminal to 8
 */
window.serialConsoleIds = {};
document.addEventListener("DOMContentLoaded", function(event) {
    const main = document.getElementsByTagName('main')[0];
    const serialConsoleId = createSerialConsole(main,8, attachEvents);
    serialConsoleIds[serialConsoleId.id] = serialConsoleId
});

/**
 * start in fullscreen
 **/
window.shouldFullScreen = false;
document.addEventListener("DOMContentLoaded", function(event) {
    const elem  = document.body;

    /* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
    function openFullscreen() {
        if(!window.shouldFullScreen){
            return;
        }
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    elem.addEventListener('click', () => {
        openFullscreen()
    })

});
