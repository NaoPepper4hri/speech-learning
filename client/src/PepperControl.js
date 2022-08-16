import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  TextField,
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

const actions = [
  "Ok, let's try one more task and see if we can improve!",
  "Well, you know what they say, practice makes perfect.",
  "I'm glad to hear that, lets keep going.",
  "I'm glad to hear that, lets keep going.",
  "You got most of those correct, great job.",
  "Lets see if we can do even better and faster in the next block.",
  "Sorry I didn't get that, can you repeat what you just said.",
  "Ok, I got that.",
  "It was really fun learning Spanish with you.",
  "This was really fun. Thanks for learning Spanish with me.",
  "Thanks for doing the extra bonus round with me. I hope you had a good time, it was fun learning Spanish with you.",
];

class PepperControl extends React.Component {
  state = {
    dialogOpen: false,
    participantId: "",
  };

  render() {
    const { id } = this.state;
    return (
      <Grid container padding={5} spacing={3}>
        {actions.map((a) => (
          <Grid item xs={3} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => {
                requestPepperText(a);
              }}
            >
              {a}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => requestPepperLookAtParticipant()}
          >
            Look at participant
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => requestPepperLookAtScreen()}
          >
            Look at screen
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={() => setConversationDone()}>
            Interaction Done
          </Button>
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
            <Button
              variant="outlined"
              onClick={() => {
                initialize({ id: id, date: new Date().toLocaleString() });
              }}
            >
              Initialize
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => saveData()}>
              Save data
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => this.setState({ dialogOpen: true })}
          >
            Restart experiment
          </Button>
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
      </Grid>
    );
  }
}

export default PepperControl;
