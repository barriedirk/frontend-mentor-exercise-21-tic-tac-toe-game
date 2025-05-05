import { $, $$ } from "./utils.js";
import { loadPartial } from "./utils.js";
import { clearGameAction, changeToGameAction } from "./reduxGame.js";

const FILE_HTML = "new-game.html";

export async function NewGame({ idRoot, store }) {
  await loadPartial(idRoot, FILE_HTML);
  clearGameAction(store);

  $$('input[class="player-option--radio-mark"]')[0].checked = true;

  [".new-game__choice--button-cpu", ".new-game__choice--button-player"].forEach(
    (className) => {
      $(className).addEventListener("click", (evt) => {
        evt.preventDefault();

        const vs = evt.target.getAttribute("data-vs");
        const playerMark = $(
          'input[class="player-option--radio-mark"]:checked'
        ).value;

        console.log({ vs, playerMark });

        if (vs === "player") {
          debugger;
          changeToGameAction(store, { playerMark, vs, difficult: "" });
        }
      });
    }
  );
}
