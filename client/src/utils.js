export function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}

export const requestPepperAnimation = async (animation, halt) => {
  var cmd = {
    animation: {
      name: animation,
      halt: halt,
    }
  }
  await sendPepperCommand(cmd);
}

export const requestPepperText = async (text) => {
  var cmd = {
    say: text
  }
  await sendPepperCommand(cmd)
}

export const requestPepperLookAtParticipant = async () => {
  var cmd = {
    goto: {
      x: 0.0,
      y: 0.0,
      theta: 1.0,
    },
    abilities: [
      {
        ty: "BASIC_AWARENESS",
        enabled: true
      }
    ]
  }

  await sendPepperCommand(cmd);
}

export const requestPepperLookAtScreen = async () => {
  var cmd = {
    goto: {
      x: 0.0,
      y: 0.0,
      theta: -1.0,
    },
    abilities: [
      {
        ty: "BASIC_AWARENESS",
        enabled: false
      }
    ]
  }

  await sendPepperCommand(cmd);
}

export const sendPepperCommand = async (
  cmd,
) => {
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

export const onPepperIsDone = async (callback) => {
  var timer;
  timer = setInterval(async () => {
    await fetch("/isPepperDone", {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          res.text().then((data) => {
            console.warn(data);
          });
        } else {
          res.json().then((js) => {
            console.log(js);
            if (js["done"]) {
              console.log("jere");
              clearInterval(timer);
              callback();
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, 1000);
};

export const onConversationIsDone = async (callback) => {
  var timer;
  timer = setInterval(async () => {
    await fetch("/isConversationDone", {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          res.text().then((data) => {
            console.warn(data);
          });
        } else {
          res.json().then((js) => {
            console.log(js);
            if (js["done"]) {
              console.log("jere");
              clearInterval(timer);
              callback();
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, 1000);
};

export const setConversationDone = async (value=true) => {
  await fetch("/setConversationDone", {
    method: "POST",
    body: JSON.stringify({done: value}),
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

export const sendAnswer = async (value) => {
  await fetch("/pubAnswer", {
    method: "POST",
    body: JSON.stringify(value),
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

export const initialize = async (value) => {
  await fetch("/init", {
    method: "Post",
    body: JSON.stringify(value),
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
