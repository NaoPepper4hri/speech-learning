/**
 * Retrieve the current state of the experiment (layout + page number), and execute the provided
 * callback when recieved.
 *
 * @param {function(Object):void} onComplete
 */
export const getExpState = async (onComplete) => {
  var state = {};
  await fetch("/getExpState", {
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
        res.json().then((data) => {
          onComplete(data);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return state;
};

/**
 * Submit a new questionaire layout to the server (for a new experiment).
 *
 * @param {Object[]} layout
 */
export const setNewQuestionLayout = async (layout) => {
  await fetch("/setNewQuestionLayout", {
    method: "POST",
    body: JSON.stringify(layout),
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
 * Update the page index in the server.
 *
 * @param {number} page
 */
export const setCurrentPage = async (page) => {
  await fetch("/setCurrentPage", {
    method: "POST",
    body: JSON.stringify({ current: page }),
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
 * Execute the initialization of the experiment.
 *
 * @param {Object} value - object including the participant ID and other relevant data.
 */
export const initialize = async (value) => {
  await fetch("/init", {
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
 * Store the current available data of the experiment run.
 */
export const saveData = async () => {
  await fetch("/save", {
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

/**
 * Clear all data and experiment state.
 */
export const restartExperiment = async () => {
  await fetch("/restartExperiment", {
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
