# Serial Lora Multi Hop Chat App 

## WS Bridge
### Usage
Creates a bridge to serial port on port 8001, serial port forwarding is then possible.  
See Blacklist values in /install.sh

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

```@@@BLACKLIST@@@1,2,3,4,5```
## Chat App
### 
