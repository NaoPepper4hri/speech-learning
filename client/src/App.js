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

const exampleQuestion1 = {
  question: "Which one of these is 'the woman'?",
  options: [
    {
      text: "el hombre",
      img: image_example,
      correct: false,
    },
    {
      text: "la mujer",
      img: image_example,
      correct: true,
    },
    {
      text: "el niño",
      img: image_example,
      correct: false,
    },
  ],
};

const exampleQuestion2 = {
  question: "una niña, una {}",
  options: {
    a0: {
      id: "a0",
      text: "la",
      correct: false,
    },
    a1: {
      id: "a1",
      text: "mujer",
      correct: true,
    },
    a2: {
      id: "a2",
      text: "el",
      correct: false,
    },
    a3: {
      id: "a3",
      text: "yo",
      correct: false,
    },
  },
};

const exampleQuestion3 = {
  question: `How do you say "she"?`,
  options: [
    {
      text: "soy",
      correct: false,
    },
    {
      text: "ella",
      correct: true,
    },
    {
      text: "niña",
      correct: false,
    },
  ],
};

const exampleQuestion4 = {
  question: `Yo soy una mujer.`,
  options: {
    o0: {
      id: "o0",
      tIdx: 0,
      text: "I",
    },
    o1: {
      id: "o1",
      tIdx: 1,
      text: "am",
    },
    o2: {
      id: "o2",
      tIdx: 2,
      text: "a",
    },
    o3: {
      id: "o3",
      tIdx: 3,
      text: "woman",
    },
    o4: {
      id: "o4",
      tIdx: -1,
      text: "girl",
    },
    o5: {
      id: "o5",
      tIdx: -1,
      text: "boy",
    },
    o6: {
      id: "o6",
      tIdx: -1,
      text: "the",
    },
  },
};

const exampleQuestion5 = {
  question: "Select the real English words in this list",
  options: [
    {
      text: "wake",
      correct: true,
    },
    {
      text: "somether",
      correct: false,
    },
    {
      text: "walks",
      correct: true,
    },
    {
      text: "waines",
      correct: false,
    },
    {
      text: "bookstore",
      correct: true,
    },
    {
      text: "tooking",
      correct: false,
    },
    {
      text: "thinking",
      correct: true,
    },
    {
      text: "givess",
      correct: false,
    },
    {
      text: "nineteen",
      correct: true,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <Navigator
        layout={[
          <ImageButtonQuestion
            question={exampleQuestion1.question}
            options={exampleQuestion1.options}
          />,
          <FillBlankQuestion
            question={exampleQuestion2.question}
            options={exampleQuestion2.options}
          />,
          <VocabularyQuestion
            question={exampleQuestion3.question}
            options={exampleQuestion3.options}
          />,
          <SortWordsQuestion
            question={exampleQuestion4.question}
            options={exampleQuestion4.options}
          />,
          <MatchPairsQuestion
            question={exampleQuestion5.question}
            options={exampleQuestion5.options}
          />,
        ]}
      />
    </div>
  );
}

export default App;
