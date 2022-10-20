import "./App.css";
import React from "react";

import {
  EndExercisePage,
  FillBlankQuestion,
  ImageButtonQuestion,
  MatchPairsQuestion,
  Navigator,
  PepperInteractionOptionalPage,
  PepperInteractionPage,
  SortWordsQuestion,
  StartPage,
  VocabularyQuestion,
} from "./components";
import { loadNewBlocks, getExpState, setNewQuestionLayout } from "./utils";

/**
 * Main application.
 *
 * @extends {React.Component}
 */
class App extends React.Component {
  state = {
    current: 0,
    layout: [{ ty: "Start" }],
  };

  /**
   * Ask the server for the active experiment layout.
   * This is used to allow reloading the page without loosing the state of the experiment.
   * The layout of the questions is stored in the server for each run.
   */
  getBlocks = () => {
    getExpState((state) => {
      if (state["layout"]?.length === 0) {
        const layout = loadNewBlocks();
        setNewQuestionLayout(layout);
        state["layout"] = layout;
      }
      this.setState(state);
    });
  };

  componentDidMount() {
    this.getBlocks();
  }

  render() {
    const { current, layout } = this.state;
    console.log(layout);
    return (
      <div className="App">
        <Navigator
          current={current}
          layout={layout.map((q, index) => {
            switch (q.ty) {
              case "Start":
                return <StartPage key={index} />;
              case "EndExercise":
                return <EndExercisePage />;
              case "PepperResponse":
                return (
                  <PepperInteractionPage
                    key={index}
                    id={q.id}
                    auto={q.auto}
                    message={q.message}
                    pepperInteractions={q.pepperInteractions}
                  />
                );
              case "PepperResponseOption":
                return (
                  <PepperInteractionOptionalPage
                    key={index}
                    id={q.id}
                    auto={q.auto}
                    message={q.message}
                    options={q.options}
                    pepperInteractions={q.pepperInteractions}
                  />
                );
              case "ImageButtonQuestion":
                return (
                  <ImageButtonQuestion
                    key={index}
                    id={q.id}
                    question={q.question}
                    options={q.options}
                  />
                );
              case "FillBlankQuestion":
                return (
                  <FillBlankQuestion
                    key={index}
                    id={q.id}
                    image={q.image}
                    question={q.question}
                    options={q.options}
                    translation={q.translation}
                  />
                );
              case "VocabularyQuestion":
                return (
                  <VocabularyQuestion
                    key={index}
                    id={q.id}
                    question={q.question}
                    options={q.options}
                  />
                );
              case "SortWordsQuestion":
                return (
                  <SortWordsQuestion
                    key={index}
                    id={q.id}
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
                    id={q.id}
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
