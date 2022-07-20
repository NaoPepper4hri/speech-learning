import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

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

class DraggableWord extends React.Component {
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

class OptionsDroppable extends React.Component {
  render() {
    const { id, options, justifyContent, spacing, color } = this.props;
    return (
      <Droppable droppableId={id} direction="horizontal">
        {(provided) => (
          <OptionContainer ref={provided.innerRef} {...provided.droppableProps}>
            <Stack
              direction="row"
              spacing={spacing}
              justifyContent={justifyContent}
            >
              {options.map((option, index) => (
                <DraggableWord
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  index={index}
                  color={color}
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

class SortWordsQuestion extends React.Component {
  dropAnswerArea = "daa";
  dropOptionArea = "doa";
  constructor(props) {
    super(props);
    this.state = {
      answerList: [],
      optionList: Object.keys(props.options),
    };
  }

  answerCorrect = () => {
    console.log(true);
  };

  answerIncorrect = () => {
    console.log(false);
  };

  isAnswerCorrect = (answerList, optionList) => {
    const { options } = this.props;
    // All elements in the optionList are -1.
    var correct = !optionList.some((o) => options[o].tIdx >= 0);
    console.log(correct);
    if (correct) {
      // Check order of answer
      answerList.forEach((o, idx) => {
        correct = correct && options[o].tIdx === idx;
        console.log(correct);
        console.log(options[o]);
      });
    }
    return correct;
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

    const { answerList, optionList } = this.state;
    const newAnswerList = Array.from(answerList);
    const newOptionList = Array.from(optionList);

    if (source.droppableId === this.dropAnswerArea) {
      newAnswerList.splice(source.index, 1);
    } else if (source.droppableId === this.dropOptionArea) {
      newOptionList.splice(source.index, 1);
    }

    if (destination.droppableId === this.dropAnswerArea) {
      newAnswerList.splice(destination.index, 0, draggableId);
    } else if (destination.droppableId === this.dropOptionArea) {
      newOptionList.splice(destination.index, 0, draggableId);
    }

    this.setState({
      answerList: newAnswerList,
      optionList: newOptionList,
      done: this.isAnswerCorrect(newAnswerList, newOptionList),
    });
  };

  render() {
    const { header, question, options } = this.props;
    const { answerList, optionList, done } = this.state;
    const answer = answerList.map((a) => options[a]);
    const opts = optionList.map((o) => options[o]);

    return (
      <DragDropContext key="dnd" onDragEnd={this.onDragEnd}>
        <Stack
          sx={{ width: 600 }}
          spacing={4}
          padding={5}
          justifyContent="stretch"
        >
          <Typography key="title" variant="h4" gutterBottom>
            {header}
          </Typography>
          <Typography key="question" variant="h5" gutterBottom>
            {question}
          </Typography>
          <Divider />
          <OptionsDroppable
            key="answer"
            options={answer}
            id={this.dropAnswerArea}
            spacing={1}
            color={done ? "success" : ""}
          />
          <Divider />
          <OptionsDroppable
            key="options"
            options={opts}
            id={this.dropOptionArea}
            justifyContent={"center"}
            spacing={2}
          />
        </Stack>
      </DragDropContext>
    );
  }
}

export default SortWordsQuestion;
