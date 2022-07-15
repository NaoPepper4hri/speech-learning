import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";

function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}

class MatchPairsQuestion extends React.Component {
  constructor(props) {
    super(props);
    const buttons = props.options
      .map((o, i) => [
        { text: o.p1, idx: i },
        { text: o.p2, idx: i },
      ])
      .flat();
    fisherYatesShuffle(buttons);

    this.state = {
      correct: [],
      clicked: [],
      buttons: buttons,
    };
  }

  toogleButton = (index) => {
    const { correct, buttons, clicked } = this.state;
    if (clicked.length === 0) {
      this.setState({ clicked: [index] });
    } else {
      if (
        clicked[0] !== index &&
        buttons[clicked[0]].idx === buttons[index].idx
      ) {
        // the pair is correct
        correct.push(clicked[0], index);
      }
      this.setState({ clicked: [], correct: correct });
    }
  };

  render() {
    const { question } = this.props;
    const { correct, buttons, clicked } = this.state;
    return (
      <Stack>
        <Typography>{question}</Typography>
        <Grid container justifyContent="space-evenly" spacing={3}>
          {buttons.map((b, index) => {
            const done = correct.includes(index);
            const clk = clicked.includes(index);
            return (
              <Grid key={index} item>
                <Button
                  variant={clk ? "contained" : "outlined"}
                  onClick={() => {
                    this.toogleButton(index);
                  }}
                  disabled={done}
                >
                  {b.text}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    );
  }
}

export default MatchPairsQuestion;
