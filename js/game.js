const board = document.getElementById("game-board");

const cellSize = 20;
const width = 20;
const height = 20;

board.width = width * cellSize;
board.height = height * cellSize;

const ctx = board.getContext("2d");

function draw(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width * cellSize, height * cellSize);
  drawFood(ctx, food);
  drawSnake(ctx);
}

const snake = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
];

let food = spawnFood();

function spawnFood() {
  let pos;

  do {
    pos = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (snake.some((segment) => segment.x === pos.x && segment.y === pos.y));

  return pos;
}

function drawFood(ctx, food) {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function drawSnake(ctx) {
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * cellSize,
      segment.y * cellSize,
      cellSize,
      cellSize,
    );
  });
}

const pointsEl = document.getElementById("points");
let score = 0;

function moveSnake(direction) {
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };
  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    food = spawnFood();
    score++;
    pointsEl.textContent = score;
  } else {
    snake.pop();
  }
}

const right = { x: 1, y: 0 };
const left = { x: -1, y: 0 };
const up = { x: 0, y: -1 };
const down = { x: 0, y: 1 };

let direction = right;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== down) {
    direction = up;
  }

  if (e.key === "ArrowDown" && direction !== up) {
    direction = down;
  }

  if (e.key === "ArrowLeft" && direction !== right) {
    direction = left;
  }

  if (e.key === "ArrowRight" && direction !== left) {
    direction = right;
  }
});

const timer = setInterval(tick, 350);

function isGameOver() {
  const head = snake[0];

  const hitWall =
    head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;

  const hitSelf = snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);

  return hitWall || hitSelf;
}

function tick() {
  moveSnake(direction);
  if (isGameOver()) {
    clearInterval(timer);
    alert("Game Over!");
    return;
  }
  draw(ctx);
}
