import React from "react";

import { AppBar, Button, MobileStepper, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box } from "@mui/system";

export default class Navigator extends React.Component {
  constructor(props) {
    super(props);

    if (!props.layout) {
      this.layout = [
        <Typography variant="h6">
          No layout provided, please specify questionaire layout in index.js
        </Typography>,
      ];
    } else {
      this.layout = props.layout;
    }

    this.layout_length = this.layout.length;

    this.state = {
      current: 0,
    };
  }

  handleNext = () => {
    const { current: c } = this.state;
    this.setState({ current: c + 1 });
  };

  handleBack = () => {
    const { current: c } = this.state;
    this.setState({ current: c - 1 });
  };

  render() {
    const { current: c } = this.state;
    const { isLoading: loading } = this.props;
    return (
      <Box
        position="sticky"
        height="85%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box>
          {React.cloneElement(this.layout[c], {
            isLoading: loading,
          })}
        </Box>
        <AppBar position="fixed" style={{ top: "auto", bottom: 0 }}>
          <MobileStepper
            variant="progress"
            steps={this.layout_length}
            position="static"
            activeStep={c}
            className={this.root}
            nextButton={
              <Button
                size="small"
                onClick={this.handleNext}
                disabled={c === this.layout_length - 1}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={this.handleBack} disabled={c === 0}>
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </AppBar>
      </Box>
    );
  }
}
