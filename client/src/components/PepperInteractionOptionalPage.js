import React from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { PepperInteractionPage } from ".";

class PepperInteractionOptionalPage extends PepperInteractionPage {
  render() {
    const { message, handleNext, onContinue, options } = this.props;
    const { pepperIsDone } = this.state;
    const optionButtons = options.reverse().map((option, idx) => {
      return (
        <Fab
          variant="extended"
          sx={{
            margin: 0,
            top: "auto",
            right: 20,
            bottom: 60 * idx + 40,
            left: "auto",
            position: "fixed",
          }}
          disabled={pepperIsDone}
          onClick={() => {
            if (onContinue != null) {
              onContinue();
            }
            handleNext(undefined, option.goto);
          }}
        >
          {option.text}
          <KeyboardArrowRightRounded />
        </Fab>
      );
    });

    return (
      <Stack padding={5} spacing={3}>
        <Typography>{message}</Typography>
        {optionButtons}
      </Stack>
    );
  }
}

export default PepperInteractionOptionalPage;
