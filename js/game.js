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
  hasHealth: false,
};

const LEVELS = {
  1: { ...DEFAULT_LEVEL, winScore: 10 },
  2: {
    ...DEFAULT_LEVEL,
    winScore: 30,
    baseTickMs: 250,
    wrap: true,
    obstacleCount: 3,
    missionIds: ["len8", "food5", "food8", "len12", "survive300t"],
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
    obstacleCount: 9,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime", "poison"],
    foodCount: 2,
    hasTimeLimit: true,
    timeLimit: 150000,
  },
  4: {
    ...DEFAULT_LEVEL,
    gridWidth: 30,
    gridHeight: 30,
    baseTickMs: 200,
    speedSteps: [1.25, 1.75, 2.25, 3.25],
    winScore: 40,
    wrap: true,
    obstacleCount: 9,
    missionIds: [
      "len8",
      "food5",
      "food8",
      "len12",
      "survive300t",
      "poison",
      "survive40s",
    ],
    missionCount: 3,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime", "poison"],
    foodCount: 3,
    hasTimeLimit: true,
    timeLimit: 150000,
    hasHealth: true,
    health: 3,
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
  survive300t: {
    text: "Survive 300 ticks",
    check: () => tickCount >= 300,
    reward: () => {
      score += 2;
    },
  },
  poison: {
    text: "Eat 3 poison food",
    check: () => poison >= 3,
    reward: () => {
      score += 15;
    },
  },
  survive40s: {
    text: "Survive for 40s",
    check: () => timeElapsedMs >= 40000,
    reward: () => addEffect("speed", 3000),
  },
};

const FOOD_TYPES = {
  normal: {
    color: "red",
    effect: () => {
      score++;
      foodEaten++;
      normal++;
    },
  },
  slow: {
    color: "#5c00f1",
    effect: () => {
      addEffect("slow", 5000);
      score += 1;
      foodEaten++;
      slow++;
    },
  },
  speed: {
    color: "#FFD23F",
    effect: () => {
      addEffect("speed", 5000);
      score += 2;
      foodEaten++;
      speed++;
    },
  },
  extraFood: {
    color: "#FF6B9D",
    effect: () => {
      score += 5;
      foodEaten++;
      extraFood++;
    },
  },
  extraTime: {
    color: "#2ECC71",
    effect: () => {
      timeRemainingMs += 10000;
      score++;
      foodEaten++;
      extraTime++;
    },
  },
  poison: {
    color: "#5c00f1",
    effect: () => {
      health--;
      score -= 3;
      foodEaten++;
      poison++;
    },
  },
};

const CELL_SIZE = 20;
const FOOD_DURATION_MS = 10000;

const RIGHT = { x: 1, y: 0 };
const LEFT = { x: -1, y: 0 };
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };

const board = document.getElementById("game-board");
board.style.position = "relative";
board.style.background = "black";
const levelSelect = document.getElementById("level-select");
const foodEl = document.getElementById("food");
const scoresEl = document.getElementById("scores");
const speedEl = document.getElementById("speed-up");
const missionsEl = document.getElementById("missions");
const tickCountEl = document.getElementById("tick-count");
const effectEl = document.getElementById("effects");
const timeEl = document.getElementById("time");
const healthEl = document.getElementById("health");

const snake = [];
let height = 20;

let foods = [];
let direction = RIGHT;
let score = 0;
let timer;
let tickCount = 0;
let foodEaten = 0;
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
let timeElapsedMs = 0;
let hasHealth = false;
let health = 0;

let normal = 0;
let slow = 0;
let speed = 0;
let extraFood = 0;
let extraTime = 0;
let poison = 0;

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
  return pool[Math.floor(roll * pool.length)];
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
    foods.splice(eatenIndex, 1, spawnRandom(FOOD_DURATION_MS));
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

  const outOfHealth = hasHealth && health <= 0;

  return hitWall || hitSelf || hitObstacle || outOfHealth;
}

function isGameWin() {
  return score >= winScore;
}

