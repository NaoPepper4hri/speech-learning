import React from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import {
  requestPepperLookAtParticipant,
  requestPepperText,
  requestPepperLookAtScreen,
  onPepperIsDone,
  onConversationIsDone,
  setConversationDone,
} from "../utils";

class PepperInteractionPage extends React.Component {
  state = {
    pepperIsDone: false,
  };

  componentDidMount() {
    const { auto, pepperInteractions } = this.props;

    const turnAndSpeak = (text, onDone, lookAtScreen) => {
      requestPepperLookAtParticipant();
      onPepperIsDone(() => {
        requestPepperText(text);
        onPepperIsDone(() => {
          if (lookAtScreen) {
            requestPepperLookAtScreen();
            onPepperIsDone(onDone);
          } else {
            onDone();
          }
        });
      });
    };

    const waitForConversationDone = () => {
      setConversationDone(false);
      onConversationIsDone(() => this.setState({ pepperIsDone: true }));
    };

    const re =
      pepperInteractions[Math.floor(Math.random() * pepperInteractions.length)];

    if (re) {
      if (auto) {
        turnAndSpeak(
          re["text"],
          () => {
            this.setState({ pepperIsDone: true });
          },
          true
        );
      } else {
        turnAndSpeak(re["text"], waitForConversationDone, false);
      }
    } else {
      waitForConversationDone();
    }
  }

  render() {
    const { message, handleNext, onContinue } = this.props;
    const { pepperIsDone } = this.state;

    return (
      <Stack padding={5} spacing={3}>
        <Typography
          variant="h3"
          sx={{
            position: "fixed",
            margin: "auto",
            left: 0,
            right: 0,
            top: window.innerHeight / 2 - 100,
            bottom: 0,
          }}
        >
          {message}
        </Typography>
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
          onClick={() => {
            if (onContinue != null) {
              onContinue();
            }
            handleNext();
          }}
        >
          Continue
          <KeyboardArrowRightRounded />
        </Fab>
      </Stack>
    );
  }
}

export default PepperInteractionPage;
