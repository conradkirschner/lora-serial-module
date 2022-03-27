# Serial Lora Multi Hop Chat App 
## Overview 
This Project is an Education Software for a Multi-Hop Routing Chat Application.  
With this, it's possible to create a test network for the lora modules.  
(You can activate and deactivate the modules)  

It also allows an interception Mode to see if the protocol is correct implemented. 
## Preview
![Alt Text](./img/sample-preview.gif)


## WS Bridge
### Usage
Creates a bridge to serial port on port 8001, serial port forwarding is then possible.  
The first answer is #start#BLACKLIST#DEVICE_ID#IS_LAN.  


For Blacklisting Nodes have a look in the values in /install.sh or use the [@@@BLACKLIST@@@ Event](#Events).  

There are hardcoded folder paths to like /home/piu/conrad/lora-serial-module/dist
### Installation
``` # ~/ mkdir conrad && cd conrad  &&```
``` git clone https://github.com/conradkirschner/lora-serial-module.git && cd lora-serial-module && npm ci && npm run build:bridge && npm run install:bridge ```

### Update
``` # ~/ cd conrad/lora-serial-module  &&```
``` git pull && rm -rf dist && npm ci && npm run build:bridge && npm run install:bridge ```

### Connection
``` ssh -L 8001:10.10.10.40:8001  USERNAME@gridgateway.f4.htw-berlin.de ```

### usage
Connect now with your WebSocketClient, use the path for Device Id.  
  
``` ws://localhost:8001/15 ``` - for device 15  
``` ws://localhost:8001/10 ``` - for device 10  
### App

Open [./browser-dist/index.html](./browser-dist/index.html) after you are connected to a Node.

### Events
#### @@@BLACKLIST@@@
This Event overwrites the loaded blacklist.  

```@@@BLACKLIST@@@1,2,3,4```


#### @@@UPGRADE@@@
Enable Protocol Upgraded (input forwarding to ws)

```@@@UPGRADE@@@```

#### @@@DOWNGRADE@@@
disables Protocol Upgraded (input forwarding to ws)

```@@@DOWNGRADE@@@```

## Websocket Tunnel 

To avoid having multiple ssh tunnel open we map the websockets to the path name.  
```ws://localhost:8000/ID```  
e.g. ```ws://localhost:8000/ID```  

Specify Config map in ./proxy/websocket-tunnel.js. 

## Chat App
### 
