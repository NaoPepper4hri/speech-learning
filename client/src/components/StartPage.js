import React from "react";
import { Box, Fab, Grid, Typography } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { initialize } from "../utils";

class StartPage extends React.Component {
  render() {
    const { handleNext } = this.props;

    return (
      <React.Fragment>
        <Box m={5}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Box height="20px" />
              <Typography>Press Start when you are ready</Typography>
            </Grid>
          </Grid>
        </Box>
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
            handleNext();
          }}
        >
          Start
          <KeyboardArrowRightRounded />
        </Fab>
      </React.Fragment>
    );
  }
}

export default StartPage;
