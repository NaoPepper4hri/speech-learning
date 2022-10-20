import React from "react";
import { Divider, Fab, Stack, Typography } from "@mui/material";
import { Check, KeyboardArrowRightRounded } from "@mui/icons-material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { logAction } from "../utils";

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

/**
 * A card that can be dragged around the screen.
 *
 * @extends {React.Component}
 */
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
            <Typography variant="h5">{text}</Typography>
          </Card>
        )}
      </Draggable>
    );
  }
}

/**
 * Drop area for DraggableWord components.
 *
 * @extends {React.Component}
 */
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

/**
 * A page where a sentence is provided in a language and multiple words, the words need to be
 * sorted to form the translated sentence.
 *
 * @extends {React.Component}
 */
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

  checkAnswer = () => {
    const { answerList, optionList } = this.state;
    logAction("participant", { id: "answer", qId: this.props.id });
    this.setState({
      responded: true,
      response: this.isAnswerCorrect(answerList, optionList),
    });
  };

  isAnswerCorrect = (answerList, optionList) => {
    const { options } = this.props;
    // All elements in the optionList are -1.
    var correct = !optionList.some((o) => options[o].tIdx >= 0);
    if (correct) {
      // Check order of answer
      answerList.forEach((o, idx) => {
        correct = correct && options[o].tIdx === idx;
      });
    }
    return correct;
  };

  onDragEnd = (result) => {
    if (this.state.responded) {
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

  componentDidMount() {
    logAction("auto_ui", { id: "question_presented", qId: this.props.id });
  }

  render() {
    const {
      header,
      question,
      options,
      handleNext,
      id,
      answer: correctAnswer,
    } = this.props;
    const { answerList, optionList, responded, response } = this.state;
    const answer = answerList.map((a) => options[a]);
    const opts = optionList.map((o) => options[o]);

    return (
      <React.Fragment>
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
            <Typography key="question" variant="h4" gutterBottom>
              {question}
            </Typography>
            <Divider />
            <OptionsDroppable
              key="answer"
              options={answer}
              id={this.dropAnswerArea}
              spacing={1}
              color={!responded ? "" : response ? "success" : "error"}
            />
            {responded && !response ? (
              <Typography key="correct_answer" variant="h5">
                {`The answer is: "${correctAnswer}"`}
              </Typography>
            ) : (
              <></>
            )}
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
            onClick={() => {
              logAction("participant", { id: "nextButton", qId: id });
              handleNext({ id: id, response: response });
            }}
          >
            Continue
            <KeyboardArrowRightRounded />
          </Fab>
        ) : (
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
            onClick={this.checkAnswer}
          >
            Check
            <Check />
          </Fab>
        )}
      </React.Fragment>
    );
  }
}

export default SortWordsQuestion;
