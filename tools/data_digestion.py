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
        self.slope = slope[0]
        self.score = score

    @classmethod
    def from_data(cls, data: List[float]):
        """Build line from a list of data values."""
        y = np.array(data)
        x = np.array(range(len(data))).reshape((-1, 1))
        model = LinearRegression()
        model.fit(x, y)
        score = model.score(x, y)
        return cls(intercept=model.intercept_, slope=model.coef_, score=score)


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

    def _process_data(self, data, label) -> dict:
        t_m, t_std = mean(data)
        t_l = linear_regression(data)
        return {
            "{}_{}_mean".format(self._name, label): t_m,
            "{}_{}_std_dev".format(self._name, label): t_std,
            "{}_{}_lr_b0".format(self._name, label): t_l.intercept,
            "{}_{}_lr_b1".format(self._name, label): t_l.slope,
            "{}_{}_lr_score".format(self._name, label): t_l.score,
        }

    def to_json(self) -> dict:
        """Produce a JSON object with processed data for CSV representation."""
        time = self._process_data(self._time, "time")
        answers = self._process_data(self._answers, "answers")
        time.update(answers)
        return time

    def to_json_raw(self) -> dict:
        data: Dict[str, float] = {}
        for i, (t, a) in enumerate(zip(self._time, self._answers)):
            data["time_{}_q{}".format(self._name, i)] = t
            data["answer_{}_q{}".format(self._name, i)] = float(a)
        return data


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
        print(block_results)
        # 2. Same, with number of trials and time for optional block (leave blank if not performed)
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
