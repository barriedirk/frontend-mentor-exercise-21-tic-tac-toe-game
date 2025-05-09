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

const KEY_ITEM = "state";

export const getStateFromLocalStorage = () => {
  try {
    const item = localStorage.getItem(KEY_ITEM);

    if (item === null) return null;

    return JSON.parse(item);
  } catch (error) {
    console.error("Failed to read from localStorage:", error);

    return null;
  }
};

export const setStateToLocalStorage = (state) => {
  try {
    localStorage.setItem(KEY_ITEM, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save to localStorage:", error);
  }
};
