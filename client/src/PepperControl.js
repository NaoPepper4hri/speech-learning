import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  initialize,
  sendComment,
  setConversationDone,
  requestPepperText,
  requestPepperLookAtParticipant,
  requestPepperLookAtScreen,
  saveData,
  restartExperiment,
  logAction,
} from "./utils";

const scheduled_actions = [
  // { text: "Ok, let's try one more task and see if we can improve!" },
  {
    text: "Well, you know what they say, practice makes perfect.",
    label: "1.",
    showComment: true,
  },
  {
    text: "You’re really making good progress, keep it up.",
    label: "2.",
    showComment: true,
  },

  {
    text: "Let's see if we can do even better in the next block.",
    label: "3.",
    showComment: true,
  },

  {
    text: "OK, let's try one more block and see if we can improve.",
    label: "4.- continue",
    showComment: true,
  },
  {
    text: "How confident are you about learning Spanish now?",
    label: "4.- end",
    showComment: false,
  },

  {
    text: "You got most of those correct, great job.",
    label: "5.",
    showComment: true,
  },
];

const other_actions = [
  "I didn't hear a response, do you need me to repeat the question?",
  "Sorry I didn't get that, can you repeat what you just said?",
  "Ok, I got that.",
  "This was really fun. Thanks for learning Spanish with me.",
  "Thanks for doing the extra bonus round with me, I hope you had a good time. It was fun " +
    "learning Spanish with you.",
];

