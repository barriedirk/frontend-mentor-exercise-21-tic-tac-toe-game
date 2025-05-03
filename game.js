// 1. Easy AI (Random Move)

function easyAIMove(board) {
  const emptyIndices = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  return randomIndex;
}

// 2. Medium AI (Win or Block)
function mediumAIMove(board, ai = "O", human = "X") {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Try to win
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter((v) => v === ai).length === 2 && values.includes("")) {
      return combo[values.indexOf("")];
    }
  }

  // Try to block
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter((v) => v === human).length === 2 && values.includes("")) {
      return combo[values.indexOf("")];
    }
  }

  // Pick random move
  return easyAIMove(board);
}

// 3. Hard AI (Minimax - Unbeatable)
function hardAIMove(board, ai = "O", human = "X") {
  const availableSpots = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  function checkWinner(b) {
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
    for (let [a, b_, c] of winPatterns) {
      if (b[a] && b[a] === b[b_] && b[a] === b[c]) return b[a];
    }
    return b.includes("") ? null : "tie";
  }

  function minimax(newBoard, isMaximizing) {
    const result = checkWinner(newBoard);
    if (result !== null) {
      if (result === ai) return { score: 1 };
      else if (result === human) return { score: -1 };
      else return { score: 0 }; // tie
    }

    const moves = [];

    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        const move = {};
        move.index = i;
        newBoard[i] = isMaximizing ? ai : human;
        const result = minimax(newBoard, !isMaximizing);
        move.score = result.score;
        newBoard[i] = "";
        moves.push(move);
      }
    }

    if (isMaximizing) {
      let best = -Infinity;
      let bestMove;
      for (let m of moves) {
        if (m.score > best) {
          best = m.score;
          bestMove = m;
        }
      }
      return bestMove;
    } else {
      let best = Infinity;
      let bestMove;
      for (let m of moves) {
        if (m.score < best) {
          best = m.score;
          bestMove = m;
        }
      }
      return bestMove;
    }
  }

  return minimax(board, true).index;
}

// Usage Example

let board = ["", "", "", "", "", "", "", "", ""]; // initial empty board

// Human makes move at index 0
board[0] = "X";

// AI responds
let aiMove = hardAIMove(board); // or mediumAIMove / easyAIMove
board[aiMove] = "O";
