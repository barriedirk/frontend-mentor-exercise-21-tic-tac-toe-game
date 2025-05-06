import { $, $$, loadPartial } from "./utils.js";

export const DialogType = Object.freeze({
  SELECT_DIFFICULT: "SELECT_DIFFICULT",
  RESTART_GAME: "RESTART_GAME",
});

const idRoot = "#modal-dialog";
const $dialog = $(idRoot);

const dialogChoice = {
  [DialogType.RESTART_GAME]: async () => {
    await loadPartial(idRoot, "dialog-restart-game.html");
    $dialog.showModal();

    const $$buttons = $$("#dialog-restart-game button");

    return new Promise((resolve) => {
      $$buttons.forEach(($button) => {
        $button.addEventListener("click", (evt) => {
          evt.preventDefault();

          const response = evt.target.getAttribute("data-answer");

          console.log({ response });

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

export const showDialog = async (dialog) => {
  const response = await dialogChoice[dialog]();

  return response;
};
