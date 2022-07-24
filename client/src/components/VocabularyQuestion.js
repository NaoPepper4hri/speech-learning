import { Button, Stack, Typography } from "@mui/material";
import React from "react";

class VocabularyQuestion extends React.Component {
  state = {};

  correctAnswer = (index) => {
    this.setState({ correct: index });
  };

  incorrectAnswer = (index) => {
    this.setState({ incorrect: index });
    setTimeout(() => this.setState({ incorrect: undefined }), 500);
  };

  render() {
    const { question, options } = this.props;
    const { correct, incorrect } = this.state;
    return (
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
          if (incorrect !== undefined && incorrect === idx) {
            c = "error";
            v = "contained";
            sx = {
              maxWidth: 200,
              alignSelf: "center",
            };
          } else if (correct !== undefined && correct === idx) {
            c = "success";
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
              onClick={() =>
                option.correct
                  ? this.correctAnswer(idx)
                  : this.incorrectAnswer(idx)
              }
            >
              {option.text}
            </Button>
          );
        })}
      </Stack>
    );
  }
}

export default VocabularyQuestion;
