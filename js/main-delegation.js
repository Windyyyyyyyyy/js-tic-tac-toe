import {
  getCellElementAtIdx,
  getCellElementList,
  getCellListElement,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButton,
} from './selectors.js';
import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import { checkGameStatus } from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

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

const updateStatusGame = (newStatusGame) => {
  gameStatus = newStatusGame;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newStatusGame;
};

const showReplayButton = () => {
  const replayBtn = getReplayButton();
  replayBtn.classList.add('show');
};

const hideReplayButton = () => {
  const replayBtn = getReplayButton();
  replayBtn.classList.remove('show');
};

const highlightCellsWin = (winPositions) => {
  if (!Array.isArray(winPositions)) throw new Error('Invalid win position');
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add('win');
  }
};

// handle click the selected cells
const handleClick = (cell, index) => {
  //Not allow to re-click the cell having value
  const isAlready =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isGameEnded = gameStatus !== GAME_STATUS.PLAYING;
  if (isAlready || isGameEnded) return;

  // Mark current turn to the selected cell
  cell.classList.add(currentTurn);

  //update values for cellValue array
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  //check game status
  const game = checkGameStatus(cellValues);
  console.log(game);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //update status element on DOM
      updateStatusGame(game.status);
      //show replay button
      showReplayButton();
      break;
    }

    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      console.log(game.status);
      //update status element on DOM
      updateStatusGame(game.status);
      //show replay button
      showReplayButton();
      //highlight position cells which win
      highlightCellsWin(game.winPositions);
      break;
    }

    default:
  }

  //toggle turn
  toggleTurn();
};

// handle click replay button
const handleClickReplayBtn = () => {
  //resset status
  cellValues = cellValues.map((x) => (x = ''));
  console.log(cellValues);
  const game = checkGameStatus(cellValues);
  updateStatusGame(game.status);
  //reset value cell on dom
  const cellList = getCellElementList();
  for (const cell of cellList) {
    cell.classList.remove(TURN.CROSS, TURN.CIRCLE, CELL_VALUE.WIN);
  }
  // reset turn
  currentTurn = TURN.CROSS;
  const currentTurnElement = getCurrentTurnElement();
  console.log(currentTurn);
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
  // hide replay button
  hideReplayButton();
};

const initBindClickAllCells = () => {
  //set index for each li element
  const cellList = getCellElementList();
  if (cellList) {
    cellList.forEach((cell, index) => {
      cell.dataset.idx = index;
    });
  }

  //attach click event for ul element
  const cellListElement = getCellListElement();
  if (cellListElement) {
    cellListElement.addEventListener('click', (event) => {
      if (event.target.tagName !== 'LI') return;
      const index = Number(event.target.dataset.idx);
      handleClick(event.target, index);
    });
  }
};

const initClickReplayButton = () => {
  const replayBtn = getReplayButton();
  replayBtn.addEventListener('click', () => {
    handleClickReplayBtn();
  });
};

//MAIN
(() => {
  initBindClickAllCells();
  initClickReplayButton();
})();
