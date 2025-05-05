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

export const CartActionType = Object.freeze({
  CLEAR_GAME: "CLEAR_GAME",
  SET_GAME: "SET_GAME",
  CHANGE_SCREEN: "CHANGE_SCREEN",
  UPDATE_SCREEN: "UPDATE_SCREEN",
});

const initialState = {
  game: {
    playerMark: "",
    vs: "",
    iaDifficult: "",
  },
  prevScreen: "",
  screen: "",
  board: {},
};

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case CartActionType.CLEAR_GAME: {
      return structuredClone(initialState);
    }

    case CartActionType.CHANGE_SCREEN: {
      let newState = structuredClone(state);
      const { playerMark, vs, iaDifficult, screen } = action.payload;

      return {
        ...newState,
        game: {
          playerMark,
          vs,
          iaDifficult,
        },
        screen,
        prevScreen: "",
      };
    }

    case CartActionType.UPDATE_SCREEN: {
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

export const clearGameAction = (store) => {
  store.dispatch({
    type: CartActionType.CLEAR_GAME,
  });
};

export const changeToNewGameAction = (store) => {
  store.dispatch({
    type: CartActionType.CHANGE_SCREEN,
    payload: {
      playerMark: "",
      vs: "",
      iaDifficul: "",
      screen: ScreenType.NEW_GAME,
    },
  });
};

export const changeToGameAction = (store, { playerMark, vs, iaDifficul }) => {
  store.dispatch({
    type: CartActionType.CHANGE_SCREEN,
    payload: { playerMark, vs, iaDifficul, screen: ScreenType.GAME },
  });
};

export const updateScreenGameAction = (store, { screen }) => {
  store.dispatch({
    type: CartActionType.UPDATE_SCREEN,
    payload: { screen },
  });
};

export const initGameAction = (store) => {
  store.dispatch({ type: "@@INIT" });
};
