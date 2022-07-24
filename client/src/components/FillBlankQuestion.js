import React from "react";
import styled from "styled-components";
import { Stack, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Card = styled.div`
  border: 1px solid lightgrey;
  border-radius: 6px;
  padding: 4px;
  background-color: ${(props) =>
    props.color === "success" ? "#66bb6a" : "white"};
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
  border: 1px solid lightgrey;
  border-radius: 6px;
  margin-bottom: 10px;
  margin-left: 8px;
  margin-right: 8px;
  background-color: white;
  min-height: 25px;
  min-width: 40px;
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
            <Typography>{text}</Typography>
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
      <Droppable droppableId={id} direction="horizontal">
        {(provided) => (
          <AnswerContainer ref={provided.innerRef} {...provided.droppableProps}>
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
    const { answerArea, done } = this.state;
    // Divide question in list of words.
    var comps = [];
    const answer = answerArea.length > 0 ? options[answerArea[0]] : undefined;
    question.split("{}").forEach((text) => {
      comps.push(<Typography key={text}>{text}</Typography>);
      comps.push(
        <QuestionDroppable
          key={this.dropAnswerArea}
          id={this.dropAnswerArea}
          answer={answer}
          color={done ? "success" : ""}
        />
      );
    });
    comps.pop();

    return comps;
  };

  onDragEnd = (result) => {
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

    if (destination.droppableId === this.dropAnswerArea) {
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
      done: this.props.options[draggableId].correct,
    });
  };

  render() {
    const { image, options } = this.props;
    const { optionArea } = this.state;
    const optInArea = optionArea.map((optIdx) => options[optIdx]);

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Stack spacing={2} alignItems="center" padding={5}>
          <Typography key="title" variant="h4" gutterBottom>
            Fill in the blank.
          </Typography>
          <img key="image" src={image} alt="" />
          <Stack direction="row">{this.getTargetSentenceComp()}</Stack>
          <OptionsDroppable
            sx={{ border: "1px solid lightgrey" }}
            id={this.dropOptionArea}
            options={optInArea}
          />
        </Stack>
      </DragDropContext>
    );
  }
}

export default FillBlankQuestion;
