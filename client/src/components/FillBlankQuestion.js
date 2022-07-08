import React from "react";
import { Stack } from "@mui/material";
// TODO: See https://github.com/atlassian/react-beautiful-dnd/issues/2426

class FillBlankQuestion extends React.Component {
  render() {
    const { image } = this.props;
    return (
      <Stack spacing={2}>
        <img src={image} alt="" />
      </Stack>
    );
  }
}

export default FillBlankQuestion;
