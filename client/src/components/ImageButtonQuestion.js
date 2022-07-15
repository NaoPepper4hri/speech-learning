import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

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
      <Box>
        <Typography variant="h3" gutterBottom>
          {question}
        </Typography>
        {this.optionGrid()}
      </Box>
    );
  }
}

export default ImageButtonQuestion;
