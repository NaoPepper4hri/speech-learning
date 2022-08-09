import React from "react";

import { AppBar, MobileStepper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { sendAnswer, setCurrentPage } from "../utils";

export default class Navigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
    };
  }

  handleNext = (response) => {
    if (response !== undefined) {
      sendAnswer(response);
    }
    const { current: c } = this.state;
    setCurrentPage(c + 1);
    this.setState({ current: c + 1 });
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.current !== nextProps.current) {
      this.setState({
        current: nextProps.current,
      });
    }
    return true;
  }

  render() {
    const { current: c } = this.state;
    const { isLoading: loading } = this.props;
    var { layout } = this.props;
    if (!layout) {
      layout = [
        <Typography variant="h6">
          No layout provided, please specify questionaire layout in index.js
        </Typography>,
      ];
    }

    console.log(layout[c]);

    return (
      <Box
        position="sticky"
        height="85%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box>
          {React.cloneElement(layout[c], {
            isLoading: loading,
            handleNext: this.handleNext,
          })}
        </Box>
        <AppBar position="fixed" style={{ top: "auto", bottom: 0 }}>
          <MobileStepper
            variant="progress"
            steps={layout.length}
            position="static"
            activeStep={c}
            className={this.root}
            nextButton={<Box />}
            backButton={<Box />}
          />
        </AppBar>
      </Box>
    );
  }
}
