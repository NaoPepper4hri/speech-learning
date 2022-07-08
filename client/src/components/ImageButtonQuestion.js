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
  onButtonPress = (id) => {
    const { answer } = this.props;
    return () => {
      if (answer === id) {
        console.log(true);
      } else {
        console.log(false);
      }
    };
  };

  optionGrid = () => {
    const { options } = this.props;
    return (
      <Grid container spacing={3} justifyContent="center">
        {options.map((option) => {
          return (
            <Grid key={option.id} item>
              <Card sx={{ width: 345 }}>
                <CardActionArea onClick={this.onButtonPress(option.id)}>
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
