# Serial Lora Multi Hop Chat App 

## WS Bridge
### Usage
Creates a bridge to serial port on port 8001, serial port forwarding is then possible.  
See Blacklist values in /install.sh

### Installation
``` git pull && rm -rf dist && npm run build:bridge && npm run install ```

### Connection
``` ssh -L 8001:10.10.10.40:8001  USERNAME@gridgateway.f4.htw-berlin.de ```

## Chat App
### 
