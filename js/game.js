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
  hasCombo: false,
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
    winScore: 100,
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
    timeLimit: 60000,
    hasHealth: true,
    health: 3,
    hasCombo: true,
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
    effect: () => {
      score += calcFoodScore(1);
      foodEaten++;
      normal++;
    },
  },
  slow: {
    effect: () => {
      addEffect("slow", 5000);
      score += calcFoodScore(1);
      foodEaten++;
      slow++;
    },
  },
  speed: {
    effect: () => {
      addEffect("speed", 5000);
      score += calcFoodScore(1);
      foodEaten++;
      speed++;
    },
  },
  extraFood: {
    effect: () => {
      score += calcFoodScore(5);
      foodEaten++;
      extraFood++;
    },
  },
  extraTime: {
    effect: () => {
      timeRemainingMs += 10000;
      score += calcFoodScore(2);
      foodEaten++;
      extraTime++;
    },
  },
  poison: {
    effect: () => {
      health--;
      score -= calcFoodScore(2);
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

const levelButtons = document.getElementById("level-buttons");
const foodEl = document.getElementById("food");
const scoresEl = document.getElementById("scores");
const speedEl = document.getElementById("speed-up");
const missionsEl = document.getElementById("missions");
const tickCountEl = document.getElementById("tick-count");
const effectEl = document.getElementById("effects");
const timeEl = document.getElementById("time");
const healthEl = document.getElementById("health");
const comboMultiplierEl = document.getElementById("combo-multiplier");
const comboDurationEl = document.getElementById("combo-duration");

const snake = [];
let cells = [];
let height = 20;
let width = 20;

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
let hasCombo = false;
let combo = 0;
let comboEndsAt = 0;
const COMBO_DURATION_MS = 5000;
const MAX_COMBO = 5;

let normal = 0;
let slow = 0;
let speed = 0;
let extraFood = 0;
let extraTime = 0;
let poison = 0;

// draw
function drawBoard() {
  board.replaceChildren();
  board.style.gridTemplateColumns = `repeat(${width}, ${CELL_SIZE}px)`;

  cells = Array.from({ length: width }, () => []);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${CELL_SIZE}px`;
      cell.style.height = `${CELL_SIZE}px`;
      cells[x][y] = cell;
      board.appendChild(cell);
    }
  }
}

function getCell(x, y) {
  return cells[x][y];
}

function addClass(pos, classname) {
  getCell(pos.x, pos.y).classList.add(classname);
}

function removeClass(pos, classname) {
  getCell(pos.x, pos.y).classList.remove(classname);
}

function renderSnake() {
  snake.forEach((s) => {
    addClass(s, "snake");
  });
}

function renderFoods() {
  foods.forEach((f) => {
    showFood(f);
  });
}

function showFood(food) {
  const cell = getCell(food.x, food.y);
  cell.classList.add("food", `food-${food.type}`);
}

function hideFood(food) {
  const cell = getCell(food.x, food.y);
  cell.classList.remove("food", `food-${food.type}`);
}

function renderObstacles() {
  obstacles.forEach((o) => {
    addClass(o, "obstacle");
  });
}

function getNextSnakeHead(direction) {
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  if (wrap) {
    if (newHead.x < 0) newHead.x = width - 1;
    if (newHead.x >= width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = height - 1;
    if (newHead.y >= height) newHead.y = 0;
  }

  return newHead;
}

function increaseCombo() {
  if (!hasCombo) return;
  combo = Math.min(combo + 1, MAX_COMBO);
  comboEndsAt = Date.now() + COMBO_DURATION_MS;
}

function eatFood(food) {
  increaseCombo();
  FOOD_TYPES[food.type].effect();
  replaceFood(food);
}

function moveSnake(direction) {
  const newHead = getNextSnakeHead(direction);

  snake.unshift(newHead);

  const eatenFood = foods.find((f) => f.x === newHead.x && f.y === newHead.y);

  if (eatenFood) {
    eatFood(eatenFood);
  } else {
    snake.pop();
  }
}

function renderSnake() {
  board.querySelectorAll(".snake").forEach((cell) => {
    cell.classList.remove("snake");
  });
  snake.forEach((segment) => addClass(segment, "snake"));
}

function render() {
  renderSnake();
  renderFoods();
  renderObstacles();
}

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
    result.timeoutId = setTimeout(() => replaceFood(result), durationMs);
  }
  return result;
}

function replaceFood(oldFood) {
  const index = foods.indexOf(oldFood);
  if (index === -1) return;

  clearTimeout(oldFood.timeoutId);
  hideFood(oldFood);

  const newFood = spawnRandom(FOOD_DURATION_MS);
  foods[index] = newFood;
  showFood(newFood);
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

function checkCombo() {
  if (combo > 0 && Date.now() >= comboEndsAt) {
    combo = 0;
  }
}

function getComboMultiplier() {
  return Math.max(1, combo);
}

function calcFoodScore(points) {
  return points * getComboMultiplier();
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

function updateComboDisplay() {
  if (!hasCombo) {
    comboMultiplierEl.hidden = true;
    comboDurationEl.hidden = true;
    return;
  }
  comboMultiplierEl.hidden = false;
  comboDurationEl.hidden = false;
  comboMultiplierEl.textContent = `Combo: ${combo}`;
  const remainingMs = Math.max(0, comboEndsAt - Date.now());
  comboDurationEl.textContent = `Duration: ${Math.ceil(remainingMs / 1000)}s`;
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
  updateComboDisplay();
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

  hasCombo = config.hasCombo;
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

  combo = 0;
  comboEndsAt = 0;
}

function startGame() {
  clearTimeout(timer);
  foods.forEach((food) => clearTimeout(food.timeoutId));

  loadLevel(currentLevel);
  updateLevelButtons();
  drawBoard();
  resetGame();

  renderSnake();
  renderFoods();
  renderObstacles();

  updateDisplays();
  scheduleTick();
}

function tick() {
  tickCount++;
  const now = Date.now();
  const delta = now - lastTickTime;
  lastTickTime = now;
  timeElapsedMs += delta;

  checkCombo();

  if (hasTimeLimit) {
    timeRemainingMs -= delta;
  }

  moveSnake(direction);

  if (isGameOver()) {
    alert("Game Over!");
    startGame();
    return;
  }

  renderSnake();

  updateMissions();

  if (isGameWin()) {
    alert("You Win!");
    startGame();
    return;
  }

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

levelButtons.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  currentLevel = Number(button.dataset.level);
  button.blur();
  startGame();
});

function updateLevelButtons() {
  levelButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.level) === currentLevel,
    );
  });
}

startGame();
