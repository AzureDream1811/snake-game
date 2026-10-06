const DEFAULT_LEVEL = {
  gridWidth: 20,
  gridHeight: 20,
  winScore: 20,
  baseTickMs: 300,
  speedSteps: [1, 1.25, 1.5, 2],
  wrap: false,
  obstacleCount: 0,
  missionIds: [],
  missionCount: 0,
  showEffects: false,
  specialFoodTypes: [],
  hasTimeLimit: false,
  timeLimit: 0,
};

const levels = {
  1: { ...DEFAULT_LEVEL, winScore: 10 },
  2: {
    ...DEFAULT_LEVEL,
    winScore: 30,
    baseTickMs: 250,
    wrap: true,
    obstacleCount: 3,
    missionIds: ["len8", "food5", "food8", "len12", "survive100"],
    missionCount: 3,
    showEffects: true,
  },
  3: {
    ...DEFAULT_LEVEL,
    gridWidth: 30,
    gridHeight: 30,
    baseTickMs: 200,
    speedSteps: [1, 1.5, 2, 3],
    winScore: 50,
    wrap: true,
    obstacleCount: 5,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime"],
    foodCount: 2,
    hasTimeLimit: true,
    timeLimit: 150000,
  },
};

const MISSIONS = {
  len8: {
    text: "Reach length 8",
    check: () => snake.length >= 8,
    reward: () => addEffect("speed", 5000),
  },
  food5: {
    text: "Collect 5 food",
    check: () => foodEaten >= 5,
    reward: () => {
      score += 5;
    },
  },
  food8: {
    text: "Collect 8 food",
    check: () => foodEaten >= 8,
    reward: () => addEffect("speed", 3000),
  },
  len12: {
    text: "Reach length 12",
    check: () => snake.length >= 12,
    reward: () => {
      score += 10;
    },
  },
  survive100: {
    text: "Survive 100 ticks",
    check: () => tickCount >= 100,
    reward: () => {
      score += 2;
    },
  },
};

const FOOD_TYPES = {
  normal: {
    color: "red",
    effect: () => {
      score++;
      foodEaten++;
    },
  },
  slow: {
    color: "#5c00f1",
    effect: () => {
      addEffect("slow", 5000);
      score -= 1;
      foodEaten++;
    },
  },
  speed: {
    color: "#FFD23F",
    effect: () => {
      addEffect("speed", 5000);
      score += 2;
      foodEaten++;
    },
  },
  extraFood: {
    color: "#FF6B9D",
    effect: () => {
      score += 5;
      foodEaten++;
    },
  },
  extraTime: {
    color: "#2ECC71",
    effect: () => {
      timeRemainingMs += 10000;
      foodEaten++;
    },
  },
};

const board = document.getElementById("game-board");
const ctx = board.getContext("2d");
const levelSelect = document.getElementById("level-select");
const foodEl = document.getElementById("food");
const scoresEL = document.getElementById("scores");
const speedEl = document.getElementById("speed-up");
const missionsEl = document.getElementById("missions");
const tickCountEl = document.getElementById("tick-count");
const effectEl = document.getElementById("effects");
const timeEl = document.getElementById("time");

const cellSize = 20;
let width = 20;
let height = 20;

const right = { x: 1, y: 0 };
const left = { x: -1, y: 0 };
const up = { x: 0, y: -1 };
const down = { x: 0, y: 1 };

const snake = [];
let foods = [];
let direction = right;
let score = 0;
let timer;
let tickCount = 0;
let foodEaten = 0;
let foodDurationMs = 10000;
let foodCount = 1;

let currentLevel = 1;
let winScore = 10;
let baseTickMs = 300;
let speedSteps = [1, 1.25, 1.5, 2];
let wrap = false;
let obstacleCount = 0;
let obstacles = [];
let missionCount = 0;
let missionPool = [];
let missions = [];
let effects = [];
let specialFood = [];
let hasTimeLimit = false;
let timeLimit = 0;
let showEffects = false;
let timeRemainingMs = 0;
let lastTickTime = 0;

function isOccupied(pos) {
  return (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    obstacles.some((o) => o.x === pos.x && o.y === pos.y) ||
    foods.some((f) => f.x === pos.x && f.y === pos.y)
  );
}

function spawnRandom(durationMs) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (isOccupied(pos));

  const type = pickFoodType();
  const result = { x: pos.x, y: pos.y, type };

  if (Number.isFinite(durationMs)) {
    setTimeout(() => {
      const index = foods.findIndex(
        (f) => f.x === result.x && f.y === result.y,
      );
      if (index !== -1) {
        foods.splice(index, 1, spawnRandom(durationMs));
      }
    }, durationMs);
  }
  return result;
}

function spawnFoods(count, durationMs) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(spawnRandom(durationMs));
  }
  return result;
}

