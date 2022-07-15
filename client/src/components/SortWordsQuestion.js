import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";

class SortWordsQuestion extends React.Component {
  answerCorrect = () => {
    console.log(true);
  };

  answerIncorrect = () => {
    console.log(false);
  };

  render() {
    const { question, options } = this.props;
    return (
      <Stack>
        <Typography>{question}</Typography>
        <Grid container justifyContent="space-evenly" spacing={3}>
          {options.map((option) => {
            return (
              <Grid key={option.id} item>
                <Button
                  onClick={
                    option.correct ? this.answerCorrect : this.answerIncorrect
                  }
                >
                  {option.text}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    );
  }
}

export default SortWordsQuestion;
