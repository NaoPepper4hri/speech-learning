#!/bin/bash
# Installation script for current web server.

src_path=$(dirname $(realpath $0))
server_name=$(basename $src_path)

read -p "Target ip address (default: 10.3.141.1) " TARGET_IP
read -p "Target user (default: ubuntu):" TARGET_USER

if [ -z "$TARGET_IP" ]; then
	TARGET_IP=10.3.141.1
fi
if [ -z "$TARGET_USER" ]; then
	TARGET_USER=ubuntu
fi
echo "Using target: $TARGET_USER@$TARGET_IP"
echo "$TARGET_USER@$TARGET_IP's password: "
read -s PASSWORD

# Build client and send to target machine
cd $src_path/client
npm run build
cd $src_path
scp -pr server/* $TARGET_USER@$TARGET_IP:~/$server_name
echo "———————> Server updated."
echo

# Install required python packages
read -r -p "Update required Python packages? [Y/n] " response
case "$response" in
[nN][oO] | [nN]) ;;

*)
	requirements=$(cat $src_path/requirements.txt | tr '\n' ' ')
	echo $PASSWORD | ssh -tt $TARGET_USER@$TARGET_IP "sudo python3 -m pip install $requirements"
	;;
esac

# Set up supervisorctl
read -r -p "Reconfigure Supervisor [Y/n] " response
case "$response" in
[nN][oO] | [nN]) ;;
*)
	read -p "Enter slackbot token, if any, otherwise leave empty: " SLACK_TOKEN
	supervisor_conf="[program:${server_name}]
        stopsignal=INT
        command=/usr/bin/python3 /home/$TARGET_USER/$server_name/run.py
        autostart=true
        autorestart=true
        stderr_logfile=/logs/${server_name}.err.log
        stdout_logfile=/logs/${server_name}.out.log
        environment=SLACK_TOKEN=\\\"${SLACK_TOKEN}\\\"
        "

	echo $PASSWORD | ssh -tt $TARGET_USER@$TARGET_IP "echo \"$supervisor_conf\" | sudo tee -a  /etc/supervisor/conf.d/$server_name.conf >/dev/null && sudo supervisorctl reread && sudo supervisorctl update"
	;;
esac
