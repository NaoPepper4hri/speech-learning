import { Button, TextField } from "@mui/material";
import "./App.css";

import { ImageButtonQuestion, VocabularyQuestion } from "./components";
import image_example from "./assets/128x128@2x.png";

const exampleQuestion = {
  question: "What is this text?",
  options: [
    {
      id: 3,
      text: "text3",
      img: image_example,
    },
    {
      id: 2,
      text: "text2",
      img: image_example,
    },
    {
      id: 1,
      text: "text1",
      img: image_example,
    },
  ],
  answer: 3,
};

function App() {
  return (
    <div className="App">
      <TextField
        required
        id="outlined-required"
        label="Required"
        defaultValue="Hello World"
      />
      <Button
        onClick={() => {
          fetch("/pubCommand", {
            method: "POST",
            body: JSON.stringify({ movement: "test command", halt: true }),
            headers: new Headers({
              "content-type": "application/json",
            }),
          })
            .then((res) => {
              console.log(res);
            })
            .catch((e) => {
              console.error(e);
            });
        }}
      >
        here
      </Button>
      <VocabularyQuestion
        question={exampleQuestion.question}
        options={exampleQuestion.options}
        answer={exampleQuestion.answer}
      />
    </div>
  );
}

export default App;
