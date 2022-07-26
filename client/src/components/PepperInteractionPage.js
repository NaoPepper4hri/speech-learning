import React from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import {
  requestPepperLookAtParticipant,
  requestPepperText,
  requestPepperLookAtScreen,
  onPepperIsDone,
  onConversationIsDone,
  setConversationDone } from "../utils";

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

      requestPepperLookAtParticipant()
      requestPepperText(re["text"]);
      requestPepperLookAtScreen()
      onPepperIsDone(() => this.setState({ pepperIsDone: true }));
    } else {
      setConversationDone(false);
      onConversationIsDone(() => this.setState({ pepperIsDone: true}));
    }

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
