import { $, $$, loadPartial } from "./utils.js";

import {
  checkWinner,
  easyAIMove,
  mediumAIMove,
  hardAIMove,
} from "./game-logic.js";

import { DialogType, showDialog } from "./showDialog.js";
import {
  changeToNewGameAction,
  turnOnGameAction,
  increaseCountWinnerAction,
  nextRoundGameAction,
} from "./reduxGame.js";

const FILE_HTML = "game.html";

const updateTurn = (store) => {
  const state = store.getState();
  const {
    boardGame: { turn },
  } = state;

  const $span = $("#game__header-turn .game__header-turn--who-plays");
  const $gamePlays = $("#game-plays");

  const classToAdd =
    turn === "X" ? "game__header-turn--x" : "game__header-turn--o";
  const classToRemove =
    turn === "X" ? "game__header-turn--o" : "game__header-turn--x";

  const classToAddBoard = turn === "X" ? "turn-x" : "turn-o";
  const classToRemoveBoard = turn === "X" ? "turn-o" : "turn-x";

  $span.classList.add(classToAdd);
  $span.classList.remove(classToRemove);

  $gamePlays.classList.add(classToAddBoard);
  $gamePlays.classList.remove(classToRemoveBoard);
};

const updateScore = (store) => {
  const state = store.getState();
  const {
    boardGame: {
      score: { you, ties, rival },
    },
  } = state;

  $("#game__score--you .game__score--score").innerHTML = you;
  $("#game__score--ties .game__score--score").innerHTML = ties;
  $("#game__score--rival .game__score--score").innerHTML = rival;
};

const updateBoard = (store) => {
  const state = store.getState();
  const {
    boardGame: { board },
  } = state;

  const $$buttons = $$("#game-plays .game__plays--button");

  $$buttons.forEach(($button, idx) => {
    const row = Math.floor(idx / 3) + 1;
    const column = (idx % 3) + 1;
    const turn = board[idx];

    if (turn === "") {
      $button.setAttribute("aria-pressed", "false");
      $button.setAttribute("aria-label", `Row ${row}, Column ${column}. Empty`);
      $button.classList.remove("play-o");
      $button.classList.remove("play-x");
      $button.removeAttribute("disabled");
    } else {
      const classToAdd = turn === "X" ? "play-x" : "play-o";
      const classToRemove = turn === "X" ? "play-o" : "play-x";

      $button.classList.remove(classToRemove);
      $button.classList.add(classToAdd);
      $button.setAttribute("aria-pressed", "true");
      $button.setAttribute(
        "aria-label",
        `Row ${row}, Column ${column}. Turn ${turn.toUpperCase()}`
      );
      $button.disabled = true;
    }
  });
};

const updateGameScreen = (store) => {
  updateScore(store);
  updateTurn(store);
  updateBoard(store);
  verifyWinner(store);
};

const verifyWinner = async (store) => {
  const state = store.getState();
  const {
    game,
    boardGame: { board },
  } = state;

  const winner = checkWinner(board);

  if (winner) {
    const { playerMark, vs, rivalMark } = game;

    increaseCountWinnerAction(store, { winner });
    updateScore(store);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await showDialog(DialogType.SHOW_WHO_WIN, {
      playerMark,
      rivalMark,
      winner,
      vs,
    });

    if (response === "quit") {
      changeToNewGameAction(store);
    } else {
      nextRoundGameAction(store);
      updateGameScreen(store);
      aiTurn(store);
    }
  }
};

const aiTurn = async (store) => {
  const state = store.getState();
  const { boardGame, game } = state;
  const { aiDifficult, playerMark, vs, rivalMark } = game;
  const { turn, board } = boardGame;

  if (vs !== "AI") return;
  if (turn !== rivalMark) return;

  const winner = checkWinner(board);

  if (winner) return;

  const $thinkingRobot = $("#thinking-robot");

  $thinkingRobot.classList.add("thinking-robot--show");

  let aiMove = null;
  switch (aiDifficult) {
    case "EASY":
      aiMove = easyAIMove(board);
      break;

    case "MEDIUM":
      aiMove = mediumAIMove(board, rivalMark, playerMark);
      break;

    case "HARD":
      aiMove = hardAIMove(board, rivalMark, playerMark);
      break;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (aiMove !== null) {
    turnOnGameAction(store, { idx: aiMove, turn });
    updateGameScreen(store);
  }

  $thinkingRobot.classList.remove("thinking-robot--show");
};

export async function Game({ idRoot, store }) {
  const state = store.getState();
  const { game } = state;
  const { playerMark, vs, rivalMark } = game;

  await loadPartial(idRoot, FILE_HTML);

  $("#game__score--you .game__score--title").innerHTML =
    vs === "AI" ? `${playerMark} (YOU)` : `${playerMark} (P1)`;
  $("#game__score--rival .game__score--title").innerHTML =
    vs === "AI" ? `${rivalMark} (CPU)` : `${rivalMark} (P2)`;

  $("#game__score--you").classList.add(
    playerMark === "X" ? "button--color-blue" : "button--color-orange"
  );
  $("#game__score--rival").classList.add(
    playerMark === "X" ? "button--color-orange" : "button--color-blue"
  );

  updateGameScreen(store);
  aiTurn(store);

  $$(".game__plays--button").forEach(($button, idx) => {
    // const row = Math.floor(idx / 3) + 1;
    // const column = (idx % 3) + 1;

    $button.addEventListener("click", async (evt) => {
      evt.preventDefault();

      const state = store.getState();
      const {
        boardGame: { turn },
      } = state;

      turnOnGameAction(store, { idx, turn });
      updateTurn(store);
      updateBoard(store);
      verifyWinner(store);
      aiTurn(store);
    });
  });

  $("#game__header-restart--button").addEventListener("click", async (evt) => {
    evt.preventDefault();

    const response = await showDialog(DialogType.RESTART_GAME);

    if (response === "yes") {
      changeToNewGameAction(store);
    }
  });
}
