export function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}

export const sendPepperCommand = async (cmd, text, rot = 0, halt = true) => {
  await fetch("/pubCommand", {
    method: "POST",
    body: JSON.stringify({ command: cmd, say: text, rot: rot, halt: halt }),
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