function pickFoodType() {
  if (specialFood.length === 0) return "normal";
  const roll = Math.random();

  if (roll < 0.7) return "normal";

  const pool = specialFood;
  return pool[Math.floor(Math.random() * pool.length)];
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

  const eatenIndex = foods.findIndex(
    (f) => f.x === newHead.x && f.y === newHead.y,
  );

  if (eatenIndex !== -1) {
    FOOD_TYPES[foods[eatenIndex].type].effect();
    foods.splice(eatenIndex, 1, spawnRandom(foodDurationMs));
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

  if (hasTimeLimit && timeRemainingMs <= 0) {
    return true;
  }

  return hitWall || hitSelf || hitObstacle;
}

function isGameWin() {
  return score >= winScore;
}

function getSpeed() {
  const index = Math.min(Math.floor(foodEaten / 3), speedSteps.length - 1);
  let speed = speedSteps[index];
  if (hasEffect("speed")) {
    speed *= 1.5;
  }
  if (hasEffect("slow")) {
    speed *= 0.5;
  }
  return speed;
}

function timeRemaining(timeElapsed) {
  if (!hasTimeLimit) return Infinity;
  return Math.max(0, timeLimit - timeElapsed);
}

function updateFoodDisplay() {
  foodEl.textContent = `Food eaten: ${foodEaten}`;
}

function updateScoreDisplay() {
  scoresEL.textContent = `Score: ${score}/${winScore}`;
}

function updateSpeedDisplay() {
  speedEl.textContent = `Speed: ${getSpeed().toFixed(2)}x`;
}

function updateTickCountDisplay() {
  tickCountEl.textContent = `Ticks: ${tickCount}`;
}

function updateEffectDisplay() {
  effectEl.hidden = !showEffects;
  if (!showEffects) return;

  const activeEffects = effects
    .filter((e) => e.endsAt > Date.now())
    .map((e) => e.type)
    .join(", ");
  effectEl.textContent = `Current Effects: ${activeEffects || "none"}`;
}

function updateMissionDisplay() {
  missionsEl.innerHTML = "";
  missions.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.done ? "[x]" : "[ ]"} ${m.text}`;
    missionsEl.appendChild(li);
  });
}

function updateTimeDisplay() {
  if (!hasTimeLimit) {
    timeEl.hidden = true;
    return;
  }
  timeEl.hidden = false;
  timeEl.textContent = `Remaining: ${Math.ceil(Math.max(0, timeRemainingMs) / 1000)}s`;
}

function updateDisplays() {
  updateFoodDisplay();
  updateScoreDisplay();
  updateSpeedDisplay();
  updateTickCountDisplay();
  updateMissionDisplay();
  updateEffectDisplay();
  updateTimeDisplay();
}

function drawFood(ctx, foods) {
  foods.forEach((f) => {
    ctx.fillStyle = FOOD_TYPES[f.type].color;
    ctx.fillRect(f.x * cellSize, f.y * cellSize, cellSize, cellSize);
  });
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
  drawFood(ctx, foods);
  drawSnake(ctx);
}

function pickMissions() {
  const pool = [...missionPool];
  const picked = [];
  for (let i = 0; i < missionCount && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const mission = pool.splice(index, 1)[0];
    picked.push({
      text: mission.text,
      check: mission.check,
      done: false,
      reward: mission.reward,
    });
  }
  return picked;
}

function updateMissions() {
  missions.forEach((m) => {
    if (!m.done && m.check()) {
      m.done = true;
      m.reward();
    }
  });
}

function addEffect(type, durationMs) {
  effects.push({ type, endsAt: Date.now() + durationMs });
}

function hasEffect(type) {
  return effects.some((e) => e.type === type && e.endsAt > Date.now());
}

function cleanupEffects() {
  effects = effects.filter((e) => e.endsAt > Date.now());
}

function scheduleTick() {
  timer = setTimeout(tick, baseTickMs / getSpeed());
}

function loadLevel(level) {
  const config = levels[level];
  currentLevel = level;

  width = config.gridWidth; 
  height = config.gridHeight;
  board.width = width * cellSize;
  board.height = height * cellSize;

  winScore = config.winScore;
  baseTickMs = config.baseTickMs;
  speedSteps = config.speedSteps;
  wrap = config.wrap;
  obstacleCount = config.obstacleCount;
  foodCount = levels[currentLevel].foodCount || 1;

  missionPool = config.missionIds.map((id) => MISSIONS[id]);
  missionCount = config.missionCount;

  specialFood = config.specialFoodTypes;
  hasTimeLimit = config.hasTimeLimit;
  timeLimit = config.timeLimit;
  showEffects = config.showEffects;
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 });
  direction = right;
  score = 0;
  foodEaten = 0;
  tickCount = 0;
  foods = spawnFoods(foodCount, foodDurationMs);

  obstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(spawnRandom(Infinity));
  }

  missions = pickMissions();
  effects = [];
  timeRemainingMs = timeLimit;
  lastTickTime = Date.now();
}

function startGame() {
  clearTimeout(timer);
  loadLevel(currentLevel);
  resetGame();
  draw(ctx);
  updateDisplays();
  scheduleTick();
}

function tick() {
  tickCount++;
  const now = Date.now();
  const delta = now - lastTickTime;
  lastTickTime = now;

  if (hasTimeLimit) {
    timeRemainingMs -= delta;
  }

  moveSnake(direction);

  if (isGameOver()) {
    alert("Game Over!");
    startGame();
    return;
  }

  updateMissions();

  if (isGameWin()) {
    alert("You Win!");
    startGame();
    return;
  }

  draw(ctx);

  updateDisplays();
  cleanupEffects();
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
