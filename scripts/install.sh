#This needs to be executed as root!


echo "[Unit]
Description=hello_env.js - making your environment variables rad
Documentation=https://example.com
After=network.target

[Service]
Environment=BLACKLIST=1,2,3,4,5,6,7,8,13,14,15,16,17,18,19,20
Type=simple
User=pi
ExecStart=/usr/bin/node /home/pi/conrad/lora-serial-module/dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" > /lib/systemd/system/websocket-bridge.service

systemctl daemon-reload
sudo systemctl stop websocket-bridge
sudo systemctl start websocket-bridge
