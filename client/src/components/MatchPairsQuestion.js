import React from "react";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { Button, Fab, Grid, Stack, Typography } from "@mui/material";
import { fisherYatesShuffle, logAction } from "../utils";

class MatchPairsQuestion extends React.Component {
  constructor(props) {
    super(props);
    const opts = Array.from(props.options);
    fisherYatesShuffle(opts);

    var bl = [];
    var br = [];

    opts.slice(0, 8).forEach((o, i) => {
      bl.push({ text: o.p1, idx: i });
      br.push({ text: o.p2, idx: i });
    });

    fisherYatesShuffle(bl);
    fisherYatesShuffle(br);

    this.state = {
      correct: [],
      clicked: [],
      bl: bl,
      br: br,
      buttons: bl.concat(br),
      answers: [],
    };
  }

  toogleButton = (index) => {
    const { answers, buttons, clicked, correct } = this.state;

    if (clicked.length === 0) {
      this.setState({ clicked: [index] });
    } else {
      var cor = false;
      if (
        clicked[0] !== index &&
        buttons[clicked[0]].idx === buttons[index].idx
      ) {
        // the pair is correct
        correct.push(clicked[0], index);
        cor = true;
      }
      const newAnswer = {
        correct: cor,
        p1: buttons[clicked[0]].text,
        p2: buttons[index].text,
      };
      this.setState({
        clicked: [],
        correct: correct,
        answers: [...answers, newAnswer],
      });
    }
  };

  render() {
    const { id, question, handleNext } = this.props;
    const { answers, correct, bl, br, buttons, clicked } = this.state;

    const renderButton = (button, index) => {
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
            <Typography variant="h5">{button.text}</Typography>
          </Button>
        </Grid>
      );
    };
    return (
      <React.Fragment>
        <Stack maxWidth={600} padding={5} spacing={3} alignItems="center">
          <Typography variant="h4" gutterBottom>
            {question}
          </Typography>
          <Grid container justifyContent="center" spacing={10}>
            <Grid
              container
              item
              spacing={3}
              xs={6}
              direction="column"
              alignItems="center"
            >
              {bl.map(renderButton)}
            </Grid>
            <Grid container item spacing={3} xs={6} direction="column">
              {br.map((button, index) =>
                renderButton(button, index + bl.length)
              )}
            </Grid>
          </Grid>
        </Stack>
        {correct.length === buttons.length ? (
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
              handleNext({
                id: id,
                options: this.state.buttons.map((b) => b.text),
                response: answers,
              });
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

export default MatchPairsQuestion;
