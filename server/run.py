"""
    Web server for the speech learning task app.
"""

import json
import os
from flask import Flask, request
from threading import Thread
from typing import Optional

from pepper_server import serve_grpc, COMMAND_BRIDGE
from slack_bot import publish_hostname

app = Flask(__name__, static_url_path='')


class ParticipantData:
    DATA_FILE = '/data/speech_learning_data_p{}.json'

    def __init__(self, id: int, date: Optional[str] = ""):
        self._id = id
        self._responses = []
        self._date = date

    def add_response(self, res: dict) -> None:
        self._responses.append(res)

    def add_repeated_suffix(self, p: str, idx: Optional[int] = 1) -> str:
        df = p.format(idx)
        if os.path.exists(df):
            return self.add_repeated_suffix(p, idx+1)
        else:
            return df

    def save_data(self):
        df = self.DATA_FILE.format(self._id)
        if os.path.exists(df):
            df = self.add_repeated_suffix(self.DATA_FILE.format(str(self._id) + "_{}"))

        json_obj = {
            "id": self._id,
            "date": self._date,
            "responses": self._responses,
        }

        with open(df, 'w', encoding='utf-8') as f:
            json.dump(json_obj, f, ensure_ascii=False, indent=4)


participant = ParticipantData(0)
conversation_done = True


@app.route('/')
def home():
    return app.send_static_file('index.html')


@app.route('/pubCommand', methods=['POST'])
def pub_command():
    req = request.get_json()
    print(req)
    COMMAND_BRIDGE.send_command(req)
    return "Ok"


@app.route('/setConversationDone', methods=['POST'])
def set_conversation_done():
    req = request.get_json()
    global conversation_done
    conversation_done = req.get("done", False)
    return "Ok"


@app.route('/isConversationDone', methods=['GET'])
def is_conversation_done():
    global conversation_done
    return {"done": conversation_done}


@app.route('/isPepperDone', methods=['GET'])
def is_pepper_done():
    return {"done": COMMAND_BRIDGE.is_pepper_done()}


@app.route("/pubAnswer", methods=['POST'])
def pub_answer():
    req = request.get_json()
    global participant
    participant.add_response(req)
    return "Ok"


@app.route("/init", methods=['POST'])
def initialize():
    req = request.get_json()
    global participant
    participant = ParticipantData(req['id'], req['date'])
    COMMAND_BRIDGE.clear_queue()
    return "Ok"


@app.route("/save", methods=['POST'])
def save_data():
    global participant
    participant.save_data()


@app.route('/control', defaults={'path': ''})
def index(path):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    publish_hostname()
    grpc = Thread(target=serve_grpc)
    grpc.start()
    app.run(host='0.0.0.0', port='5002')
