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

const MATCH_PAIR_QUESTION_NUMBER = 5;

const block1 = [];
const block2 = [];
const block3 = [];
const block4 = [];
const block5 = [];

for (var i = 0; i < questions.length; i++) {
  switch (questions[i].ty) {
    case "ImageButtonQuestion":
      block1.push(questions[i]);
      break;
    case "FillBlankQuestion":
      block2.push(questions[i]);
      break;
    case "VocabularyQuestion":
      block3.push(questions[i]);
      break;
    case "SortWordsQuestion":
      block4.push(questions[i]);
      break;
    case "MatchPairsQuestion":
      for (var j = 0; j < MATCH_PAIR_QUESTION_NUMBER; j++) {
        block5.push(questions[i]);
      }
      break;
    default:
      break;
  }
}

fisherYatesShuffle(block1);
fisherYatesShuffle(block2);
fisherYatesShuffle(block3);
fisherYatesShuffle(block4);
fisherYatesShuffle(block5);

const blocks = [...block1, ...block2, ...block3, ...block4, ...block5];

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navigator
          layout={blocks.map((q, index) => {
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
