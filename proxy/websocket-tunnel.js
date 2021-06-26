const httpProxy = require('http-proxy');
const http = require("http");

const configMap = {
    10: '10.10.10.40',
    11: '10.10.10.141',
    15: '10.10.10.45',
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
const proxy = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8001,
        ws: true
    }
});
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
