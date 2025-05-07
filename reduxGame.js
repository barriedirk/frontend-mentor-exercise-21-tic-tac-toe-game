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
  UPDATE_PREV_SCREEN: "UPDATE_PREV_SCREEN",
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
  prevScreen: "",
  screen: "",
  boardGame: initialGameState,
};

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GameActionType.CLEAR_GAME: {
      const newState = structuredClone(state);
      const { prevScreen, screen } = action?.payload ?? {};

      return { ...newState, prevScreen, screen };
    }

    case GameActionType.UPDATE_PREV_SCREEN: {
      const newState = structuredClone(state);
      const { screen } = newState;

      return { ...newState, prevScreen: screen };
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
        prevScreen: "",
        boardGame,
      };
    }

    case GameActionType.UPDATE_SCREEN: {
      let newState = structuredClone(state);
      let { screen } = action.payload;

      return {
        ...newState,
        screen,
        prevScreen: screen,
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

    default:
      return state;
  }
};

/*  =ACTIONS---------------------- */

export const clearGameAction = (store, { prevScreen, screen }) => {
  store.dispatch({
    type: GameActionType.CLEAR_GAME,
    payload: {
      prevScreen: prevScreen ?? "",
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
      aiDifficul: "",
      screen: ScreenType.NEW_GAME,
      boardGame: initialGameState,
    },
  });
};

export const changeToGameAction = (store, { playerMark, vs, aiDifficul }) => {
  store.dispatch({
    type: GameActionType.CHANGE_SCREEN,
    payload: {
      playerMark,
      vs,
      aiDifficul,
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
    payload: winner,
  });
};

export const updatePrevScreenAction = (store) => {
  store.dispatch({
    type: GameActionType.UPDATE_PREV_SCREEN,
  });
};
