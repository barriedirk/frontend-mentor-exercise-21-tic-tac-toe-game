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
