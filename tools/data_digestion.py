#!/usr/bin/python
""" Preprocessing script for raw experiment data.

Generates a csv file with accuracy and time data for each block of questions, as well as
experimenter statistics.
"""

import argparse
import csv
import json
import math
import os
from typing import Dict, List, Optional, Tuple

import numpy as np
from sklearn.linear_model import LinearRegression


class Line:
    """Representation of a line."""

    def __init__(self, intercept: float, slope: float, score: Optional[float] = 1.0):
        """Initialize class."""
        self.intercept = intercept
        self.slope = slope
        self.score = score

    @classmethod
    def from_data(cls, data: List[float]):
        """Build line from a list of data values."""
        y = np.array(data)
        x = np.array(range(len(data))).reshape((-1, 1))
        model = LinearRegression()
        model.fit(x, y)
        score = model.score(x, y)
        return cls(intercept=model.intercept_, slope=model.coef_[0], score=float(score))


def mean(values: List) -> Tuple[float, float]:
    """Return the mean and standard deviation for the given array of values."""
    mean = sum(values) / len(values)
    variance = sum([(x - mean) ** 2 for x in values]) / len(values)
    return mean, math.sqrt(variance)


def linear_regression(values: List) -> Line:
    """Adjust a line to the given values and return the line parameters."""
    return Line.from_data(values)


class QuestionBlock:
    """Compilation of response data from question block."""

    def __init__(self, name: str, ids: List[str], time: List[float], answers: List[float]) -> None:
        """Initialize class."""
        self._name = name
        self._ids = ids
        self._time = time
        self._answers = answers

    @classmethod
    def from_data(cls, data, id):
        """Build question block from json results."""
        ids = [x["id"] for x in data if x["id"].startswith(id)]
        time = [x["time"] for x in data if x["id"].startswith(id)]
        answers = [x["response"] for x in data if x["id"].startswith(id)]
        name = id.replace(" ", "_")
        return cls(name=name, ids=ids, time=time, answers=answers)

    def _process_data(self, data, label) -> Dict:
        t_m, t_std = mean(data)
        t_l = linear_regression(data)
        return {
            "{}_{}_mean".format(self._name, label): t_m,
            "{}_{}_std_dev".format(self._name, label): t_std,
            "{}_{}_lr_b0".format(self._name, label): t_l.intercept,
            "{}_{}_lr_b1".format(self._name, label): t_l.slope,
            "{}_{}_lr_score".format(self._name, label): t_l.score,
        }

    def to_json(self) -> Dict:
        """Produce a JSON object with processed data for CSV representation."""
        time = self._process_data(self._time, "time")
        answers = self._process_data(self._answers, "answers")
        time.update(answers)
        return time

    def to_json_raw(self) -> Dict:
        data: Dict[str, float] = {}
        for i, (t, a) in enumerate(zip(self._time, self._answers)):
            data["time_{}_q{}".format(self._name, i)] = t
            data["answer_{}_q{}".format(self._name, i)] = float(a)
        return data


class MatchBlock:
    """Compilation of response data from match pair optional block."""

    def __init__(self, time: List[float], answers: List[List[Dict]]) -> None:
        self._name = "pairs_block"
        self._time = time
        self._answers = answers

    @classmethod
    def from_data(cls, data):
        time = [x["time"] for x in data if x["id"].startswith("pairs")]
        answers = [x["response"] for x in data if x["id"].startswith("pairs")]
        return cls(time=time, answers=answers)

    def _process_data(self, data, label) -> Dict:
        t_m, t_std = mean(data)
        return {
            "{}_{}_mean".format(self._name, label): t_m,
            "{}_{}_std_dev".format(self._name, label): t_std,
        }

    def to_json(self) -> Dict:
        data = self._process_data(self._time, "time")
        nf = [len([x for x in a if not x["correct"]]) for a in self._answers]
        failures = self._process_data(nf, "failures")
        data.update(failures)
        data["number_of_trials"] = len(self._time)
        return data


