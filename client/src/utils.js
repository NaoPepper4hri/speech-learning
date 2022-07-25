export function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}

export const sendPepperCommand = async (
  cmd,
  text,
  notify_end = false,
  rot = 0,
  halt = true
) => {
  await fetch("/pubCommand", {
    method: "POST",
    body: JSON.stringify({
      movement: cmd,
      say: text,
      rot: rot,
      halt: halt,
      notify: notify_end,
    }),
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

export const setPepperDone = async () => {
  await fetch("/setPepperDone", {
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
