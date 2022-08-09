# Speech Learning Task

experiment app

# Installation in Raspberry Pi:

You will need to have access to a system with a bash shell, ssh and node installed.
If you are in linux, you probably are good with the defaults, for Windows users, your easiest way would be using the
Git Bash program to run the following commands.

1. `cd` into the location of the repository in your machine.

```
cd ~/speech-learning
```

2. Execute the following script:

```
./install.sh
```

3. You will be prompted with some parameters to fill up (like user and ip for the raspberry pi).
   You will also be asked for the password for the raspberry pi user several times, this is normal.
   Please note that our lab's configuration is set up as default.
   You can change any entries or simply press enter when asked for input to follow the defaults.

4. If everything went well, you should now be able to access the server from your web browser.

# Troubleshooting

If the webapp is not working, there might be some error in the server.
To check wether there is the case, you can first open the `/logs/speech-practice.err.log` file in the
raspberry pi.
You might see an error ocurring on the appserver there.

When you try to fix the error, you can test the server without installation by running this command in the raspberry pi:

```
python3 ~/speech-practice/run.py
```

This will run the server and print the output to the terminal, so you can see any errors happening
live.

## Install grpc in Arm devices (Raspberry Pi)

Due to some error in the grpc packages, the initial installation of the python grpc package can fail.
If you see the following:

```
ImportError: /lib/arm-linux-gnueabihf/libc.so.6: version `GLIBC_2.33' not found (required by /usr/local/lib/python3.8/dist-packages/grpc/_cython/cygrpc.cpython-38-arm-linux-gnueabihf.so)
```

You will need to install manually grpc.
Log into the Raspberry Pi via ssh end execute the following commands:

1. ```
   sudo pip uninstall grpcio
   ```
2. ```
   sudo pip uninstall grpcio-status
   ```
3. ```
   pip install grpcio==1.44.0 --no-binary=grpcio
   ```
4. ```
   pip install grpcio-tools==1.44.0 --no-binary=grpcio-tools
   ```
5. This command depends on the version of python you are using.
   It copies the packages that we have just installed to the global package library.
   Please change the relevant paths for your python installation:
   ```
   sudo cp .local/lib/python3.8/site-packages/grpc* /usr/local/lib/python3.8/dist-packages/ -r```

Each of these commands take a long time to complete (15-20 min), please be patient.
Hopefully, this will solve the missing `GLIBC_2.33` issue.
