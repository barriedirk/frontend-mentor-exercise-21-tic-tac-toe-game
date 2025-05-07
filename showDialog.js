import { $, $$, loadPartial } from "./utils.js";

export const DialogType = Object.freeze({
  SELECT_DIFFICULT: "SELECT_DIFFICULT",
  RESTART_GAME: "RESTART_GAME",
  SHOW_WHO_WIN: "SHOW_WHO_WIN",
});

const idRoot = "#modal-dialog";
const $dialog = $(idRoot);

const dialogChoice = {
  [DialogType.SHOW_WHO_WIN]: async () => {
    await loadPartial(idRoot, "dialog-game-result.html");
    $dialog.showModal();

    // const $$buttons = $$("#dialog-restart-game button");

    // return new Promise((resolve) => {
    //   $$buttons.forEach(($button) => {
    //     $button.addEventListener("click", (evt) => {
    //       evt.preventDefault();

    //       const response = evt.target.getAttribute("data-answer");

    //       $dialog.close();
    //       resolve(response);
    //     });
    //   });

    //   $$buttons[0].focus();
    // });
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
