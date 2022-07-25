import React from "react";
import { Box, Fab, Grid, TextField } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { initialize } from "../utils";

class ParticipantInfoPage extends React.Component {
  state = {
    id: "",
    date: new Date().toLocaleString(),
  };

  render() {
    const { handleNext } = this.props;
    const { id } = this.state;

    return (
      <React.Fragment>
        <Box m={5}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Box height="20px" />
              <TextField
                label="Participant ID"
                variant="outlined"
                value={id}
                onChange={(event) => this.setState({ id: event.target.value })}
              />
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
            initialize(this.state);
            handleNext();
          }}
        >
          Continue
          <KeyboardArrowRightRounded />
        </Fab>
      </React.Fragment>
    );
  }
}

export default ParticipantInfoPage;
