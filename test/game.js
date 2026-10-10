const BOARD = document.getElementById("game-board");

const CELL = 20;
let height = 10;
let width = 10;

function drawBoard() {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
    //   cell.style.width = `${CELL}px`;
    //   cell.style.height = `${CELL}px`;
      BOARD.appendChild(cell);
    }
  }
}

drawBoard();