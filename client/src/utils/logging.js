/**
 * Send a comment to the server.
 * This is used for logging purposes, providing a method for the experimenter to log their
 * observations during the experiment.
 *
 * @param {string} ty - used as identifyer for the comment.
 * @param {string} comment
 */
export const sendComment = async (ty, comment) => {
  await fetch("/pubComment", {
    method: "POST",
    body: JSON.stringify({ type: ty, text: comment, timestamp: Date.now() }),
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

/**
 * Submit a participant response.
 *
 * @param {(boolean|Object)} value
 */
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

/**
 * Send a entry to the log.
 *
 * @param {string} user - identifyer for the component responsible from triggering this log.
 * @param {Object} payload - the content of the log.
 */
export const logAction = async (user, payload) => {
  const time = Date.now();
  await fetch("/logAction", {
    method: "Post",
    body: JSON.stringify({ user: user, info: payload, time: time }),
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
      console.log(error);
    });
};
