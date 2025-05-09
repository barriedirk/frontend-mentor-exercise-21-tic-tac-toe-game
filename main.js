import { $, idRoot, setStateToLocalStorage } from "./utils.js";
import { NewGame } from "./new-game.js";
import { Game } from "./game.js";
import {
  createStore,
  gameReducer,
  initGameAction,
  ScreenType,
} from "./reduxGame.js";

(async () => {
  const store = createStore(gameReducer);
  let currentScreen = "";

  const renderScreen = async () => {
    const state = store.getState();
    const { screen } = state;

    if (screen === "") {
      currentScreen = ScreenType.NEW_GAME;

      await NewGame({ idRoot, store });

      return;
    }

    if (screen === currentScreen) return;

    currentScreen = screen;

    if (screen === ScreenType.NEW_GAME) {
      await NewGame({ idRoot, store });
    }

    if (screen === ScreenType.GAME) {
      await Game({ idRoot, store });
    }
  };

  const saveDataInLocalStorage = async () => {
    const state = store.getState();

    setStateToLocalStorage(state);
  };

  store.subscribe(renderScreen);
  store.subscribe(saveDataInLocalStorage);

  initGameAction(store);

  const $dialog = $("#modal-dialog");

  // Register polyfill if needed
  if (!$dialog.showModal) {
    $dialogPolyfill.registerDialog(dialog);
  }
})();
