const levels = {
  1: { winScore: 10, baseTickMs: 300, speedSteps: [1, 1.25, 1.5, 2] },
  2: { winScore: 15, baseTickMs: 250, speedSteps: [1, 1.25, 1.5, 2] },
};

let currentLevel = 1;

const levelSelect = document.getElementById("level-select");

Object.keys(levels).forEach((key) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = `Level ${key}`;
  levelSelect.appendChild(option);
});

levelSelect.addEventListener("change", () => {
  currentLevel = Number(levelSelect.value);
  levelSelect.blur();
  startGame();
});


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

const scoresEL = document.getElementById("scores");
let score = 0;

function moveSnake(direction) {
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };
  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    food = spawnFood();
    score++;
    updateScoreDisplay();
  } else {
    snake.pop();
  }
}


function updateScoreDisplay() {
  scoresEL.textContent = `Score: ${score}/${winScore}`;
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

function isGameOver() {
  const head = snake[0];

  const hitWall =
    head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;

  const hitSelf = snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);

  return hitWall || hitSelf;
}

let winScore = 10;
function isGameWin() {
  return score >= winScore;
}

let baseTickMs = 300;
const speedEl = document.getElementById("speed-up");
let speedSteps = [1, 1.25, 1.5, 2];

function getSpeed() {
  const index = Math.min(Math.floor(score / 3), speedSteps.length - 1);
  return speedSteps[index];
}

function updateSpeedDisplay() {
  speedEl.textContent = `Speed: ${getSpeed().toFixed(2)}x`;
}

let timer;

function scheduleTick() {
  timer = setTimeout(tick, baseTickMs / getSpeed());
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 });
  direction = right;
  score = 0;
  updateScoreDisplay();
  food = spawnFood();
}

function loadLevel(level) {
  const config = levels[level];
  currentLevel = level;
  winScore = config.winScore;
  baseTickMs = config.baseTickMs;
  speedSteps = config.speedSteps;
}

function startGame() {
  clearTimeout(timer);
  loadLevel(currentLevel);
  resetGame();
  draw(ctx);
  updateSpeedDisplay();
  scheduleTick();
}

function tick() {
  moveSnake(direction);

  if (isGameOver()) {
    alert("Game Over!");
    startGame();
    return;
  }

  if (isGameWin()) {
    alert("You Win!");
    startGame();
    return;
  }

  draw(ctx);
  updateSpeedDisplay();
  scheduleTick();
}

startGame();
