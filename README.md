# Speech Learning Task

experiment app

# Retrieve the results

By default, the application writes the experiment data to `/data`.
In our lab, a partition in the Raspberry Pi's sd card is mounted in this directory, making it easy
to access the data.

To retrieve the data after an experiment, simply turn off the Raspberry Pi, extract the SD card and
plug it in your computer.
When detected, the SD card will show a `Data` partition.
You can find all the data there.

If you want to change the output folder for the experiment data, you can change this using the
`--output-folder` option when executing `run.py`.

# Processing the experiment data

Due to the dynamic nature of the experiment (some questions might not be answered, and some store
different types of data), we have decided to store all the experiment data (including a simple
logging system) as a JSON file.
This file can be loaded directly in different languages like Python for data analysis, and contains
all the available information about a trial.

You can use the [data_digestion.py](https://github.com/NaoPepper4hri/speech-learning/blob/main/tools/data_digestion.py)
script to process this data and obtain a csv version of the data, including preprocessed stats
for each trial.

## Convert the JSON to CSV

The `tools/data_digestion.py` script allows you to preprocess the JSON raw data and write it to a
CSV file:

```
python data_digestion.py /path/to/data/folder
```

By default, the script will write a `speech_learning_data.csv` file in the data folder.
If you want to save the CSV in another location, use the `--output` option.

# Installation in Raspberry Pi:

You will need to have access to a system with a bash shell, ssh and node installed.
If you are in linux, you probably are good with the defaults, for Windows users, your easiest way
would be using the Git Bash program to run the following commands.

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

4. When the first time you run this script, you will probably see this warning:

```
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Simply type `yes` and press enter.

4. If everything went well, you should now be able to access the server from your web browser.

# Troubleshooting

If the webapp is not working, there might be some error in the server.
To check wether there is the case, you can first open the `/logs/speech-practice.err.log` file in
the raspberry pi.
You might see an error ocurring on the appserver there.

When you try to fix the error, you can test the server without installation by running this command
in the raspberry pi:

```
python3 ~/speech-practice/run.py
```

This will run the server and print the output to the terminal, so you can see any errors happening
live.

## Install grpc in Arm devices (Raspberry Pi)

Due to some error in the grpc packages, the initial installation of the python grpc package can
fail.
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
   ````
   sudo cp .local/lib/python3.8/site-packages/grpc* /usr/local/lib/python3.8/dist-packages/ -r```
   ````

Each of these commands take a long time to complete (15-20 min), please be patient.
Hopefully, this will solve the missing `GLIBC_2.33` issue.
