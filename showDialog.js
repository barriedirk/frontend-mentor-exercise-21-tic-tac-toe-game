import { $, $$, loadPartial } from "./utils.js";
import { WinnerMarker } from "./game-logic.js";

export const DialogType = Object.freeze({
  SELECT_DIFFICULT: "SELECT_DIFFICULT",
  RESTART_GAME: "RESTART_GAME",
  SHOW_WHO_WIN: "SHOW_WHO_WIN",
});

const idRoot = "#modal-dialog";
const $dialog = $(idRoot);

const dialogChoice = {
  [DialogType.SHOW_WHO_WIN]: async ({ playerMark, vs, winner }) => {
    await loadPartial(idRoot, "dialog-game-result.html");

    $(`#dialog-game-result--title-${winner.toLowerCase()}`).style.display =
      "flex";

    if (winner !== WinnerMarker.TIE) {
      const $subTitle = $("#dialog-game-result--sub-title");

      if (playerMark !== winner) {
        $subTitle.textContent =
          vs === "AI" ? "OH NO, YOU LOST..." : "PLAYER 2 WINS!";
      } else {
        $subTitle.textContent = vs === "AI" ? "YOU WON!" : "PLAYER 1 WINS!";
      }

      $subTitle.style.display = "inline-block";
    }

    $dialog.showModal();

    const $$buttons = $$("#dialog-game-result button");

    return new Promise((resolve) => {
      $$buttons.forEach(($button) => {
        $button.addEventListener("click", async (evt) => {
          evt.preventDefault();

          const response = evt.target.getAttribute("data-answer");

          $dialog.close();
          resolve(response);
        });
      });

      $$buttons[0].focus();
    });
  },
  [DialogType.RESTART_GAME]: async (args) => {
    await loadPartial(idRoot, "dialog-restart-game.html");
    $dialog.showModal();

    const $$buttons = $$("#dialog-restart-game button");

    return new Promise((resolve) => {
      $$buttons.forEach(($button) => {
        $button.addEventListener("click", (evt) => {
          evt.preventDefault();

          const response = evt.target.getAttribute("data-answer");

          $dialog.close();
          resolve(response);
        });
      });

      $$buttons[0].focus();
    });
  },
  [DialogType.SELECT_DIFFICULT]: async () => {
    await loadPartial(idRoot, "dialog-select-level-ai.html");

    $dialog.showModal();

    return new Promise((resolve) => {
      const $$buttons = $dialog.querySelectorAll(".dialog-select-level button");

      $$buttons.forEach(($button) => {
        $button.addEventListener("click", (evt) => {
          evt.preventDefault();

          const difficult = evt.target.getAttribute("data-level");

          $dialog.close();
          resolve(difficult);
        });
      });
    });
  },
};

export const showDialog = async (dialog, ...args) => {
  const response = await dialogChoice[dialog](...args);

  return response;
};
