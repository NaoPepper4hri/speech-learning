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
import { fisherYatesShuffle, saveData } from "./utils";

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
  // Block 1
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{text: "This is our first block. Are you ready to learn Spanish with me today?"}],
    message: "Block 1",
  },
  ...block1.slice(0, Math.floor(block1.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "You're doing really great! Lets keep going." }],
    message: "Half way, press continue.",
  },
  ...block1.slice(Math.floor(block1.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "End of Block 1, press Continue to start Block 2",
    onContinue: saveData
  },

  // Block 2
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{text: "Let's get ready to go. "}],
    message: "Block 2",
  },
  ...block2.slice(0, Math.floor(block2.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "You're really getting the hang of it! Keep up the good work." }],
    message: "Half way, press continue.",
  },
  ...block2.slice(Math.floor(block2.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "End of Block 2, press Continue to start Block 3",
    onContinue: saveData
  },

  // Block 3
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{text: "We have done two blocks so far, only two more to go."}],
    message: "Block 3",
  },
  ...block3.slice(0, Math.floor(block3.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "We're already halfway through this block, you're doing great. Lets keep up this momentum." }],
    message: "Half way, press continue.",
  },
  ...block3.slice(Math.floor(block3.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "End of Block 3, press Continue to start Block 4",
    onContinue: saveData
  },

  // Block 4
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{text: "We are almost done. That went really quick, just one block to go."}],
    message: "Block 4",
  },
  ...block4.slice(0, Math.floor(block4.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "These blocks are getting harder but you're doing a great job, keep it up." }],
    message: "Half way, press continue.",
  },
  ...block4.slice(Math.floor(block4.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "End of Block 4, press Continue to start Block 5",
    onContinue: saveData
  },

  // Block 5
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{text: "Ok, lets start the bonus block, are you ready to go?"}],
    message: "Block 5",
  },
  ...block5.slice(0, Math.floor(block5.length / 2)),
  {
    ty: "PepperResponse",
    auto: true,
    pepperInteractions: [{ text: "You're already halfway through, lets see if we can finish off even better and faster." }],
    message: "Half way, press continue.",
  },
  ...block5.slice(Math.floor(block5.length / 2), 10),
  {
    ty: "PepperResponse",
    auto: false,
    pepperInteractions: [],
    message: "End of Block 5. Done!",
    onContinue: saveData
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
