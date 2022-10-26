# Data description

When an experiment is saved, a JSON file containing all the data related to the current run is
stored in the specified data folder (`/data` by default).

This JSON file will have a shape like the following:

```
{
    "id": "Participant ID",
    "date": "10/20/2022, 11:06:19 AM",
    "responses": [
        {
            "time": 3435,
            "id": "Block 1_2",
            "response": true
        },
        ...
        {
            "time": 19013,
            "id": "pairs",
            "options": [
                "Girl", "bye", "good", "pardon", "suitcase", "he", "water", "need ", "niña",
                "Adiós", "necesitar", "maleta", "él", "agua", "buenos", "perdón"
            ],
            "response": [
                {
                    "correct": true,
                    "p1": "Girl",
                    "p2": "niña"
                },
                ...
            ]
        },
        ...
    ],
    "other": {
        "comments": [
            {
                "type": "note_b1",
                "value": "note 1",
                "date": "20/10/2022 11:08:23",
                "experiment_page": 12
            },
            ...
        ],
        "log": [
            {
                "user": "experimenter",
                "info": {
                    "id": "initialize"
                },
                "time": 1666256779103
            },
            ...
            {
                "goto": {
                    "x": 0,
                    "y": 0,
                    "theta": 1
                },
                "abilities": [
                    {
                        "ty": "BASIC_AWARENESS",
                        "enabled": true
                    }
                ],
                "timestamp": 1666256786316,
                "type": "LookAtParticipant",
                "user": "experimenter",
                "uuid": "7a0a9910-5056-11ed-b6a0-f09e4ab1c141"
            },
            ...
            {
                "user": "auto_ui",
                "info": {
                    "id": "interaction_page_presented",
                    "qId": "block1_0"
                },
                "time": 1666256800165
            },
            ...
            {
                "say": "This is our first block. Are you ready to learn Spanish with me today?",
                "timestamp": 1666256801183,
                "type": "TextToSpeech",
                "user": "automatic",
                "uuid": "82e6ee08-5056-11ed-bff8-f09e4ab1c141"
            },
            ...
        ],
        ...
    },
}
```

The main parts of this file are the `responses`, `comments`, and `log` objects, which represent the
participant responses, comments from the experimenter and an event log respectively.
The event log includes multiple types of objects, which might include different information,
however, this is only used to calculate the response time from Pepper command requests at the
moment.

This file contains all the logged information in the experiment, but the data can be difficult to
extract if you are using Excel or something similar.

To make it easier to manage, the [`data_digestion.oy`](../tools/data_digestion.py) script allows
executing a basic preprocessing of the data and exporting it into a CSV file.

The resulting CSV file has the following fields:

| Key                                     | Value                                                           |
| --------------------------------------- | --------------------------------------------------------------- |
| date                                    | Date of the experiment.                                         |
| participant                             | Participant ID.                                                 |
| \<block-name\>\_answers_lr_b0           | First parameter of linear regression (answer accuracy).         |
| \<block-name\>\_answers_lr_b1           | Second parameter of linear regression (answer accuracy).        |
| \<block-name\>\_answers_lr_score        | Accuracy score for the linear regression (answer accuracy).     |
| \<block-name\>\_answers_mean            | Mean result for response accuracy on this block.                |
| \<block-name\>\_answers_std_dev         | Standard deviation for response accuracy in this block.         |
| ...                                     | ...                                                             |
| \<block-name\>\_time_lr_b0              | First parameter of linear regression (elapsed time).            |
| \<block-name\>\_time_lr_b1              | Second parameter of linear regression (elapsed time)n.          |
| \<block-name\>\_time_lr_score           | Accuracy score for the linear regression. (elapsed time)        |
| \<block-name\>\_time_mean               | Mean time spent on each question of this block.                 |
| \<block-name\>\_time_std_dev            | Standard deviation for time in this block's questions.          |
| ...                                     | ...                                                             |
| answer\_\<block-name\>\_\<question-id\> | Individual response (correct or incorrect) for each question.   |
| ...                                     | ...                                                             |
| time\_\<block-name\>\_\<question-id\>   | Time spent on each question.                                    |
| ...                                     | ...                                                             |
| pairs_block_failures_mean               | Mean of failures per exercise in the optional block.            |
| pairs_block_failures_std_dev            | Deviation of failures per exercise in the optional block.       |
| pairs_block_time_mean                   | Mean of time spent per exercise in the optional block.          |
| pairs_block_time_std_dev                | Deviation of time spent on each exercise in the optional block. |
| number_of_trials                        | Number of optional block exercises played by the participant.   |
| LookAtParticipant_time_mean             | Mean time spent in the `LookAtParticipant` action.              |
| LookAtParticipant_time_std_dev          | Deviation for the time spent in `LookAtParticipant` action.     |
| LookAtScreen_time_mean                  | Mean time spent in the `LookAtScreen` action.                   |
| LookAtScreen_time_std_dev               | Deviation for the time spent in `LookAtScreen` action.          |
| note_b1                                 | Notes written in the first block.                               |
| note_b2                                 | Notes written in the second block.                              |
| note_b3                                 | Notes written in the third block.                               |
| note_b4a                                | Notes written in the fourth block.                              |
| note_b5                                 | Notes written in the fifth block.                               |
| other_notes                             | Other notes (written any time).                                 |
| rating_b1                               | Experimenter rating for first block.                            |
| rating_b2                               | Experimenter rating for second block.                           |
| rating_b3                               | Experimenter rating for third block.                            |
| rating_b4a                              | Experimenter rating for fourth block.                           |
| rating_b5                               | Experimenter rating for fifth block.                            |

Where `block-name` represents the name of each block in the experiment, and `question-id` is the id
of each question.
That way, this file provides many fields that can be easily managed from an Excel sheet, while
compiling some information into processed columns, like the mean and deviation for accuracy on each
block.

The results are processed to provide a digested view of the evolution of the experiment.
To do so, the results for each block are approximated to a line using an ordinary least squares
linear regression:

$$
y = b_0 + x * b_1
$$

To measure the performance in the `Match Pairs` (optional) block, the number of failed attempts has
been counted for each run, and the mean of failures per run is provided.

Other stats have been collected, including the time that Pepper takes in executing different
actions.
This time is measured from the moment the client web app requests the execution of an action
(either automatically or when the experimenter requests it manually), until the server receives a
message from Pepper notifying the end of the interaction.

- `LookAtParticipant`: Request Pepper to activate Basic Awareness and rotate towards the
  participant.
- `LookAtScreen`: Request Pepper to deactivate Basic Awareness and rotate towards the screen.
  When the experiment starts, Pepper is assumed to be looking toward the screen.
  That position is then stored and Pepper is required to return to the home position in this
  action.
