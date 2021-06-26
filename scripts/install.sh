#This needs to be executed as root!

########################################
### Websocket Router for deep tunnel
########################################
echo "[Unit]
Description=Makes it possible to reach Pis with a single tunnel
Documentation=https://example.com
After=network.target

[Service]
Type=simple
User=pi
ExecStart=/usr/bin/node /home/pi/conrad/lora-serial-module/proxy/websocket-tunnel.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" > /lib/systemd/system/websocket-distributor.service

systemctl daemon-reload
sudo systemctl stop websocket-distributor
sudo systemctl start websocket-distributor

########################################
### Serial to Websocket Bridge
########################################
echo "[Unit]
Description=Serial to Websocket Bridge
Documentation=https://example.com
After=network.target

[Service]
Environment=BLACKLIST=1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,19,20
Type=simple
User=pi
ExecStart=/usr/bin/node /home/pi/conrad/lora-serial-module/dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" > /lib/systemd/system/websocket-bridge.service

systemctl daemon-reload
sudo systemctl stop websocket-bridge
sudo systemctl start websocket-bridge
