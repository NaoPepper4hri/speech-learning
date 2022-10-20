# Speech Learning Task

This web app is used as a base for the Speech Learning study, where participants' experience is
evaluated while performing a speech learning task (different exercises for vocabulary and writing)
with the support of an artificial agent: the Pepper robot.

The speech-learning program is in charge of managing the reactions of the robot, presenting the
questions to the participant and providing the ways to drive the experiment to an experiment
manager who can control the robot in a Wizard of Oz manner.

This application depends on the [PepperBase](https://github.com/NaoPepper4hri/PepperBase) project.
When this server is running and the PepperBase application is started in the Pepper Robot, Pepper
will connect to the server and start listening to the commands sent from the server to speak and
perform different actions.

You can find detailed information about the experiment in the documentation:

- [Installation and local setup](./doc/installation.md)
- [Running the experiment](./doc/usage_guide.md)
- [Architecture](./doc/architecture.md)
- [Troubleshooting](./doc/troubleshooting.md)
