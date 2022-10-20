/**
 * Send a command to Pepper to execute a specific animation.
 *
 * @param {string} animation - the name of the animation to execute
 * @param {boolean} halt - if true, stop all running animations before running this request.
 * @param {*} meta - any other information to send to the server (used for logging purposes).
 */
export const requestPepperAnimation = async (animation, halt, meta) => {
  var cmd = {
    animation: {
      name: animation,
      halt: halt,
    },
    timestamp: Date.now(),
    type: "Animation",
    ...meta,
  };
  await sendPepperCommand(cmd);
};

/**
 * Send a command to Pepper to say out loud the specified text.
 *
 * @param {string} text - the text to be processed by Pepper.
 * @param {*} meta - any other information to send to the server (used for logging purposes).
 */
export const requestPepperText = async (text, meta) => {
  var cmd = {
    say: text,
    timestamp: Date.now(),
    type: "TextToSpeech",
    ...meta,
  };
  await sendPepperCommand(cmd);
};

/**
 * Command Pepper to turn and focus on the participant.
 *
 * @param {*} meta - any other information to send to the server (used for logging purposes).
 */
export const requestPepperLookAtParticipant = async (meta) => {
  var cmd = {
    goto: {
      x: 0.0,
      y: 0.0,
      theta: 1.0,
    },
    abilities: [
      {
        ty: "BASIC_AWARENESS",
        enabled: true,
      },
    ],
    timestamp: Date.now(),
    type: "LookAtParticipant",
    ...meta,
  };
  await sendPepperCommand(cmd);
};

/**
 * Command Pepper to stop human tracking and turn towards its original position.
 *
 * @param {*} meta - any other information to send to the server (used for logging purposes).
 */
export const requestPepperLookAtScreen = async (meta) => {
  var cmd = {
    goto: {
      x: 0.0,
      y: 0.0,
      theta: -1.0,
    },
    abilities: [
      {
        ty: "BASIC_AWARENESS",
        enabled: false,
      },
    ],
    timestamp: Date.now(),
    type: "LookAtScreen",
    ...meta,
  };
  await sendPepperCommand(cmd);
};

/**
 * Request a new the execution of a new command for Pepper.
 *
 * @param {Object} cmd
 */
const sendPepperCommand = async (cmd) => {
  await fetch("/pubCommand", {
    method: "POST",
    body: JSON.stringify(cmd),
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        res.text().then((data) => {
          console.warn(data);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
