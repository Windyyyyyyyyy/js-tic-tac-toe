import { getCellElementList, getCurrentTurnElement } from "./selectors.js";
import { TURN } from "./constants.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

const toggleTurn = () => {
  //logic toggle
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  // update on DOM
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
};

const handleClick = (cell, index) => {
  //Not allow to re-click the cell having value
  const isAlready =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isAlready) return;

  // Mark current turn to the selected cell
  cell.classList.add(currentTurn);

  //toggle turn
  toggleTurn();

  //Check game state
};

const initBindClickAllCells = () => {
  const cellList = getCellElementList();
  cellList.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      handleClick(cell, index);
    });
  });
};

//MAIN
(() => {
  initBindClickAllCells();
})();
