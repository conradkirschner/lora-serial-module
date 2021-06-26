# Serial Lora Multi Hop Chat App 

## WS Bridge
### Usage
Creates a bridge to serial port on port 8001, serial port forwarding is then possible.  
The first answer is #start#BLACKLIST#DEVICE_ID#IS_LAN.  


For Blacklisting Nodes have a look in the values in /install.sh or use the [@@@BLACKLIST@@@ Event](#Events).  

There are hardcoded folder paths to like /home/piu/conrad/lora-serial-module/dist
### Installation
``` # ~/ mkdir conrad && cd conrad  &&```
``` git clone https://github.com/conradkirschner/lora-serial-module.git && cd lora-serial-module && (npm run build:bridge && npm run install) ```

### Update
``` # ~/ cd conrad/lora-serial-module  &&```
``` git pull && rm -rf dist && (npm run build:bridge && npm run install) ```

### Connection
``` ssh -L 8001:10.10.10.40:8001  USERNAME@gridgateway.f4.htw-berlin.de ```
### Events
#### @@@BLACKLIST@@@
This Event overwrites the loaded blacklist.  

#### @@@UPGRADE@@@
Enable Protocol Upgraded (input forwarding to ws)

```@@@UPGRADE@@@```

## Websocket Tunnel 

To avoid having multiple ssh tunnel open we map the websockets to the path name.  
```ws://localhost:8000/ID```  
e.g. ```ws://localhost:8000/ID```  

Specify Config map in ./proxy/websocket-tunnel.js. 

## Chat App
### 
