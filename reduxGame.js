import { getStateFromLocalStorage } from "./utils.js";

export const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => Object.freeze(state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  dispatch({ type: "@@INIT" });

  return { getState, dispatch, subscribe };
};

export const ScreenType = Object.freeze({
  GAME: "GAME",
  NEW_GAME: "NEW_GAME",
});

export const GameActionType = Object.freeze({
  CLEAR_GAME: "CLEAR_GAME",
  SET_GAME: "SET_GAME",
  CHANGE_SCREEN: "CHANGE_SCREEN",
  UPDATE_SCREEN: "UPDATE_SCREEN",
  TURN_ON: "TURN_ON",
  INCREASE_COUNT_WINNER: "INCREASE_COUNT_WINNER",
  NEXT_ROUND: "NEXT_ROUND",
  INIT: "@@INIT",
});

const initialGameState = {
  turn: "X",
  board: ["", "", "", "", "", "", "", "", ""],
  score: {
    you: 0,
    ties: 0,
    rival: 0,
  },
};

const initialState = {
  game: {
    playerMark: "",
    rivalMark: "",
    vs: "",
    aiDifficult: "",
  },
  screen: "",
  boardGame: initialGameState,
};

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GameActionType.CLEAR_GAME: {
      const newState = structuredClone(state);
      const { screen } = action?.payload ?? {};

      return { ...newState, screen };
    }

    case GameActionType.CHANGE_SCREEN: {
      let newState = structuredClone(state);
      const { playerMark, vs, aiDifficult, screen, boardGame } = action.payload;

      return {
        ...newState,
        game: {
          playerMark,
          rivalMark: playerMark === "" ? "" : playerMark === "X" ? "O" : "X",
          vs,
          aiDifficult,
        },
        screen,
        boardGame,
      };
    }

    case GameActionType.UPDATE_SCREEN: {
      let newState = structuredClone(state);
      let { screen } = action.payload;

      return {
        ...newState,
        screen,
      };
    }

    case GameActionType.TURN_ON: {
      let newState = structuredClone(state);
      let { turn, idx } = action.payload;
      const {
        boardGame: { board, score },
      } = newState;

      board[idx] = turn;

      return {
        ...newState,
        boardGame: {
          turn: turn === "X" ? "O" : "X",
          board,
          score,
        },
      };
    }

    case GameActionType.INCREASE_COUNT_WINNER: {
      let newState = structuredClone(state);
      let {
        game: { playerMark },
        boardGame: {
          turn,
          board,
          score: { you, ties, rival },
        },
      } = newState;
      let { winner } = action.payload;

      if (winner === "TIE") {
        ties++;
      } else if (playerMark === winner) {
        you++;
      } else {
        rival++;
      }

      return {
        ...newState,
        boardGame: {
          turn,
          board,
          score: { you, ties, rival },
        },
      };
    }

    case GameActionType.NEXT_ROUND: {
      let newState = structuredClone(state);
      let {
        boardGame: { score },
      } = newState;

      return {
        ...newState,
        boardGame: {
          turn: initialGameState.turn,
          board: initialGameState.board,
          score,
        },
      };
    }

    case GameActionType.INIT: {
      let newState = getStateFromLocalStorage() ?? structuredClone(state);

      return {
        ...newState,
      };
    }

    default:
      return state;
  }
};

/*  =ACTIONS---------------------- */

export const clearGameAction = (store, { screen }) => {
  store.dispatch({
    type: GameActionType.CLEAR_GAME,
    payload: {
      screen: screen ?? "",
    },
  });
};

export const changeToNewGameAction = (store) => {
  store.dispatch({
    type: GameActionType.CHANGE_SCREEN,
    payload: {
      playerMark: "",
      vs: "",
      aiDifficult: "",
      screen: ScreenType.NEW_GAME,
      boardGame: initialGameState,
    },
  });
};

export const changeToGameAction = (store, { playerMark, vs, aiDifficult }) => {
  store.dispatch({
    type: GameActionType.CHANGE_SCREEN,
    payload: {
      playerMark,
      vs,
      aiDifficult,
      screen: ScreenType.GAME,
      boardGame: initialGameState,
    },
  });
};

export const updateScreenGameAction = (store, { screen }) => {
  store.dispatch({
    type: GameActionType.UPDATE_SCREEN,
    payload: { screen },
  });
};

export const initGameAction = (store) => {
  store.dispatch({ type: GameActionType.INIT });
};

export const turnOnGameAction = (store, { turn, idx }) => {
  store.dispatch({
    type: GameActionType.TURN_ON,
    payload: {
      turn,
      idx,
    },
  });
};

export const increaseCountWinnerAction = (store, { winner }) => {
  store.dispatch({
    type: GameActionType.INCREASE_COUNT_WINNER,
    payload: { winner },
  });
};

export const nextRoundGameAction = (store) => {
  store.dispatch({
    type: GameActionType.NEXT_ROUND,
  });
};
