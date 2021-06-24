sudo echo "[Unit]
Description=hello_env.js - making your environment variables rad
Documentation=https://example.com
After=network.target

[Service]
Environment=NODE_PORT=3001
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ubuntu/hello_env.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" >> /lib/systemd/system/websocket-bridge.service

