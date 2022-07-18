import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

class ImageButtonQuestion extends React.Component {
  state = {};

  correctAnswer = (index) => {
    this.setState({ correct: index });
  };

  incorrectAnswer = (index) => {
    this.setState({ incorrect: index });
    setTimeout(() => this.setState({ incorrect: undefined }), 1000);
  };

  optionGrid = () => {
    const { options } = this.props;
    const { correct, incorrect } = this.state;
    return (
      <Grid container spacing={3} justifyContent="center">
        {options.map((option, idx) => {
          var bg = "main";
          if (incorrect !== undefined && incorrect === idx) {
            bg = "#f44336";
          } else if (correct !== undefined && correct === idx) {
            bg = "#66bb6a";
          }
          return (
            <Grid key={idx} item>
              <Card sx={{ width: 345, backgroundColor: bg }}>
                <CardActionArea
                  onClick={() => {
                    option.correct
                      ? this.correctAnswer(idx)
                      : this.incorrectAnswer(idx);
                  }}
                >
                  <CardMedia component="img" image={option.img}></CardMedia>
                  <CardContent>
                    <Typography>{option.text}</Typography>
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
    const { question } = this.props;
    return (
      <Stack spacing={4} padding={5}>
        <Typography variant="h4" gutterBottom>
          {question}
        </Typography>
        {this.optionGrid()}
      </Stack>
    );
  }
}

export default ImageButtonQuestion;
