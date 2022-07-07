import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import "./App.css";

function App() {
  return (
    <div className="App">
      <p>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
        <Button
          onClick={() => {
            fetch("/pubCommand", {
              method: "POST",
              body: JSON.stringify({ movement: "test command", halt: true }),
              headers: new Headers({
                "content-type": "application/json",
              }),
            })
              .then((res) => {
                console.log(res);
              })
              .catch((e) => {
                console.error(e);
              });
          }}
        >
          here
        </Button>
      </p>
    </div>
  );
}

export default App;
