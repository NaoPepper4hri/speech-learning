"""Web server for the speech learning task app."""

import copy
import json
import logging
import os
import uuid
from datetime import datetime
from threading import Thread
from typing import Any, Dict, List, Optional

from flask import Flask, request
from pepper_server import COMMAND_BRIDGE, serve_grpc
from slack_bot import publish_hostname

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)

app = Flask(__name__, static_url_path="")


class ParticipantData:
    """
    Data for each participant.

    It includes all responses, as well as the participant id.
    """

    DATA_FILE = "/data/speech_learning_data_p{}.json"

    def __init__(self, id: int, date: Optional[str] = ""):
        """Initialize ParticipantData."""
        self._id = id
        self._responses: List[dict] = []
        self._date = date

    def add_response(self, res: dict) -> None:
        """Add new response to data collection."""
        self._responses.append(res)

    def add_repeated_suffix(self, p: str, idx: int = 1) -> str:
        """Add _{idx} to the given string."""
        df = p.format(idx)
        if os.path.exists(df):
            return self.add_repeated_suffix(p, idx + 1)
        return df

    def save_data(self, extra: Optional[Dict[str, Any]] = None):
        """Store the collected data."""
        df = self.DATA_FILE.format(self._id)
        if os.path.exists(df):
            df = self.add_repeated_suffix(self.DATA_FILE.format(str(self._id) + "_{}"))

        json_obj = {
            "id": self._id,
            "date": self._date,
            "responses": self._responses,
            "other": extra,
        }

        with open(df, "w", encoding="utf-8") as f:
            json.dump(json_obj, f, ensure_ascii=False, indent=4)


class ExperimentManager:
    """Control the current exercise and layout of the experiment."""

    def __init__(self):
        """Initialize ExperimentManager."""
        self.current_page = 0
        self.layout = []
        self.comments = []
        self.experiment_log = ExperimentLog()

    def reset(self):
        """Clean up experiment."""
        self.current_page = 0
        self.layout = []
        self.comments = []
        self.experiment_log.reset()

    def add_comment(self, ty: str, value: str):
        """Add new note to experiment."""
        self.comments.append(
            {
                "type": ty,
                "value": value,
                "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "experiment_page": self.current_page,
            }
        )

    def add_log(self, log):
        """Add new log event."""
        self.experiment_log.add_log(log)

    def get_log(self):
        """Return the experiment log."""
        return self.experiment_log._log_array


class ExperimentLog:
    """Collect information about the flow of the experiment."""

    def __init__(self):
        """Initialize experiment log."""
        self._log_array = []

    def add_log(self, log):
        """Add a new log event."""
        self._log_array.append(copy.deepcopy(log))

    def reset(self):
        """Clean up log."""
        self._log_array.clear()


manager = ExperimentManager()
participant = ParticipantData(0)
conversation_done = True


def _log_command_done(command):
    global manager
    command["user"] = "pepper"
    command["timestamp"] = datetime.now().timestamp() * 1000
    manager.add_log(command)


COMMAND_BRIDGE.set_clear_action(_log_command_done)


@app.route("/")
def home():
    """Send the webapp."""
    return app.send_static_file("index.html")


@app.route("/getExpState", methods=["GET"])
def get_exp_state():
    """Retrieve the state of the experiment."""
    global manager
    return {"current": manager.current_page, "layout": manager.layout}


@app.route("/setNewQuestionLayout", methods=["POST"])
def set_new_question_layout():
    """Set a new question layout."""
    global manager
    manager.layout = request.get_json() or []
    return "Ok"


@app.route("/setCurrentPage", methods=["POST"])
def set_current_page():
    """Change to a new page."""
    global manager
    req = request.get_json() or {}
    manager.current_page = req["current"]
    return "Ok"


@app.route("/pubCommand", methods=["POST"])
def pub_command():
    """Send command to Pepper."""
    req = request.get_json() or {}
    req["uuid"] = str(uuid.uuid1())
    print(req)
    global manager
    manager.add_log(req)
    COMMAND_BRIDGE.send_command(req)
    return "Ok"


@app.route("/setConversationDone", methods=["POST"])
def set_conversation_done():
    """Set conversation done flag."""
    req = request.get_json() or {}
    global conversation_done
    conversation_done = req.get("done", False)
    return "Ok"


@app.route("/isConversationDone", methods=["GET"])
def is_conversation_done():
    """Check if conversation finished flag has been set."""
    global conversation_done
    return {"done": conversation_done}


@app.route("/isPepperDone", methods=["GET"])
def is_pepper_done():
    """Check if Pepper has finished all commands."""
    return {"done": COMMAND_BRIDGE.is_pepper_done()}


@app.route("/pubAnswer", methods=["POST"])
def pub_answer():
    """Add a new answer from the participant."""
    req = request.get_json() or {}
    global participant
    participant.add_response(req)
    return "Ok"


@app.route("/pubComment", methods=["POST"])
def pub_comment():
    """Add a new comment from experimenter."""
    req = request.get_json() or {}
    global manager
    manager.add_comment(req.get("type", "note"), req.get("text", ""))
    return "Ok"


@app.route("/logAction", methods=["POST"])
def log_client():
    """Add an entry to the experiment log."""
    req = request.get_json() or {}
    global manager
    manager.add_log(req)
    return "Ok"


@app.route("/init", methods=["POST"])
def initialize():
    """Initialize the experiment."""
    req = request.get_json() or {}
    global participant
    participant = ParticipantData(req["id"], req["date"])
    COMMAND_BRIDGE.clear_queue()
    return "Ok"


@app.route("/save", methods=["GET"])
def save_data():
    """Store the experiment data."""
    global participant, manager
    try:
        participant.save_data({"comments": manager.comments, "log": manager.get_log()})
    except Exception as e:
        app.logger.error(e)
    return "Ok"


@app.route("/restartExperiment", methods=["GET"])
def restart_experiment():
    """Reset the experiment."""
    save_data()
    global manager
    manager.reset()
    return "Ok"


@app.route("/control", defaults={"path": ""})
def control(path):
    """Return the control page."""
    return app.send_static_file("index.html")


if __name__ == "__main__":
    try:
        publish_hostname()
    except Exception as e:
        app.logger.warn(e)
    grpc = Thread(target=serve_grpc)
    grpc.start()
    app.run(host="0.0.0.0", port=5002)
