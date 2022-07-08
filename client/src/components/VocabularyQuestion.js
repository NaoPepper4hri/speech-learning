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
    const { question, options, answer } = this.props;
    return (
      <Stack spacing={5}>
        <Typography variant="h3">{question}</Typography>
        {options.map((option) => {
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
              key={option.id}
              onClick={
                option.id === answer ? this.correctAnswer : this.incorrectAnswer
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
