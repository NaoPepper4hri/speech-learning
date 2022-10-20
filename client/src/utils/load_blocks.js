import questions from "../assets/questions.json";
import { fisherYatesShuffle } from "../utils";

/**
 * Load the experiment layout using the provided questions as JSON.
 * @return {Array}      List of elements describing each page in the experiment.
 */
export function loadNewBlocks() {
  // Number of times that the match pair question will be run.
  const MATCH_PAIR_QUESTION_NUMBER = 5;

  const block1 = [];
  const block2 = [];
  const block3 = [];
  const block4 = [];
  const block5 = [];

  for (var i = 0; i < questions.length; i++) {
    switch (questions[i].ty) {
      case "ImageButtonQuestion":
        block1.push(questions[i]);
        break;
      case "FillBlankQuestion":
        block2.push(questions[i]);
        break;
      case "VocabularyQuestion":
        block3.push(questions[i]);
        break;
      case "SortWordsQuestion":
        block4.push(questions[i]);
        break;
      case "MatchPairsQuestion":
        for (var j = 0; j < MATCH_PAIR_QUESTION_NUMBER; j++) {
          block5.push(questions[i]);
        }
        break;
      default:
        break;
    }
  }

  // Shuffle all blocks.
  fisherYatesShuffle(block1);
  fisherYatesShuffle(block2);
  fisherYatesShuffle(block3);
  fisherYatesShuffle(block4);
  fisherYatesShuffle(block5);

  // Generate the final layout structure including fixed pages for interactions with Pepper.
  return [
    { ty: "Start" },
    // Block 1
    {
      ty: "PepperResponse",
      id: "block1_0",
      auto: true,
      pepperInteractions: [
        {
          text: "This is our first block. Are you ready to learn Spanish with me today?",
        },
      ],
      message: "Block 1",
    },
    ...block1.slice(0, Math.floor(block1.length / 2)),
    {
      ty: "PepperResponse",
      id: "block1_1",
      auto: true,
      pepperInteractions: [
        { text: "You're doing really great! Lets keep going." },
      ],
      message: "Half way, press continue.",
    },
    ...block1.slice(Math.floor(block1.length / 2), 10),
    {
      ty: "PepperResponse",
      id: "block1_2",
      auto: false,
      pepperInteractions: [
        {
          text: "That's one block already done. How do you feel having completed the first block?",
        },
      ],
      message: "End of Block 1, press Continue to start Block 2",
    },

    // Block 2
    {
      ty: "PepperResponse",
      id: "block2_0",
      auto: true,
      pepperInteractions: [{ text: "Let's get ready to go. " }],
      message: "Block 2",
    },
    ...block2.slice(0, Math.floor(block2.length / 2)),
    {
      ty: "PepperResponse",
      id: "block2_1",
      auto: true,
      pepperInteractions: [
        {
          text: "You're really getting the hang of it! Keep up the good work.",
        },
      ],
      message: "Half way, press continue.",
    },
    ...block2.slice(Math.floor(block2.length / 2), 10),
    {
      ty: "PepperResponse",
      id: "block2_2",
      auto: false,
      pepperInteractions: [
        {
          text: "We've already completed half of the blocks. How confident are you feeling after block two?",
        },
      ],
      message: "End of Block 2, press Continue to start Block 3",
    },

    // Block 3
    {
      ty: "PepperResponse",
      id: "block3_0",
      auto: true,
      pepperInteractions: [
        { text: "We have done two blocks so far, only two more to go." },
      ],
      message: "Block 3",
    },
    ...block3.slice(0, Math.floor(block3.length / 2)),
    {
      ty: "PepperResponse",
      id: "block3_1",
      auto: true,
      pepperInteractions: [
        {
          text: "We're already halfway through this block, you're doing great. Lets keep up this momentum.",
        },
      ],
      message: "Half way, press continue.",
    },
    ...block3.slice(Math.floor(block3.length / 2), 10),
    {
      ty: "PepperResponse",
      id: "block3_2",
      auto: false,
      pepperInteractions: [
        {
          text: "Alright block three is all done, are you enjoying these blocks?",
        },
      ],
      message: "End of Block 3, press Continue to start Block 4",
    },

    // Block 4
    {
      ty: "PepperResponse",
      id: "block4_0",
      auto: true,
      pepperInteractions: [
        {
          text: "We are almost done. That went really quick, just one block to go.",
        },
      ],
      message: "Block 4",
    },
    ...block4.slice(0, Math.floor(block4.length / 2)),
    {
      ty: "PepperResponse",
      id: "block4_1",
      auto: true,
      pepperInteractions: [
        {
          text: "These blocks are getting harder but you're doing a great job, keep it up.",
        },
      ],
      message: "Half way, press continue.",
    },
    ...block4.slice(Math.floor(block4.length / 2), 10),
    {
      ty: "PepperResponseOption",
      id: "block4_2",
      auto: false,
      pepperInteractions: [
        {
          text: "Great work. You've completed all 4 blocks in this learning task. We can end the task here if you wish, or would you like to complete one extra bonus block?",
        },
      ],
      message: "End of Block 4, press Continue to start Block 5",
      options: [{ text: "Continue" }, { text: "End experiment", goto: -1 }],
    },

    // Block 5
    {
      ty: "PepperResponse",
      id: "block5_0",
      auto: true,
      pepperInteractions: [
        { text: "Ok, lets start the bonus block, are you ready to go?" },
      ],
      message: "Block 5",
    },
    ...block5.slice(0, Math.floor(block5.length / 2)),
    {
      ty: "PepperResponse",
      id: "block5_1",
      auto: true,
      pepperInteractions: [
        {
          text: "You're already halfway through, lets see if we can finish off even better and faster.",
        },
      ],
      message: "Half way, press continue.",
    },
    ...block5.slice(Math.floor(block5.length / 2), 10),
    {
      ty: "PepperResponse",
      id: "block5_2",
      auto: false,
      pepperInteractions: [
        {
          text: "Awesome, you've completed all blocks including the bonus round. How do you think you went, and have you enjoyed this experience?",
        },
      ],
      message: "End of Block 5. Done!",
    },
    {
      ty: "EndExercise",
    },
  ];
}
