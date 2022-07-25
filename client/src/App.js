import "./App.css";
import React from "react";
import {
  MatchPairsQuestion,
  Navigator,
  ImageButtonQuestion,
  FillBlankQuestion,
  VocabularyQuestion,
  SortWordsQuestion,
  ParticipantInfoPage,
  PepperInteractionPage,
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

const blocks = [
  { ty: "ParticipantInfo" },
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "Hello", movement: "" }],
    message: "We are going for another block",
  },
  ...block1.slice(0, Math.floor(block1.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "Hello", movement: "" }],
    message: "We are going for another block",
  },
  ...block1.slice(Math.floor(block1.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "We are going for another block",
  },
];

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navigator
          layout={blocks.map((q, index) => {
            switch (q.ty) {
              case "ParticipantInfo":
                return <ParticipantInfoPage key={index} />;
              case "PepperResponse":
                return (
                  <PepperInteractionPage
                    key={index}
                    auto={q.auto}
                    message={q.message}
                    pepperInteractions={q.pepperInteractions}
                  />
                );
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
                    answer={q.answer}
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