class CardButton extends React.Component {
  render() {
    const { children, onClick, background } = this.props;
    return (
      <Card sx={{ border: "1px solid black", background: background }}>
        <CardActionArea onClick={onClick}>
          <CardContent>{children}</CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

class InsertTextField extends React.Component {
  render() {
    const { onSubmit, hint, value, onChange, background } = this.props;
    console.log("bg", background);
    return (
      <React.Fragment>
        <Grid item xs={1} justifyContent="center">
          <CardButton onClick={onSubmit} background={background}>
            <Typography>{hint}</Typography>
          </CardButton>
        </Grid>
        <Grid item xs={11}>
          <TextField
            label="Insert text (send with `ctrl + Enter`)"
            variant="outlined"
            fullWidth
            multiline
            value={value}
            sx={{ background: `${background}88` }}
            onKeyPress={(ev) => {
              if (ev.ctrlKey && ev.key === "Enter") {
                onSubmit();
              }
            }}
            onChange={onChange}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

class WofOzReaction extends React.Component {
  state = {
    comment: "",
    rating: "",
  };

  render() {
    const { comment, rating } = this.state;
    const { response, idx: key } = this.props;
    var { ncols } = this.props;
    ncols = ncols ? ncols : 12;
    console.log("key", key);

    return (
      <Grid
        key={`r${key}c${response.label}`}
        container
        item
        spacing={1}
        xs={ncols}
      >
        <Grid item xs={6} justifyContent="center">
          <CardButton
            onClick={() => {
              logAction("experimenter", {
                id: "sayWofOzText",
                text: response.text,
                label: response.label,
              });
              requestPepperText(response.text);
            }}
            background="#ffffcc"
          >
            <Stack direction="row" spacing={3}>
              <Typography key="idx">
                <strong>{response.label}</strong>
              </Typography>
              <Divider key="divider" orientation="vertical" flexItem />
              <Typography key="text">{response.text}</Typography>
            </Stack>
          </CardButton>
        </Grid>
        <Grid item xs={4}>
          {response.showComment ? (
            <TextField
              label="Insert text (send with `ctrl + Enter`)"
              variant="outlined"
              fullWidth
              multiline
              sx={{ background: "#ccffcc88" }}
              value={comment}
              onKeyPress={(ev) => {
                if (ev.ctrlKey && ev.key === "Enter") {
                  logAction("experimenter", {
                    id: "sendCommentWoz",
                    text: comment,
                    label: response.label,
                  });
                  sendComment("note", comment);
                  this.setState({ comment: "" });
                }
              }}
              onChange={(event) =>
                this.setState({ comment: event.target.value })
              }
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={2}>
          {response.showComment ? (
            <TextField
              label="Insert rating (1-3): (send with `ctrl + Enter`)"
              variant="outlined"
              fullWidth
              multiline
              sx={{ background: "#ccecff88" }}
              value={rating}
              onKeyPress={(ev) => {
                if (ev.ctrlKey && ev.key === "Enter") {
                  logAction("experimenter", {
                    id: "sendRating",
                    text: rating,
                    label: response.label,
                  });
                  sendComment("rating", rating);
                  this.setState({ rating: "" });
                }
              }}
              onChange={(event) =>
                this.setState({ rating: event.target.value })
              }
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    );
  }
}

class PepperControl extends React.Component {
  state = {
    dialogOpen: false,
    participantId: "",
    dyntext: "",
    notes: "",
    id: "",
  };

  pepperSayText = () => {
    const { dyntext } = this.state;
    if (dyntext.length !== 0) {
      requestPepperText(dyntext);
      this.setState({ dyntext: "" });
    }
  };

  render() {
    const { id, dyntext, notes } = this.state;
    return (
      <React.Fragment>
        <Grid container padding={5} spacing={1.5} textAlign="center">
          <Grid item xs={12} textAlign="left">
            <Divider />
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              Experiment Functions
            </Typography>
          </Grid>
          <Grid
            container
            item
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            textAlign="center"
          >
            <Grid item>
              <TextField
                label="Participant ID"
                variant="outlined"
                value={id}
                onChange={(event) => this.setState({ id: event.target.value })}
                sx={{ background: "#ffcccc88" }}
              />
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  logAction("experimenter", { id: "initialize" });
                  initialize({ id: id, date: new Date().toLocaleString() });
                }}
                background={"#ffcccc"}
              >
                <Typography>Initialize</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  logAction("experimenter", { id: "setConversationDone" });
                  setConversationDone();
                }}
                background={"#ffcccc"}
              >
                <Typography>Conversation Done</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  logAction("experimenter", { id: "saveData" });
                  saveData();
                }}
                background={"#ffcccc"}
              >
                <Typography>Save data</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  this.setState({ dialogOpen: true });
                }}
                background={"#ffcccc"}
              >
                <Typography>Restart experiment</Typography>
              </CardButton>
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign="left">
            <Divider />
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              Non-verbal Responses
            </Typography>
          </Grid>
          <Grid item container direction="row" spacing={1}>
            <Grid item>
              <CardButton
                onClick={() => {
                  logAction("experimenter", {
                    id: "requestPepperLookAtParticipant",
                  });
                  requestPepperLookAtParticipant();
                }}
                background={"#ffd3a7"}
              >
                <Typography>Look at participant</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  logAction("experimenter", {
                    id: "requestPepperLookAtScreen",
                  });
                  requestPepperLookAtScreen();
                }}
                background={"#ffd3a7"}
              >
                <Typography>Look at screen</Typography>
              </CardButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Grid container spacing={2} textAlign="left">
              <Grid item xs={6}>
                <Typography
                  sx={{ mt: 0.5, ml: 2 }}
                  color="text.secondary"
                  display="block"
                  variant="caption"
                >
                  Block-specific Verbal Responses
                </Typography>{" "}
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{ mt: 0.5, ml: 2 }}
                  color="text.secondary"
                  display="block"
                  variant="caption"
                >
                  Block-specific Notes
                </Typography>{" "}
              </Grid>
              <Grid item xs={2}>
                <Typography
                  sx={{ mt: 0.5, ml: 2 }}
                  color="text.secondary"
                  display="block"
                  variant="caption"
                >
                  Experimenter Rating
                </Typography>{" "}
              </Grid>
            </Grid>
          </Grid>
          {scheduled_actions.map((a, idx) => (
            <WofOzReaction response={a} idx={idx} />
          ))}
          <Grid item xs={12} textAlign="left">
            <Divider />
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              Aditional Verbal Responses
            </Typography>
          </Grid>
          {other_actions.map((a, idx) => (
            <Grid key={idx} item xs={4} justifyContent="center">
              <CardButton
                onClick={() => {
                  logAction("experimenter", { id: "sayOtherText", text: a });
                  requestPepperText(a);
                }}
                background="#ccccff"
              >
                <Typography>{a}</Typography>
              </CardButton>
            </Grid>
          ))}
          <Grid item xs={12} textAlign="left">
            <Divider />
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              General Text to Speech Command
            </Typography>
          </Grid>
          <InsertTextField
            value={dyntext}
            hint="Say text"
            onSubmit={() => {
              logAction("experimenter", {
                id: "sayDynamicText",
                text: dyntext,
              });
              requestPepperText(dyntext);
              this.setState({ dyntext: "" });
            }}
            onChange={(event) => this.setState({ dyntext: event.target.value })}
          />
          <Grid item xs={12} textAlign="left">
            <Divider />
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              General Experiment Notes
            </Typography>
          </Grid>
          <InsertTextField
            value={notes}
            hint="Send notes"
            background="#ccffcc"
            onSubmit={() => {
              logAction("experimenter", {
                id: "logGeneralComment",
                text: notes,
              });
              sendComment("comment", notes);
              this.setState({ notes: "" });
            }}
            onChange={(event) => this.setState({ notes: event.target.value })}
          />
        </Grid>
        <Dialog
          open={this.state.dialogOpen}
          onclose={() => this.setState({ dialogOpen: false })}
        >
          <DialogContent>
            <DialogContentText>
              Restart experiment? All unsaved data will be lost.
            </DialogContentText>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  logAction("experimenter", { id: "restartExperiment" });
                  restartExperiment();
                  this.setState({ dialogOpen: false });
                }}
              >
                Restart
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default PepperControl;
