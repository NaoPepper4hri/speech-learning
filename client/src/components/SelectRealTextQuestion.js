import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";

class SelectRealTextQuestion extends React.Component {
  answerCorrect = () => {
    console.log(true);
  };

  answerIncorrect = () => {
    console.log(false);
  };

  render() {
    const { question, options, answer } = this.props;
    return (
      <Stack>
        <Typography>{question}</Typography>
        <Grid container justifyContent="space-evenly" spacing={3}>
          {options.map((option) => {
            return (
              <Grid key={option.id} item>
                <Button
                  onClick={
                    option.id === answer
                      ? this.answerCorrect
                      : this.answerIncorrect
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

export default SelectRealTextQuestion;
