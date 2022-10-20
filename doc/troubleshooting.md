# Troubleshooting

If the web app is not working, there might be some error in the server.
To check if this is the case, you can first open the `/logs/speech-practice.err.log` file in the
device running the server.
You might see an error occurring on the app server there.

When you try to fix the error, you can test the server without installation by running this command on the raspberry pi:

```
python3 ~/speech-practice/run.py
```

This will run the server and print the output to the terminal, so you can see any errors happening
live.
