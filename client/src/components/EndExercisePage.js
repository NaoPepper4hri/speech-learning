import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { logAction, saveData } from "../utils";

/**
 * Final page of the experiment. When open, it will request to save the experiment data.
 *
 * @extends {React.Component}
 */
class EndExercisePage extends React.Component {
  componentDidMount() {
    logAction("auto_ui", { id: "EndExperiment" });
    saveData();
  }

  render() {
    return (
      <Box m={5}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Box height="20px" />
            <Typography>
              You are done! Thank you for your participation.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default EndExercisePage;
