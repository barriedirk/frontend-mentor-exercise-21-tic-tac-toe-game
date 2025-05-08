import { $, $$ } from "./utils.js";
import { loadPartial } from "./utils.js";
import {
  ScreenType,
  clearGameAction,
  changeToGameAction,
} from "./reduxGame.js";
import { DialogType, showDialog } from "./showDialog.js";

const FILE_HTML = "new-game.html";

export async function NewGame({ idRoot, store }) {
  await loadPartial(idRoot, FILE_HTML);

  clearGameAction(store, {
    prevScreen: ScreenType.NEW_GAME,
    screen: ScreenType.NEW_GAME,
  });

  const $$listInputRadio = $$("input.player-option--radio-mark");

  if ($$listInputRadio) {
    $$listInputRadio[0].checked = true;
  }

  [".new-game__choice--button-cpu", ".new-game__choice--button-player"].forEach(
    (className) => {
      $(className).addEventListener("click", async (evt) => {
        evt.preventDefault();

        const vs = evt.target.getAttribute("data-vs");
        const playerMark = $("input.player-option--radio-mark:checked").value;

        if (vs === "PLAYER") {
          changeToGameAction(store, { playerMark, vs, aiDifficult: "" });
        } else {
          const aiDifficult = await showDialog(DialogType.SELECT_DIFFICULT);

          changeToGameAction(store, { playerMark, vs, aiDifficult });
        }
      });
    }
  );
}
