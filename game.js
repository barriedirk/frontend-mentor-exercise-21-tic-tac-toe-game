import { loadPartial } from "./utils.js";

const FILE_HTML = "game.html";

export async function Game({ idRoot }) {
  await loadPartial(idRoot, FILE_HTML);
}
