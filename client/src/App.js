import "./App.css";

import {
  MatchPairsQuestion,
  Navigator,
  ImageButtonQuestion,
  FillBlankQuestion,
  VocabularyQuestion,
  SortWordsQuestion,
} from "./components";
import image_example from "./assets/128x128@2x.png";
import questions from "./assets/questions.json";
import { fisherYatesShuffle } from "./utils";

const pairs = questions.pop();

for (var i = 0; i < 5; i++) {
  questions.push(pairs);
}

fisherYatesShuffle(questions);

const exampleQuestion5 = {
  question: "Select the real English words in this list",
  options: [
    {
      p1: "pajaro",
      p2: "bird",
    },
    {
      p1: "something",
      p2: "algo",
    },
    {
      p1: "walks",
      p2: "camina",
    },
    {
      p1: "verdadero",
      p2: "true",
    },
    {
      p1: "library",
      p2: "biblioteca",
    },
    {
      p1: "tool",
      p2: "herramienta",
    },
    {
      p1: "thinking",
      p2: "pensando",
    },
    {
      p1: "present",
      p2: "regalo",
    },
    {
      p1: "nineteen",
      p2: "diecinueve",
    },
  ],
};

function App() {
  return (
    <div className="App">
      <Navigator
        layout={questions.map((q, index) => {
          switch (q.ty) {
            case "ImageButtonQuestion":
              return (
                <ImageButtonQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                />
              );
            case "FillBlankQuestion":
              return (
                <FillBlankQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                />
              );
            case "VocabularyQuestion":
              return (
                <VocabularyQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                />
              );
            case "SortWordsQuestion":
              return (
                <SortWordsQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                />
              );
            case "MatchPairsQuestion":
              return (
                <MatchPairsQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                />
              );
            default:
              return <></>;
          }
        })}
      />
    </div>
  );
}

export default App;
