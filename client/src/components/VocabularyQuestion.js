import { Button, Stack, Typography } from "@mui/material";
import React from "react";

class VocabularyQuestion extends React.Component {
  correctAnswer = () => {
    console.log(true);
  };

  incorrectAnswer = () => {
    console.log(false);
  };

  render() {
    const { question, options } = this.props;
    return (
      <Stack spacing={5}>
        <Typography key="question" variant="h3">
          {`How do you say "${question}"?`}
        </Typography>
        {options.map((option, idx) => {
          return (
            <Button
              sx={{
                maxWidth: 200,
                alignSelf: "center",
                borderColor: "black",
                color: "black",
                "&:hover": {
                  borderColor: "gray",
                  backgroundColor: "#eeeeee",
                },
              }}
              variant="outlined"
              key={`btn${idx}`}
              onClick={
                option.correct ? this.correctAnswer : this.incorrectAnswer
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
