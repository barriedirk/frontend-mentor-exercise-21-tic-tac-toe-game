import { $, idRoot } from "./utils.js";
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

  const renderScreen = async () => {
    const state = store.getState();
    const { prevScreen, screen } = state;

    if (screen === "") {
      await NewGame({ idRoot, store });

      return;
    }

    if (prevScreen === screen) return;

    if (screen === ScreenType.NEW_GAME) {
      await NewGame({ idRoot, store });
    }

    if (screen === ScreenType.GAME) {
      await Game({ idRoot, store });
    }
  };

  store.subscribe(renderScreen);

  initGameAction(store);

  const $dialog = $("#modal-dialog");

  // Register polyfill if needed
  if (!$dialog.showModal) {
    $dialogPolyfill.registerDialog(dialog);
  }
})();
