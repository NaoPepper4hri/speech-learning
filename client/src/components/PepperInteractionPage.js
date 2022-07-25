import React from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { sendPepperCommand, onPepperIsDone } from "../utils";

class PepperInteractionPage extends React.Component {
  state = {
    pepperIsDone: false,
  };

  componentDidMount() {
    const { auto, pepperInteractions } = this.props;
    if (auto) {
      const re =
        pepperInteractions[
          Math.floor(Math.random() * pepperInteractions.length)
        ];

      sendPepperCommand(re["movement"], re["text"], true);
    }
    onPepperIsDone(() => this.setState({ pepperIsDone: true }));
  }

  render() {
    const { message, handleNext } = this.props;
    const { pepperIsDone } = this.state;

    return (
      <Stack padding={5} spacing={3}>
        <Typography>{message}</Typography>
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
          disabled={!pepperIsDone}
          onClick={() => handleNext()}
        >
          Continue
          <KeyboardArrowRightRounded />
        </Fab>
      </Stack>
    );
  }
}

export default PepperInteractionPage;
