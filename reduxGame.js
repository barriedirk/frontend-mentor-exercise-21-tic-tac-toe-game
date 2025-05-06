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
  INIT: "@@INIT",
});

const initialGameState = {
  turn: "",
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
    vs: "",
    iaDifficult: "",
  },
  prevScreen: "",
  screen: "",
  game: initialGameState,
};

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GameActionType.CLEAR_GAME: {
      const newState = structuredClone(state);
      const { prevScreen, screen } = action?.payload ?? {};

      return { ...newState, prevScreen, screen };
    }

    case GameActionType.CHANGE_SCREEN: {
      let newState = structuredClone(state);
      const { playerMark, vs, iaDifficult, screen, game } = action.payload;

      return {
        ...newState,
        game: {
          playerMark,
          vs,
          iaDifficult,
        },
        screen,
        prevScreen: "",
        game,
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

    default:
      return state;
  }
};

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
      iaDifficul: "",
      screen: ScreenType.NEW_GAME,
      game: initialGameState,
    },
  });
};

export const changeToGameAction = (store, { playerMark, vs, iaDifficul }) => {
  store.dispatch({
    type: GameActionType.CHANGE_SCREEN,
    payload: {
      playerMark,
      vs,
      iaDifficul,
      screen: ScreenType.GAME,
      game: initialGameState,
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
