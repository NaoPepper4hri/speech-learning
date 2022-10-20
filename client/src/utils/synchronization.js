/**
 * Starts a timer that will ask the server when Pepper has emptied the command queue. When Pepper
 * is done, it executes the provided callback
 *
 * @param {function} callback
 */
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

/**
 * Starts a timer that will ask the server if the experimenter has reported that the current
 * interaction has finished.
 *
 * @param {function} callback - executed when the interaction is done.
 */
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

/**
 * Set the flag that marks the end of the interaction in Wizard of Oz interactions.
 *
 * @param {boolean} value
 */
export const setConversationDone = async (value = true) => {
  await fetch("/setConversationDone", {
    method: "POST",
    body: JSON.stringify({ done: value, timestamp: Date.now() }),
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
