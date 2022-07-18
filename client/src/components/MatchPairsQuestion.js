import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { fisherYatesShuffle } from "../utils";

class MatchPairsQuestion extends React.Component {
  constructor(props) {
    super(props);
    const opts = Array.from(props.options);
    fisherYatesShuffle(opts);
    const buttons = opts
      .slice(0, 8)
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
      <Stack maxWidth={600} padding={5} spacing={3} alignItems="center">
        <Typography variant="h4" gutterBottom>
          {question}
        </Typography>
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
