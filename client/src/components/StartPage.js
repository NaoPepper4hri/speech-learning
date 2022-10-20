import React from "react";
import {
  Backdrop,
  Box,
  Fab,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { logAction } from "../utils";

/**
 * Initial page for the experiment.
 *
 * @extends {React.Component}
 */
class StartPage extends React.Component {
  state = {
    showSpinner: false,
  };

  render() {
    const { handleNext } = this.props;
    const { showSpinner } = this.state;

    const snd = new Audio(process.env.PUBLIC_URL + "beep.wav");
    snd.onended = () => {
      logAction("participant", { id: "StartExperiment" });
      handleNext();
    };

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
            this.setState({ showSpinner: true });
            snd.play();
          }}
        >
          Start
          <KeyboardArrowRightRounded />
        </Fab>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showSpinner}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </React.Fragment>
    );
  }
}

export default StartPage;
