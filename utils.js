export const $ = (selector) => document.querySelector(selector);

export const $$ = (selector) => document.querySelectorAll(selector);

export const idRoot = "#root";

const FILE_PATH = "./partials/";

export const loadPartial = async (idNode, file) => {
  const $root = $(idNode);

  $root.innerHTML = "";

  try {
    const path = `${FILE_PATH}${file}`;
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    });

    if (!response.ok) throw new Error(`Could not load ${file}`);

    const html = await response.text();

    $root.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
};

export const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }

  return board.includes("") ? null : "TIE";
};
