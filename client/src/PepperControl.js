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
  setConversationDone,
  requestPepperText,
  requestPepperLookAtParticipant,
  requestPepperLookAtScreen,
  saveData,
  restartExperiment,
} from "./utils";

const scheduled_actions = [
  [{ text: "Ok, let's try one more task and see if we can improve!" }],
  [{ text: "Well, you know what they say, practice makes perfect." }],
  [{ text: "You’re really making good progress, hang in there." }],
  [
    {
      text: "Let's see if we can do even better and faster in the next block.",
    },
  ],
  [
    { text: "You got most of those correct, great job.", label: "continue" },
    { text: "How confident are you about learning Spanish now?", label: "end" },
  ],
  [{ text: "You got most of those correct, great job." }],
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
    const { children, onClick } = this.props;
    return (
      <Card sx={{ border: "1px solid black" }}>
        <CardActionArea onClick={onClick}>
          <CardContent>{children}</CardContent>
        </CardActionArea>
      </Card>
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

  wOzStageReaction = (r, key, ncols = 12) => {
    const cols = ncols / r.length;
    console.log(ncols, r, r.length, cols);
    return r.map((t, idx) => (
      <Grid key={`r${key}c${idx}`} item xs={cols} justifyContent="center">
        <CardButton>
          <Stack direction="row" spacing={3}>
            <Typography key="idx">
              <strong>{`${key}${t.label ? `.- ${t.label}:` : "."}`}</strong>
            </Typography>
            <Divider key="divider" orientation="vertical" flexItem />
            <Typography key="text">{t.text}</Typography>
          </Stack>
        </CardButton>
      </Grid>
    ));
  };

  insertText = (value, hint, onSubmit) => {
    return (
      <React.Fragment>
        <Grid item xs={1} justifyContent="center">
          <CardButton onClick={onSubmit}>
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
            onKeyPress={(ev) => {
              if (ev.shiftKey && ev.key === "Enter") {
                onSubmit();
              }
            }}
            onChange={(event) => this.setState({ dyntext: event.target.value })}
          />
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    const { id, dyntext, notes } = this.state;
    return (
      <React.Fragment>
        <Grid container padding={5} spacing={3} alignItems="center">
          {this.insertText(dyntext, "Say text!", () => {
            requestPepperText(dyntext);
          })}
          {scheduled_actions.map((a, idx) => this.wOzStageReaction(a, idx))}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {other_actions.map((a, idx) => (
            <Grid key={idx} item xs={4} justifyContent="center">
              <CardButton
                onClick={() => {
                  requestPepperText(a);
                }}
              >
                <Typography>{a}</Typography>
              </CardButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item container direction="row" spacing={1}>
            <Grid item>
              <CardButton onClick={() => setConversationDone()}>
                <Typography>Conversation Done</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton onClick={() => requestPepperLookAtParticipant()}>
                <Typography>Look at participant</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton onClick={() => requestPepperLookAtScreen()}>
                <Typography>Look at screen</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton onClick={() => saveData()}>
                <Typography>Save data</Typography>
              </CardButton>
            </Grid>
            <Grid item>
              <CardButton onClick={() => this.setState({ dialogOpen: true })}>
                <Typography>Restart experiment</Typography>
              </CardButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid
            container
            item
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item>
              <TextField
                label="Participant ID"
                variant="outlined"
                value={id}
                onChange={(event) => this.setState({ id: event.target.value })}
              />
            </Grid>
            <Grid item>
              <CardButton
                onClick={() => {
                  initialize({ id: id, date: new Date().toLocaleString() });
                }}
              >
                <Typography>Initialize</Typography>
              </CardButton>
            </Grid>
          </Grid>
          {this.insertText(notes, "Send notes!", () => {
            // TODO: backend method for note taking
          })}
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
