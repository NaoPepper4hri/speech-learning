import {
  getExpState,
  initialize,
  restartExperiment,
  saveData,
  setCurrentPage,
  setNewQuestionLayout,
} from "./experiment";
import { loadNewBlocks } from "./load_blocks.js";
import { logAction, sendAnswer, sendComment } from "./logging";
import {
  requestPepperAnimation,
  requestPepperLookAtScreen,
  requestPepperLookAtParticipant,
  requestPepperText,
} from "./pepper";
import {
  onConversationIsDone,
  onPepperIsDone,
  setConversationDone,
} from "./synchronization";

export {
  fisherYatesShuffle,
  getExpState,
  initialize,
  loadNewBlocks,
  logAction,
  onConversationIsDone,
  onPepperIsDone,
  requestPepperAnimation,
  requestPepperLookAtScreen,
  requestPepperLookAtParticipant,
  requestPepperText,
  restartExperiment,
  saveData,
  sendAnswer,
  sendComment,
  setConversationDone,
  setCurrentPage,
  setNewQuestionLayout,
};

/**
 * Shuffle the elements in the given array.
 *
 * @param {Array} arr
 */
function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}
