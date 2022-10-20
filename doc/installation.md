# Installation

The system is straightforward to install on different devices thanks to the install script.
To follow these instructions, you will need to have access to a system with a bash shell,
ssh and node installed.
If you are in Linux, you probably already have all of these, for Windows users, the easiest way to
go would be to use the Git Bash program and install node.

1. `cd` into the location of the repository in your machine.

```
cd ~/speech-learning
```

2. Execute the following script:

```
./install.sh
```

3. You will be prompted with some parameters to fill up (like user and IP for the raspberry pi).
   You will also be asked for the password of the raspberry pi user several times, this is normal.
   Please note that our lab's configuration is set up as default.
   You can change any entries or simply press enter when asked for input to follow the defaults.

4. When the first time you run this script, you will probably see this warning:

```
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Simply type `yes` and press enter.

5. If everything went well, you should now be able to access the server from your web browser.

### Install gRPC in Arm devices (Raspberry Pi)

Due to some error in the gRPC packages, the initial installation of the python gRPC package can
fail.
If you see the following:

```
ImportError: /lib/arm-linux-gnueabihf/libc.so.6: version `GLIBC_2.33' not found (required by /usr/local/lib/python3.8/dist-packages/grpc/_cython/cygrpc.cpython-38-arm-linux-gnueabihf.so)
```

You will need to install manually gRPC.
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
   It copies the packages that we have just installed in the global package library.
   Please change the relevant paths for your python installation:
   ````
   sudo cp .local/lib/python3.8/site-packages/grpc* /usr/local/lib/python3.8/dist-packages/ -r```
   ````

Each of these commands takes a long time to complete (15-20 min), please be patient.
Hopefully, this will solve the missing `GLIBC_2.33` issue.

# Running the application locally.

You can run the application on any machine, by giving Pepper the IP of the computer where this
server is running.
To do so, Pepper and the server need to be in the same network, and the IP of the computer in the
network must be known.

1. Update this project and the PepperBase application to have the latest changes.

2. Connect both Pepper and the computer to the same network.
   For this to work in WSU, you'll need to connect the devices using an account without
   restrictions in the network.

3. Find the IP of the computer by running the following command in a PowerShell:

   ```
   Get-NetIPAddress -AddressFamily IPV4 -IntefaceAlias Wi-Fi
   ```

   If you are on Linux or Mac, you can find your IP with:

   ```
   ip a
   ```

4. Open the PepperBase project in Android Studio.
   You will need to change the IP address in
   [the main activity](https://github.com/NaoPepper4hri/PepperBase/blob/568ffbcf885c860484c0ac35f433e18979068e33/app/src/main/kotlin/com/example/pepperbase/MainActivity.kt#L127)
   to match the one on your computer.

5. Open a terminal in the `speech-learning` project.

6. `cd` into the `client` folder and run:

```
npm run build
```

7. `cd` back into the root of the project.

8. Create a folder to store the data with:

```
mkdir data
```

9. Start the server with:

```
python ./server/run.py --output-folder data
```

10. Go back to Android Studio and run the project in Pepper.

11. If everything went well, you should see a message in the log of the server saying
    `Requested command stream`.

### Install missing libraries

You might be missing some Python packages in your setup.
If that is the case, the required packages are listed in `requirements.txt`.
You should install those packages in either a virtual environment or globally on your machine.

If you don't specify a `data` folder for the server application, the default `/data` is used.
The server will fail to save the data (and give an error) if you don't specify an existing folder,
or you don't have permission to edit the folder you provide.
Please ensure that you always provide an existing folder to store the data of a participant.