function getSpeed() {
  const index = Math.min(Math.floor(foodEaten / 3), speedSteps.length - 1);
  let currentSpeed = speedSteps[index];
  if (hasEffect("speed")) {
    currentSpeed *= 1.5;
  }
  if (hasEffect("slow")) {
    currentSpeed *= 0.5;
  }
  return currentSpeed;
}

function timeRemaining(timeElapsed) {
  if (!hasTimeLimit) return Infinity;
  return Math.max(0, timeLimit - timeElapsed);
}

function updateFoodDisplay() {
  foodEl.textContent = `Food eaten: ${foodEaten}`;
}

function updateScoreDisplay() {
  scoresEl.textContent = `Score: ${score}/${winScore}`;
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

function updateHealthDisplay() {
  if (!hasHealth) {
    healthEl.hidden = true;
    return;
  }

  healthEl.hidden = false;
  healthEl.textContent = `Health: ${Math.max(0, health)}`;
}

function updateDisplays() {
  updateFoodDisplay();
  updateScoreDisplay();
  updateSpeedDisplay();
  updateTickCountDisplay();
  updateMissionDisplay();
  updateEffectDisplay();
  updateTimeDisplay();
  updateHealthDisplay();
}

function createCell(x, y, color) {
  const cell = document.createElement("div");
  cell.style.position = "absolute";
  cell.style.left = `${x * CELL_SIZE}px`;
  cell.style.top = `${y * CELL_SIZE}px`;
  cell.style.width = `${CELL_SIZE}px`;
  cell.style.height = `${CELL_SIZE}px`;
  cell.style.background = color;
  return cell;
}

function draw() {
  const fragment = document.createDocumentFragment();

  obstacles.forEach((o) => fragment.appendChild(createCell(o.x, o.y, "gray")));
  foods.forEach((f) =>
    fragment.appendChild(createCell(f.x, f.y, FOOD_TYPES[f.type].color)),
  );
  snake.forEach((s) => fragment.appendChild(createCell(s.x, s.y, "green")));

  board.replaceChildren(fragment);
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
  const config = LEVELS[level];
  currentLevel = level;

  width = config.gridWidth;
  height = config.gridHeight;
  board.style.width = `${width * CELL_SIZE}px`;
  board.style.height = `${height * CELL_SIZE}px`;

  winScore = config.winScore;
  baseTickMs = config.baseTickMs;
  speedSteps = config.speedSteps;
  wrap = config.wrap;
  obstacleCount = config.obstacleCount;
  foodCount = config.foodCount || 1;

  missionPool = config.missionIds.map((id) => MISSIONS[id]);
  missionCount = config.missionCount;

  specialFood = config.specialFoodTypes;
  hasTimeLimit = config.hasTimeLimit;
  timeLimit = config.timeLimit;
  showEffects = config.showEffects;

  hasHealth = config.hasHealth;
  health = config.health;
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 });
  direction = RIGHT;
  score = 0;
  foodEaten = 0;
  tickCount = 0;
  foods = spawnFoods(foodCount, FOOD_DURATION_MS);

  obstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(spawnRandom(Infinity));
  }

  missions = pickMissions();
  effects = [];
  timeRemainingMs = timeLimit;
  lastTickTime = Date.now();
  timeElapsedMs = 0;
  normal = 0;
  slow = 0;
  speed = 0;
  extraFood = 0;
  extraTime = 0;
  poison = 0;
}

function startGame() {
  clearTimeout(timer);
  loadLevel(currentLevel);
  resetGame();
  draw();
  updateDisplays();
  scheduleTick();
}

function tick() {
  tickCount++;
  const now = Date.now();
  const delta = now - lastTickTime;
  lastTickTime = now;
  timeElapsedMs += delta;

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

  draw();

  updateDisplays();
  cleanupEffects();
  scheduleTick();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== DOWN) {
    direction = UP;
  }

  if (e.key === "ArrowDown" && direction !== UP) {
    direction = DOWN;
  }

  if (e.key === "ArrowLeft" && direction !== RIGHT) {
    direction = LEFT;
  }

  if (e.key === "ArrowRight" && direction !== LEFT) {
    direction = RIGHT;
  }
});

Object.keys(LEVELS).forEach((key) => {
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
