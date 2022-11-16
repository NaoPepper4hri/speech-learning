## Running the experiment

Once the application is installed (see [Installation](./installation.md)), you can start setting up the
experiment area:

1. Start the server: start the device running this server (usually a Raspberry Pi or PC), then run
   the server application (if it's not set up to run automatically).
2. Start Pepper: Start the robot and connect it to the same network running the experiment.
3. Start all other devices: You need two tablets or PCs, start them and connect them to the same
   network as the device running the server.

Once all devices are on, you can start the `PepperBase` app in Pepper, and press the `Connect`
button.
Then, go to the devices that will be used for the main experiment and control pages, and open the
following pages in a web browser:

- For the main page:
  ```
  <server-ip>:5002
  ```
- For the control page:
  ```
  <server-ip>:5002/control
  ```

With this, everything should be ready to run the experiment.

### Retrieve the results

By default, the application writes the experiment data to `/data`.
In our lab, a partition in the Raspberry Pi's sd card is mounted in this directory, making it easy
to access the data.

To retrieve the data after an experiment, simply turn off the Raspberry Pi, extract the SD card and
plug it into your computer.
When detected, the SD card will show a `Data` partition.
You can find all the data there.

If you want to change the output folder for the experiment data, you can change this using the
`--output-folder` option when executing `run.py`.

### Processing the experiment data

Due to the dynamic nature of the experiment (some questions might not be answered, and some store
different types of data), we have decided to store all the experiment data (including a simple
logging system) as a JSON file.
This file can be loaded directly in different languages like Python for data analysis and contains
all the available information about a trial.

You can use
[data_digestion.py](https://github.com/NaoPepper4hri/speech-learning/blob/main/tools/data_digestion.py)
to process this data and obtain a CSV version of the data, including preprocessed stats for each
trial.

### Convert the JSON to CSV

The `tools/data_digestion.py` script allows you to preprocess the JSON raw data and write it to a
CSV file:

```
python data_digestion.py /path/to/data/folder
```

By default, the script will write a `speech_learning_data.csv` file in the data folder.
If you want to save the CSV in another location, use the `--output` option.
