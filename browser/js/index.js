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
 * Serial Console Handler
 */
window.serialConsoleIds = {};
document.addEventListener("DOMContentLoaded", function(event) {
    const main = document.getElementsByTagName('main')[0];
    const serialConsoleId = createSerialConsole(main,11, attachEvents);
    serialConsoleIds[serialConsoleId.id] = serialConsoleId

});

