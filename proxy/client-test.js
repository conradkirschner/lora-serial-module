const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    console.log('connected');
    ws.send('AT+RST\r\n');
});

ws.on('message', function incoming(data) {
    console.log('GOT INPUT: ', data);
});
