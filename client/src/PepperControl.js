import { Button, Grid } from "@mui/material";
import React from "react";
import { sendPepperCommand } from "./utils";

const actions = [
  "appraise",
  "you_were_wrong",
  "cheer",
  "ohno",
  "and",
  "some",
  "other",
  "animations",
];

class PepperControl extends React.Component {
  render() {
    return (
      <Grid container padding={5} spacing={3}>
        {actions.map((a) => (
          <Grid item xs={3} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => {
                sendPepperCommand(a, a);
              }}
            >
              {a}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          Some other controls
        </Grid>
      </Grid>
    );
  }
}

export default PepperControl;
