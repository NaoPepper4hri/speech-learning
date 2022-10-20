import React from "react";

import { AppBar, MobileStepper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { sendAnswer, setCurrentPage } from "../utils";

/**
 * A page manager and navigator.
 *
 * Shows the current page and allows moving back and forth between pages.
 *
 * @extends {React.Component}
 */
export default class Navigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
      timestamp: performance.now(),
    };
  }

  handleNext = (response, gotoIdx) => {
    if (response !== undefined) {
      const elapsed = performance.now() - this.state.timestamp;
      sendAnswer({ time: elapsed, ...response });
    }
    const { current } = this.state;
    const { layout } = this.props;
    var nextPage = 0;
    if (gotoIdx === undefined) {
      nextPage = current + 1;
    } else if (gotoIdx < 0) {
      nextPage = layout.length + gotoIdx;
    } else {
      nextPage = gotoIdx;
    }
    setCurrentPage(nextPage);
    this.setState({ current: nextPage, timestamp: performance.now() });
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
