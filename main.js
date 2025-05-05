import { idRoot } from "./utils.js";
import { NewGame } from "./new-game.js";
import { Game } from "./game.js";
import {
  createStore,
  gameReducer,
  updateScreenGameAction,
  initGameAction,
  ScreenType,
} from "./reduxGame.js";

(async () => {
  const store = createStore(gameReducer);

  const renderScreen = () => {
    const state = store.getState();
    const { prevScreen, screen } = state;

    if (prevScreen === screen && screen !== "") return;

    if (screen === ScreenType.NEW_GAME || screen === "") {
      NewGame({ idRoot, store });
    }

    if (screen === ScreenType.GAME) {
      Game({ idRoot, store });
    }

    updateScreenGameAction(store, { screen: screen ?? ScreenType.NEW_GAME });
  };

  store.subscribe(renderScreen);

  initGameAction(store);
})();
