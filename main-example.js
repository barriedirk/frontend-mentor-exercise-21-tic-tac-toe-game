✅ Mark a cell with X or O on click

✅ Update aria-label to reflect new state

✅ Update aria-pressed="true"

✅ Change the turn and announce it


const cells = document.querySelectorAll('[role="gridcell"]');
const turnIndicator = document.querySelector(
  '[aria-label="Current player\'s turn"]'
);
let currentPlayer = "X"; // or 'O'

function handleCellClick(e) {
  const cell = e.currentTarget;

  // Prevent overriding existing move
  if (cell.dataset.filled === "true") return;

  // Visually mark the cell (e.g. via class or innerHTML)
  cell.textContent = currentPlayer;
  cell.dataset.filled = "true";

  // ✅ Update accessibility attributes
  cell.setAttribute("aria-label", `${cell.dataset.position}. ${currentPlayer}`);
  cell.setAttribute("aria-pressed", "true");

  // Switch turns
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Update turn visually (your custom logic)
  // For example, toggle a class on turn indicator
  updateTurnIndicator(currentPlayer);
}

function updateTurnIndicator(player) {
  // Update text or icon visibility
  turnIndicator.setAttribute("aria-label", `Current player's turn: ${player}`);
  turnIndicator.querySelector(".game__header-turn--label").textContent = "TURN";
}

cells.forEach((cell, index) => {
  // Optional: store grid position as "Row 1, Column 1"
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  cell.dataset.position = `Row ${row}, Column ${col}`;

  // Initialize
  cell.setAttribute("aria-label", `${cell.dataset.position}. Empty`);
  cell.setAttribute("aria-pressed", "false");
  cell.addEventListener("click", handleCellClick);
});


1. Keyboard Navigation
👇 Requirements:
Users can move between cells with Arrow keys (↑ ↓ ← →)

Press Enter or Space to make a move

let focusedIndex = 0; // start at first cell
cells[focusedIndex].focus();

document.addEventListener('keydown', (e) => {
  const rowSize = 3;
  const totalCells = cells.length;

  // Allow arrow navigation
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowRight':
        focusedIndex = (focusedIndex + 1) % totalCells;
        break;
      case 'ArrowLeft':
        focusedIndex = (focusedIndex - 1 + totalCells) % totalCells;
        break;
      case 'ArrowDown':
        focusedIndex = (focusedIndex + rowSize) % totalCells;
        break;
      case 'ArrowUp':
        focusedIndex = (focusedIndex - rowSize + totalCells) % totalCells;
        break;
    }

    cells[focusedIndex].focus();
  }

  // Allow Enter or Space to "click"
  if (['Enter', ' '].includes(e.key)) {
    cells[focusedIndex].click();
  }
});
