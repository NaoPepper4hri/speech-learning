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
  correctAnswer = () => {
    console.log(true);
  };

  incorrectAnswer = () => {
    console.log(false);
  };

  optionGrid = () => {
    const { options } = this.props;
    return (
      <Grid container spacing={3} justifyContent="center">
        {options.map((option, idx) => {
          return (
            <Grid key={idx} item>
              <Card sx={{ width: 345 }}>
                <CardActionArea
                  onClick={() => {
                    option.correct
                      ? this.correctAnswer()
                      : this.incorrectAnswer();
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
      <Stack spacing={4}>
        <Typography variant="h4" gutterBottom>
          {question}
        </Typography>
        {this.optionGrid()}
      </Stack>
    );
  }
}

export default ImageButtonQuestion;
