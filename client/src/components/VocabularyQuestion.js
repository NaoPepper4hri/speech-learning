import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { Button, Fab, Stack, Typography } from "@mui/material";
import React from "react";
import { logAction } from "../utils";

class VocabularyQuestion extends React.Component {
  state = {
    showAnswer: [],
    responded: false,
  };

  correctAnswer = (index) => {
    this.setState({ showAnswer: [index], response: true });
    setTimeout(() => this.setState({ responded: true }), 500);
  };

  incorrectAnswer = (index) => {
    const { options } = this.props;
    const correct = options
      .map((o, idx) => {
        return { c: o.correct, idx: idx };
      })
      .filter((o) => o.c)[0].idx;
    this.setState({ showAnswer: [index], response: false });
    setTimeout(
      () => this.setState({ showAnswer: [correct, ...this.state.showAnswer] }),
      500
    );
    setTimeout(() => this.setState({ responded: true }), 1000);
  };

  componentDidMount() {
    logAction("auto_ui", { id: "question_presented", qId: this.props.id });
  }

  render() {
    const { question, options, handleNext, id } = this.props;
    const { showAnswer, responded, response } = this.state;
    return (
      <React.Fragment>
        <Stack spacing={5} padding={5}>
          <Typography key="question" variant="h4">
            {`How do you say "${question}"?`}
          </Typography>
          {options.map((option, idx) => {
            var c = "primary";
            var v = "outlined";
            var sx = {
              maxWidth: 200,
              alignSelf: "center",
              borderColor: "black",
              color: "black",
              "&:hover": {
                borderColor: "gray",
                backgroundColor: "#eeeeee",
              },
            };
            if (showAnswer.includes(idx)) {
              c = option.correct ? "success" : "error";
              v = "contained";
              sx = {
                maxWidth: 200,
                alignSelf: "center",
              };
            }
            return (
              <Button
                sx={sx}
                color={c}
                variant={v}
                key={`btn${idx}`}
                onClick={() => {
                  if (showAnswer.length === 0) {
                    logAction("participant", { id: "answer", qId: id });
                    option.correct
                      ? this.correctAnswer(idx)
                      : this.incorrectAnswer(idx);
                  }
                }}
              >
                <Typography variant="h5">{option.text}</Typography>
              </Button>
            );
          })}
        </Stack>
        {responded ? (
          <Fab
            variant="extended"
            sx={{
              margin: 0,
              top: "auto",
              right: 20,
              bottom: 40,
              left: "auto",
              position: "fixed",
            }}
            onClick={() => {
              logAction("participant", { id: "nextButton", qId: id });
              handleNext({ id: id, response: response });
            }}
          >
            Continue
            <KeyboardArrowRightRounded />
          </Fab>
        ) : (
          <></>
        )}
      </React.Fragment>
    );
  }
}

export default VocabularyQuestion;
