import { $, $$, loadPartial } from "./utils.js";
import { DialogType, showDialog } from "./showDialog.js";
import { changeToNewGameAction } from "./reduxGame.js";

const FILE_HTML = "game.html";

export async function Game({ idRoot, store }) {
  const state = store.getState();

  await loadPartial(idRoot, FILE_HTML);

  console.log({ state });

  $("#game__header-restart--button").addEventListener("click", async (evt) => {
    evt.preventDefault();

    const response = await showDialog(DialogType.RESTART_GAME);

    if (response === "yes") {
      changeToNewGameAction(store);
    }
  });
}
