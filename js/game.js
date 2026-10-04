const levels = {
  1: {
    winScore: 10,
    baseTickMs: 300,
    speedSteps: [1, 1.25, 1.5, 2],
    wrap: false,
    obstacleCount: 0,
  },
  2: {
    winScore: 15,
    baseTickMs: 250,
    speedSteps: [1, 1.25, 1.5, 2],
    wrap: true,
    obstacleCount: 3,
  },
};

const board = document.getElementById("game-board");
const ctx = board.getContext("2d");
const levelSelect = document.getElementById("level-select");
const scoresEL = document.getElementById("scores");
const speedEl = document.getElementById("speed-up");

const cellSize = 20;
const width = 20;
const height = 20;

board.width = width * cellSize;
board.height = height * cellSize;

const right = { x: 1, y: 0 };
const left = { x: -1, y: 0 };
const up = { x: 0, y: -1 };
const down = { x: 0, y: 1 };

const snake = [];
let food;
let direction = right;
let score = 0;
let timer;

let currentLevel = 1;
let winScore = 10;
let baseTickMs = 300;
let speedSteps = [1, 1.25, 1.5, 2];
let wrap = false;
let obstacleCount = 0;
let obstacles = [];

function isOccupied(pos) {
  return (
    snake.some((segment) => segment.x === pos.x && segment.y === pos.y) ||
    obstacles.some((obstacle) => obstacle.x === pos.x && obstacle.y === pos.y)
  );
}

function spawnRandom() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (isOccupied(pos));
  return pos;
}

function moveSnake(direction) {
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  if (wrap) {
    if (newHead.x < 0) newHead.x = width - 1;
    if (newHead.x >= width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = height - 1;
    if (newHead.y >= height) newHead.y = 0;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    food = spawnRandom();
    score++;
    updateScoreDisplay();
  } else {
    snake.pop();
  }
}

function isGameOver() {
  const head = snake[0];

  const hitWall =
    head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;

  const hitSelf = snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);

  const hitObstacle = obstacles.some(
    (obstacle) => obstacle.x === head.x && obstacle.y === head.y,
  );

  return hitWall || hitSelf || hitObstacle;
}

function isGameWin() {
  return score >= winScore;
}

function getSpeed() {
  const index = Math.min(Math.floor(score / 3), speedSteps.length - 1);
  return speedSteps[index];
}

function updateScoreDisplay() {
  scoresEL.textContent = `Score: ${score}/${winScore}`;
}

function updateSpeedDisplay() {
  speedEl.textContent = `Speed: ${getSpeed().toFixed(2)}x`;
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

function drawObstacles(ctx) {
  ctx.fillStyle = "gray";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(
      obstacle.x * cellSize,
      obstacle.y * cellSize,
      cellSize,
      cellSize,
    );
  });
}

function draw(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width * cellSize, height * cellSize);
  drawObstacles(ctx);
  drawFood(ctx, food);
  drawSnake(ctx);
}

function scheduleTick() {
  timer = setTimeout(tick, baseTickMs / getSpeed());
}

function loadLevel(level) {
  const config = levels[level];
  currentLevel = level;
  winScore = config.winScore;
  baseTickMs = config.baseTickMs;
  speedSteps = config.speedSteps;
  wrap = config.wrap;
  obstacleCount = config.obstacleCount;
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 });
  direction = right;
  score = 0;
  updateScoreDisplay();

  obstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(spawnRandom());
  }

  food = spawnRandom();
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

startGame();
