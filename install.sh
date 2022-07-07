#!/bin/bash
# Installation script for current web server

src_path=$(dirname $(realpath $0))
server_name=$(basename $src_path)

# Build npm
cd $src_path/client
npm run build

# Set up supervisorctl
read -p "Enter slackbot token (to publish server ip in Slack): " SLACK_TOKEN

echo "[program:${server_name}]
stopsignal=INT
command=/usr/bin/python3 ${src_path}/server/run.py
autostart=true
autorestart=true
stderr_logfile=/logs/${server_name}.err.log
stdout_logfile=/logs/${server_name}.out.log
environment=SLACK_TOKEN=\"${SLACK_TOKEN}\"
" > /etc/supervisor/conf.d/$server_name.conf

supervisorctl reread
supervisorctl update

