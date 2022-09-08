import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { logAction } from "../utils";

class ImageButtonQuestion extends React.Component {
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

  optionGrid = () => {
    const { options, id } = this.props;
    const { showAnswer } = this.state;
    return (
      <Grid container spacing={3} justifyContent="center">
        {options.map((option, idx) => {
          var bg = "main";
          if (showAnswer !== undefined && showAnswer.includes(idx)) {
            bg = option.correct ? "#66bb6a" : "#f44336";
          }
          return (
            <Grid key={idx} item>
              <Card sx={{ width: 300, height: 300, backgroundColor: bg }}>
                <CardActionArea
                  onClick={() => {
                    if (showAnswer.length === 0) {
                      logAction("participant", { id: "answer", qId: id });
                      option.correct
                        ? this.correctAnswer(idx)
                        : this.incorrectAnswer(idx);
                    }
                  }}
                >
                  <CardContent sx={{ height: 300 }}>
                    <Stack
                      spacing={4}
                      paddingTop={4}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        src={process.env.PUBLIC_URL + `${option.image}.png`}
                        alt=""
                        style={{
                          maxHeight: 150,
                        }}
                      />
                      <Typography variant="h4">{option.text}</Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  render() {
    const { question, handleNext, id } = this.props;
    const { responded, response } = this.state;
    return (
      <React.Fragment>
        <Stack spacing={4} padding={5}>
          <Typography variant="h3" gutterBottom>
            {question}
          </Typography>
          {this.optionGrid()}
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

export default ImageButtonQuestion;
