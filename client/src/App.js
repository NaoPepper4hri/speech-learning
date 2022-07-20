import "./App.css";
import React from "react";
import {
  MatchPairsQuestion,
  Navigator,
  ImageButtonQuestion,
  FillBlankQuestion,
  VocabularyQuestion,
  SortWordsQuestion,
} from "./components";
import questions from "./assets/questions.json";
import { fisherYatesShuffle } from "./utils";

const pairs = questions.pop();

for (var i = 0; i < 5; i++) {
  questions.push(pairs);
}

fisherYatesShuffle(questions);

class App extends React.Component {
  render() {
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
                    header={q.header}
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
}

export default App;
