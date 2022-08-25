import React from "react";
import styled from "styled-components";
import { Stack, Typography, Fab } from "@mui/material";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Card = styled.div`
  border: 1px solid lightgrey;
  border-radius: 6px;
  padding: 4px;
  background-color: ${(props) => {
    switch (props.color) {
      case "success":
        return "#66bb6a";
      case "error":
        return "#f44336";
      default:
        return "white";
    }
  }};
  min-height: 10px;
  min-width: 40px;
`;

const OptionContainer = styled.div`
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
  background-color: white;
  min-height: 10px;
  min-width: 40px;
`;

const AnswerContainer = styled.div`
  border: ${(props) => (props.border ? props.border : "1px solid lightgrey")};
  border-radius: 6px;
  margin-bottom: 10px;
  margin-left: 8px;
  margin-right: 8px;
  background-color: white;
  min-height: 40px;
  min-width: 100px;
`;

class DraggableAnswer extends React.Component {
  render() {
    const { id, index, text, color } = this.props;
    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            color={color}
          >
            <Typography variant="h6">{text}</Typography>
          </Card>
        )}
      </Draggable>
    );
  }
}

class QuestionDroppable extends React.Component {
  render() {
    const { id, answer, color } = this.props;
    return (
      <Droppable
        droppableId={id}
        direction="horizontal"
        alignItems="center"
        justifyContent="center"
      >
        {(provided) => (
          <AnswerContainer
            border={answer !== undefined ? "none" : ""}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Stack direction="row">
              {answer !== undefined ? (
                <DraggableAnswer
                  key={answer.id}
                  id={answer.id}
                  text={answer.text}
                  index={0}
                  color={color}
                ></DraggableAnswer>
              ) : (
                <> </>
              )}
            </Stack>
          </AnswerContainer>
        )}
      </Droppable>
    );
  }
}

class OptionsDroppable extends React.Component {
  render() {
    const { id, options } = this.props;
    return (
      <Droppable droppableId={id} direction="horizontal">
        {(provided) => (
          <OptionContainer ref={provided.innerRef} {...provided.droppableProps}>
            <Stack direction="row" spacing={2}>
              {options.map((option, index) => (
                <DraggableAnswer
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Stack>
          </OptionContainer>
        )}
      </Droppable>
    );
  }
}

class FillBlankQuestion extends React.Component {
  dropAnswerArea = "dropAnswerArea";
  dropOptionArea = "dropOptionArea";

  constructor(props) {
    super(props);
    this.state = {
      answerArea: [],
      optionArea: Object.keys(props.options),
    };
  }

  getTargetSentenceComp = () => {
    const { question, options } = this.props;
    const { answerArea, response } = this.state;
    // Divide question in list of words.
    var comps = [];
    const answer = answerArea.length > 0 ? options[answerArea[0]] : undefined;
    question.split("{}").forEach((text) => {
      comps.push(
        <Typography variant="h6" key={text}>
          {text}
        </Typography>
      );
      comps.push(
        <QuestionDroppable
          key={this.dropAnswerArea}
          id={this.dropAnswerArea}
          answer={answer}
          color={response ? "success" : "error"}
        />
      );
    });
    comps.pop();

    return comps;
  };

  onDragEnd = (result) => {
    const { responded } = this.state;
    if (responded) {
      return;
    }
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const { optionArea, answerArea } = this.state;
    var newAnswerArea = Array.from(answerArea);
    var newOptionArea = Array.from(optionArea);
    var res = false;
    if (destination.droppableId === this.dropAnswerArea) {
      res = true;
      newAnswerArea = [draggableId];
      newOptionArea.splice(source.index, 1);
      if (answerArea.length > 0) {
        newOptionArea.splice(source.index, 0, answerArea[0]);
      }
    } else if (destination.droppableId === this.dropOptionArea) {
      if (source.droppableId === this.dropAnswerArea) {
        newAnswerArea = [];
      } else {
        newOptionArea.splice(source.index, 1);
      }
      newOptionArea.splice(destination.index, 0, draggableId);
    } else {
      console.warn("Drop option area unknown:", this.dropOptionArea);
    }

    this.setState({
      optionArea: newOptionArea,
      answerArea: newAnswerArea,
      responded: res,
      response: this.props.options[draggableId].correct,
    });
  };

  render() {
    const { image, options, handleNext, id } = this.props;
    const { optionArea, responded, response } = this.state;
    const optInArea = optionArea.map((optIdx) => options[optIdx]);

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Stack spacing={2} alignItems="center" padding={5}>
            <Typography key="title" variant="h4" gutterBottom>
              Fill in the blank.
            </Typography>
            <img
              key="image"
              src={process.env.PUBLIC_URL + `${image}.png`}
              alt=""
              height={120}
            />
            <Stack direction="row" alignItems="center">
              {this.getTargetSentenceComp()}
            </Stack>
            <OptionsDroppable
              sx={{ border: "1px solid lightgrey" }}
              id={this.dropOptionArea}
              options={optInArea}
            />
          </Stack>
        </DragDropContext>
        {responded ? (
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
            onClick={() => handleNext({ id: id, response: response })}
          >
            Continue
            <KeyboardArrowRightRounded />
          </Fab>
        ) : (
          <></>
        )}
      </React.Fragment>
    );
  }
}

export default FillBlankQuestion;
