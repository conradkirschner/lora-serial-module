const httpProxy = require('http-proxy');
const http = require("http");

const configMap = {
    1: '10.10.10.31',
    2: '10.10.10.32',
    3: '10.10.10.133',
    4: '10.10.10.134',
    5: '10.10.10.135',
    6: '10.10.10.136',
    7: '10.10.10.137',
    8: '10.10.10.138',
    9: '10.10.10.139',
    10: '10.10.10.40',
    11: '10.10.10.141',
    12: '10.10.10.42',
    13: '10.10.10.43',
    14: '10.10.10.44',
    15: '10.10.10.45',
    16: '10.10.10.146',
    17: '10.10.10.147',
    18: '10.10.10.48',
    19: '10.10.10.149',
    20: '10.10.10.150',
}
const proxyMap = {};
for (let index in configMap) {
    proxyMap[index] = new httpProxy.createProxyServer({
        target: {
            host: configMap[index],
            port: 8001,
            ws: true
        }
    });
}

const proxyServer = http.createServer(function (req, res) {
    try {
        const id = parseInt(req.url.substr(1, req.url.length - 1));
        proxyMap[id].web(req, res);

    } catch (e){
        console.log('Error in routing')
    }
});

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function (req, socket, head) {
    try {
        const id = parseInt(req.url.substr(1, req.url.length - 1));
        proxyMap[id].ws(req, socket, head);
    } catch (e){
        console.log('Error in routing - upgrade')
    }
});

proxyServer.listen(8000);