class InteractionBlock:
    """Interaction page data."""

    def __init__(self, ty: str, name: str, init_time: float) -> None:
        self._name = name
        self._type = ty
        self._init_time = init_time


class PepperAction:
    """Time tracker for pepper reaction times."""

    def __init__(self, user: str, ty: str, info: Dict, time: float, uuid: str) -> None:
        self._trigger = user
        self._info = info
        self._init_time = time
        self._uid = uuid
        self.ty = ty
        self._closed = False

    def try_close(self, entry: Dict) -> None:
        if not self._closed and self._uid == entry.get("uuid"):
            self._end_time = entry["timestamp"]
            self._closed = True

    def get_time(self) -> float:
        return self._end_time - self._init_time

    @classmethod
    def from_log(cls, entry: Dict):
        return cls(
            user=entry.pop("user"),
            ty=entry.pop("type"),
            time=entry.pop("timestamp"),
            uuid=entry.pop("uuid"),
            info=entry,
        )


def process_logs(logs: List) -> List:
    actions = []
    for lo in logs:
        if lo["user"] == "pepper":
            for a in actions:
                a.try_close(lo)
        elif "uuid" in lo:
            actions.append(PepperAction.from_log(lo))
    return actions


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("data_file", type=str, help="Source data file (.json)")
    parser.add_argument("output", type=str, help="Destination js file (.csv)")

    args = parser.parse_args()

    with open(args.data_file, "r", encoding="utf-8") as f:
        data_raw = json.load(f)
        # 0. Extract data
        p_id = data_raw["id"]
        date = data_raw["date"]
        block1 = QuestionBlock.from_data(data_raw["responses"], "Block 1")
        block2 = QuestionBlock.from_data(data_raw["responses"], "Block 2")
        block3 = QuestionBlock.from_data(data_raw["responses"], "Block 3")
        block4 = QuestionBlock.from_data(data_raw["responses"], "Block 4")

        # 1. Mean, std deviation and line regression representation for each mandatory block (time
        # and accuracy)
        block_results = {}
        block_results.update(block1.to_json())
        block_results.update(block1.to_json_raw())
        block_results.update(block2.to_json())
        block_results.update(block2.to_json_raw())
        block_results.update(block3.to_json())
        block_results.update(block3.to_json_raw())
        block_results.update(block4.to_json())
        block_results.update(block4.to_json_raw())

        # 2. Same, with number of trials and time for optional block
        optional_block = MatchBlock.from_data(data_raw["responses"])
        block_results.update(optional_block.to_json())

        # 3. Pepper response time (mean and std dev for look at participant and screen).
        log_data = process_logs(data_raw["other"]["log"])
        lookat_participant = [x.get_time() for x in log_data if x.ty == "LookAtParticipant"]
        lookat_screen = [x.get_time() for x in log_data if x.ty == "LookAtScreen"]
        m, std_d = mean(lookat_participant)
        block_results["LookAtParticipant_time_mean"] = m
        block_results["LookAtParticipant_time_std_dev"] = std_d
        m, std_d = mean(lookat_participant)
        block_results["LookAtScreen_time_mean"] = m
        block_results["LookAtScreen_time_std_dev"] = std_d

        # 3. Responses from experimenter ? Comments, ratings, per block.
        if not os.path.isfile(args.output):
            with open(args.output, "w") as f:
                csv_fieldnames = list(block_results.keys())
                csv_fieldnames.sort()
                writer = csv.DictWriter(f, csv_fieldnames)
                writer.writeheader()
                writer.writerow(block_results)
        else:
            with open(args.output, "a") as f:
                csv_fieldnames = list(block_results.keys())
                csv_fieldnames.sort()
                writer = csv.DictWriter(f, csv_fieldnames)
                writer.writerow(block_results)
