# duolingo-webapp

experiment app

# Installation in Raspberry Pi:

1. Copy to server with ip `raspberry-ip`:

```
rsync -a duolingo-webapp ubuntu@{raspberry-ip}:~/duolingo-webapp
```

2. Login into the server:

```
ssh ubuntu@{raspberry-ip}
```

3. Run installation script:

```
~/duolingo-webapp/install.sh
```

4. When you restart the raspberry, the webapp should be setup.

# Troubleshooting
If the webapp is not working, there might be some error in the server.
To check wether there is the case, you can first open the `/logs/{app-name}.err.log` file in the
raspberry pi.
You might see an error ocurring on the appserver there.

When you try to fix the error, you can test the server without installation by running this
command:
```
python3 ~/duolingo-webapp/server/run.py
```
This will run the server and print the output to the terminal, so you can see any errors happening
live.

