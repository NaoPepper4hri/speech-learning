import { TextField } from "@mui/material";
import "./App.css";

import { SelectRealTextQuestion, Navigator } from "./components";
import image_example from "./assets/128x128@2x.png";

const exampleQuestion = {
  question: "What is this text?",
  options: [
    {
      id: 3,
      text: "text3",
      img: image_example,
      correct: false,
    },
    {
      id: 2,
      text: "text2",
      img: image_example,
      correct: true,
    },
    {
      id: 1,
      text: "text1",
      img: image_example,
      correct: true,
    },
    {
      id: 4,
      text: "text2",
      img: image_example,
      correct: true,
    },
    {
      id: 5,
      text: "text1",
      img: image_example,
      correct: true,
    },
    {
      id: 6,
      text: "text2",
      img: image_example,
      correct: true,
    },
    {
      id: 7,
      text: "text1",
      img: image_example,
      correct: true,
    },
    {
      id: 8,
      text: "text2",
      img: image_example,
      correct: true,
    },
    {
      id: 9,
      text: "text1",
      correct: true,
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
      <Navigator
        layout={[
          <SelectRealTextQuestion
            question={exampleQuestion.question}
            options={exampleQuestion.options}
            answer={exampleQuestion.answer}
          />,
          <SelectRealTextQuestion
            question={exampleQuestion.question}
            options={exampleQuestion.options}
            answer={exampleQuestion.answer}
          />,
          <SelectRealTextQuestion
            question={exampleQuestion.question}
            options={exampleQuestion.options}
            answer={exampleQuestion.answer}
          />,
        ]}
      />
    </div>
  );
}

export default App;
