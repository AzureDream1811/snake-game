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
  hasMovingObstacles: false,
  hasHazards: false,
  maxHazards: 0,
  hazardSpawnEveryTicks: 0,
  hasMana: false,
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
    gridWidth: 25,
    gridHeight: 25,
    baseTickMs: 200,
    speedSteps: [1, 1.5, 2, 3],
    winScore: 50,
    wrap: true,
    obstacleCount: 6,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime", "poison"],
    foodCount: 2,
    hasTimeLimit: true,
    timeLimit: 90000,
  },
  4: {
    ...DEFAULT_LEVEL,
    gridWidth: 30,
    gridHeight: 30,
    baseTickMs: 200,
    speedSteps: [1.25, 1.75, 2.25, 3.25],
    winScore: 80,
    wrap: true,
    obstacleCount: 4,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime", "poison"],
    foodCount: 3,
    hasHealth: true,
    health: 3,
    hasCombo: true,
    hasMovingObstacles: true,
    numberOfMovingObstacles: 3,
  },
  5: {
    ...DEFAULT_LEVEL,
    gridWidth: 30,
    gridHeight: 30,
    baseTickMs: 180,
    speedSteps: [1.5, 2, 2.5, 3.5],
    winScore: 100,
    wrap: true,
    obstacleCount: 6,
    showEffects: true,
    specialFoodTypes: ["slow", "speed", "extraFood", "extraTime", "poison"],
    foodCount: 3,
    hasTimeLimit: true,
    timeLimit: 120000,
    hasCombo: true,
    hasHazards: true,
    maxHazards: 3,
    hazardSpawnEveryTicks: 30,
    hasMana: true,
  },
};

const MISSIONS = {
  len8: {
    text: "Reach length 8",
    check() {
      return snake.length >= 8;
    },
    reward() {
      addEffect("speed", 5000);
    },
  },
  food5: {
    text: "Collect 5 food",
    check() {
      return foodEaten >= 5;
    },
    reward() {
      score += 5;
    },
  },
  food8: {
    text: "Collect 8 food",
    check() {
      return foodEaten >= 8;
    },
    reward() {
      addEffect("speed", 3000);
    },
  },
  len12: {
    text: "Reach length 12",
    check() {
      return snake.length >= 12;
    },
    reward() {
      score += 10;
    },
  },
  survive300t: {
    text: "Survive 300 ticks",
    check() {
      return tickCount >= 300;
    },
    reward() {
      score += 2;
    },
  },
  poison: {
    text: "Eat 3 poison food",
    check() {
      return eatenCount.poison >= 3;
    },
    reward() {
      score += 15;
    },
  },
  survive40s: {
    text: "Survive for 40s",
    check() {
      return timeElapsedMs >= 40000;
    },
    reward() {
      addEffect("speed", 3000);
    },
  },
};

const FOOD_TYPES = {
  normal: {
    effect() {
      score += calcFoodScore(1);
      foodEaten++;
      eatenCount.normal++;
    },
  },
  slow: {
    effect() {
      addEffect("slow", 5000);
      score += calcFoodScore(1);
      foodEaten++;
      eatenCount.slow++;
    },
  },
  speed: {
    effect() {
      addEffect("speed", 5000);
      score += calcFoodScore(1);
      foodEaten++;
      eatenCount.speed++;
    },
  },
  extraFood: {
    effect() {
      score += calcFoodScore(5);
      foodEaten++;
      eatenCount.extraFood++;
    },
  },
  extraTime: {
    effect() {
      timeRemainingMs += 10000;
      score += calcFoodScore(2);
      foodEaten++;
      eatenCount.extraTime++;
    },
  },
  poison: {
    effect() {
      health--;
      score -= calcFoodScore(2);
      foodEaten++;
      eatenCount.poison++;
    },
  },
};

const CELL_SIZE = 20;
const FOOD_DURATION_MS = 10000;
const SAFE_SPAWN_DISTANCE = 5;
const OBSTACLE_SAFE_DISTANCE = 3;
const COMBO_DURATION_MS = 5000;
const MAX_COMBO = 5;
const HAZARD_SIZE = 3;
const HAZARD_SAFE_DISTANCE = 3;
const HAZARD_WARNING_TICKS = 10;
const HAZARD_ACTIVE_TICKS = 60;
const INFECTED_DURATION_MS = 3000;
const MAX_MANA = 100;
const START_MANA = 50;
const MANA_PER_FOOD = 10;
const MANA_REGEN_PER_TICK = 0.25;
const SHIELD_COST = 50;
const SHIELD_DURATION_MS = 3000;

const RIGHT = { x: 1, y: 0 };
const LEFT = { x: -1, y: 0 };
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };

var board = document.getElementById("game-board");
var levelButtons = document.getElementById("level-buttons");
var foodEl = document.getElementById("food");
var scoresEl = document.getElementById("scores");
var speedEl = document.getElementById("speed-up");
var missionsEl = document.getElementById("missions");
var tickCountEl = document.getElementById("tick-count");
var effectEl = document.getElementById("effects");
var timeEl = document.getElementById("time");
var healthEl = document.getElementById("health");
var comboMultiplierEl = document.getElementById("combo-multiplier");
var comboDurationEl = document.getElementById("combo-duration");
var manaEl = document.getElementById("mana");

var boardCells = [];
var boardWidth = 20;
var boardHeight = 20;

var currentLevel = 1;
var currentConfig = LEVELS[1];

var winScore = 10;
var baseTickMs = 300;
var speedSteps = [1, 1.25, 1.5, 2];
var wrap = false;
var foodCount = 1;
var obstacleCount = 0;
var missionCount = 0;
var missionPool = [];
var showEffects = false;
var hasTimeLimit = false;
var timeLimit = 0;
var hasHealth = false;
var hasCombo = false;
var hasMovingObstacles = false;
var numberOfMovingObstacles = 0;
var hasHazards = false;
var maxHazards = 0;
var hazardSpawnEveryTicks = 0;
var hasMana = false;

var tickTimer = null;
var tickCount = 0;
var lastTickTime = 0;
var timeElapsedMs = 0;
var timeRemainingMs = 0;

var snake = [];
var snakeDirection = RIGHT;
var foods = [];
var obstacles = [];
var movingObstacles = [];
var hazards = [];

var score = 0;
var foodEaten = 0;
var eatenCount = {
  normal: 0,
  slow: 0,
  speed: 0,
  extraFood: 0,
  extraTime: 0,
  poison: 0,
};
var health = 0;
var combo = 0;
var comboEndsAt = 0;
var mana = 0;
var effects = [];
var missions = [];

function isSamePos(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function containsPos(list, pos) {
  for (const item of list) {
    if (isSamePos(item, pos)) return true;
  }
  return false;
}

function findFoodAt(pos) {
  for (const food of foods) {
    if (isSamePos(food, pos)) return food;
  }
  return null;
}

function isInsideBoard(pos) {
  return pos.x >= 0 && pos.x < boardWidth && pos.y >= 0 && pos.y < boardHeight;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * boardWidth),
    y: Math.floor(Math.random() * boardHeight),
  };
}

function isNearSnakeHead(pos, distance) {
  const head = snake[0];
  const dx = Math.abs(pos.x - head.x);
  const dy = Math.abs(pos.y - head.y);
  return Math.max(dx, dy) <= distance;
}

function isOccupied(pos) {
  return (
    containsPos(snake, pos) ||
    containsPos(obstacles, pos) ||
    containsPos(movingObstacles, pos) ||
    containsPos(foods, pos)
  );
}

function drawBoard() {
  board.replaceChildren();
  board.style.gridTemplateColumns = `repeat(${boardWidth}, ${CELL_SIZE}px)`;

  boardCells = [];
  for (let x = 0; x < boardWidth; x++) {
    boardCells.push([]);
  }

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${CELL_SIZE}px`;
      cell.style.height = `${CELL_SIZE}px`;
      boardCells[x][y] = cell;
      board.appendChild(cell);
    }
  }
}

function getCell(pos) {
  return boardCells[pos.x][pos.y];
}

function addClass(pos, classname) {
  getCell(pos).classList.add(classname);
}

function renderCells(classname, positions) {
  const marked = board.querySelectorAll(`.${classname}`);
  for (const cell of marked) {
    cell.classList.remove(classname);
  }
  for (const pos of positions) {
    addClass(pos, classname);
  }
}

function showFood(food) {
  getCell(food).classList.add("food", `food-${food.type}`);
}

function hideFood(food) {
  getCell(food).classList.remove("food", `food-${food.type}`);
}

function renderSnake() {
  renderCells("snake", snake);
}

function renderFoods() {
  for (const food of foods) {
    showFood(food);
  }
}

function renderObstacles() {
  renderCells("obstacle", obstacles);
}

function renderMovingObstacles() {
  renderCells("moving-obstacle", movingObstacles);
}

function renderHazards() {
  const warningCells = [];
  const activeCells = [];

  for (const hazard of hazards) {
    const target =
      getHazardPhase(hazard) === "warning" ? warningCells : activeCells;
    for (const cell of hazard.cells) {
      target.push(cell);
    }
  }

  renderCells("hazard-warning", warningCells);
  renderCells("hazard-active", activeCells);
}

function renderAll() {
  renderSnake();
  renderFoods();
  renderObstacles();
  renderMovingObstacles();
  renderHazards();
}

function pickFoodType() {
  const pool = currentConfig.specialFoodTypes;

  if (pool.length === 0) return "normal";
  if (Math.random() < 0.7) return "normal";

  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnFood() {
  let pos = getRandomPosition();
  while (isOccupied(pos)) {
    pos = getRandomPosition();
  }

  const food = { x: pos.x, y: pos.y, type: pickFoodType() };
  food.timeoutId = setTimeout(function () {
    replaceFood(food);
  }, FOOD_DURATION_MS);

  return food;
}

function spawnFoods(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(spawnFood());
  }
  return result;
}

function replaceFood(oldFood) {
  const index = foods.indexOf(oldFood);
  if (index === -1) return;

  clearTimeout(oldFood.timeoutId);
  hideFood(oldFood);

  const newFood = spawnFood();
  foods[index] = newFood;
  showFood(newFood);
}

function spawnObstacle() {
  let pos = getRandomPosition();
  while (isOccupied(pos) || isNearSnakeHead(pos, OBSTACLE_SAFE_DISTANCE)) {
    pos = getRandomPosition();
  }
  return { x: pos.x, y: pos.y };
}

function spawnMovingObstacle() {
  let pos = getRandomPosition();
  while (isOccupied(pos) || isNearSnakeHead(pos, SAFE_SPAWN_DISTANCE)) {
    pos = getRandomPosition();
  }

  const directions = [UP, DOWN, LEFT, RIGHT];
  const randomDirection =
    directions[Math.floor(Math.random() * directions.length)];

  return { x: pos.x, y: pos.y, direction: randomDirection };
}

function createHazardCells(start) {
  const hazardCells = [];
  for (let dy = 0; dy < HAZARD_SIZE; dy++) {
    for (let dx = 0; dx < HAZARD_SIZE; dx++) {
      hazardCells.push({ x: start.x + dx, y: start.y + dy });
    }
  }
  return hazardCells;
}

function canPlaceHazard(hazardCells) {
  for (const cell of hazardCells) {
    if (!isInsideBoard(cell)) return false;
    if (isOccupied(cell)) return false;
    if (isNearSnakeHead(cell, HAZARD_SAFE_DISTANCE)) return false;
  }
  return true;
}

function spawnHazard() {
  let hazardCells = createHazardCells(getRandomPosition());
  while (!canPlaceHazard(hazardCells)) {
    hazardCells = createHazardCells(getRandomPosition());
  }
  return { cells: hazardCells, bornTick: tickCount };
}

function getNextSnakeHead() {
  const head = snake[0];
  const newHead = {
    x: head.x + snakeDirection.x,
    y: head.y + snakeDirection.y,
  };

  if (wrap) {
    if (newHead.x < 0) newHead.x = boardWidth - 1;
    if (newHead.x >= boardWidth) newHead.x = 0;
    if (newHead.y < 0) newHead.y = boardHeight - 1;
    if (newHead.y >= boardHeight) newHead.y = 0;
  }

  return newHead;
}

function moveSnake() {
  const newHead = getNextSnakeHead();
  snake.unshift(newHead);

  const eatenFood = findFoodAt(newHead);
  if (eatenFood) {
    eatFood(eatenFood);
  } else {
    snake.pop();
  }
}

function eatFood(food) {
  increaseCombo();
  addMana(MANA_PER_FOOD);
  FOOD_TYPES[food.type].effect();
  replaceFood(food);
}

function canMovingObstacleEnter(pos) {
  return isInsideBoard(pos) && !isOccupied(pos);
}

function moveMovingObstacle(obstacle) {
  const next = {
    x: obstacle.x + obstacle.direction.x,
    y: obstacle.y + obstacle.direction.y,
  };

  if (canMovingObstacleEnter(next)) {
    obstacle.x = next.x;
    obstacle.y = next.y;
  } else {
    obstacle.direction = {
      x: -obstacle.direction.x,
      y: -obstacle.direction.y,
    };
  }
}

function moveMovingObstacles() {
  for (const obstacle of movingObstacles) {
    moveMovingObstacle(obstacle);
  }
}

function getHazardPhase(hazard) {
  const age = tickCount - hazard.bornTick;
  if (age < HAZARD_WARNING_TICKS) return "warning";
  if (age < HAZARD_WARNING_TICKS + HAZARD_ACTIVE_TICKS) return "active";
  return "expired";
}

function isInActiveHazard(pos) {
  for (const hazard of hazards) {
    if (getHazardPhase(hazard) === "active" && containsPos(hazard.cells, pos)) {
      return true;
    }
  }
  return false;
}

function updateHazards() {
  if (!hasHazards) return;

  const aliveHazards = [];
  for (const hazard of hazards) {
    if (getHazardPhase(hazard) !== "expired") {
      aliveHazards.push(hazard);
    }
  }
  hazards = aliveHazards;

  const isSpawnTick = tickCount % hazardSpawnEveryTicks === 0;
  if (isSpawnTick && hazards.length < maxHazards) {
    hazards.push(spawnHazard());
  }
}

function applyHazard() {
  if (hasEffect("shield")) return;
  if (!isInActiveHazard(snake[0])) return;

  addEffect("infected", INFECTED_DURATION_MS);
  combo = 0;
}

function isEffectActive(effect) {
  return effect.endsAt > Date.now();
}

function addEffect(type, durationMs) {
  effects.push({ type, endsAt: Date.now() + durationMs });
}

function hasEffect(type) {
  for (const effect of effects) {
    if (effect.type === type && isEffectActive(effect)) return true;
  }
  return false;
}

function cleanupEffects() {
  const activeEffects = [];
  for (const effect of effects) {
    if (isEffectActive(effect)) {
      activeEffects.push(effect);
    }
  }
  effects = activeEffects;
}

function addMana(amount) {
  if (!hasMana) return;

  mana = Math.min(mana + amount, MAX_MANA);
}

function useShield() {
  if (!hasMana || hasEffect("shield") || mana < SHIELD_COST) return;

  mana -= SHIELD_COST;
  addEffect("shield", SHIELD_DURATION_MS);
}

function increaseCombo() {
  if (!hasCombo) return;

  combo = Math.min(combo + 1, MAX_COMBO);
  comboEndsAt = Date.now() + COMBO_DURATION_MS;
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

function getSpeed() {
  const index = Math.min(Math.floor(foodEaten / 3), speedSteps.length - 1);
  let currentSpeed = speedSteps[index];

  if (hasEffect("speed")) currentSpeed *= 1.5;
  if (hasEffect("slow")) currentSpeed *= 0.5;
  if (hasEffect("infected")) currentSpeed *= 0.6;

  return currentSpeed;
}

function pickMissions() {
  const pool = missionPool.slice();
  const picked = [];

  while (picked.length < missionCount && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const mission = pool.splice(index, 1)[0];
    picked.push({
      text: mission.text,
      check: mission.check,
      reward: mission.reward,
      done: false,
    });
  }

  return picked;
}

function updateMissions() {
  for (const mission of missions) {
    if (!mission.done && mission.check()) {
      mission.done = true;
      mission.reward();
    }
  }
}

function hasHitWall(pos) {
  return !wrap && !isInsideBoard(pos);
}

function hasHitSelf(pos) {
  for (let i = 1; i < snake.length; i++) {
    if (isSamePos(snake[i], pos)) return true;
  }
  return false;
}

function hasHitObstacle(pos) {
  return containsPos(obstacles, pos) || containsPos(movingObstacles, pos);
}

function isGameOver() {
  const head = snake[0];

  if (hasHitWall(head) || hasHitSelf(head)) return true;

  if (hasHitObstacle(head) && !hasEffect("shield")) {
    if (!hasHealth) return true;
    health--;
  }

  if (hasTimeLimit && timeRemainingMs <= 0) return true;
  if (hasHealth && health <= 0) return true;

  return false;
}

function isGameWin() {
  return score >= winScore;
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

  const names = [];
  for (const effect of effects) {
    if (isEffectActive(effect)) {
      names.push(effect.type);
    }
  }
  effectEl.textContent = `Current Effects: ${names.join(", ") || "none"}`;
}

function updateMissionDisplay() {
  missionsEl.replaceChildren();
  for (const mission of missions) {
    const item = document.createElement("li");
    item.textContent = `${mission.done ? "[x]" : "[ ]"} ${mission.text}`;
    missionsEl.appendChild(item);
  }
}

function updateTimeDisplay() {
  timeEl.hidden = !hasTimeLimit;
  if (!hasTimeLimit) return;

  const seconds = Math.ceil(Math.max(0, timeRemainingMs) / 1000);
  timeEl.textContent = `Remaining: ${seconds}s`;
}

function updateHealthDisplay() {
  healthEl.hidden = !hasHealth;
  if (!hasHealth) return;

  healthEl.textContent = `Health: ${Math.max(0, health)}`;
}

function updateComboDisplay() {
  comboMultiplierEl.hidden = !hasCombo;
  comboDurationEl.hidden = !hasCombo;
  if (!hasCombo) return;

  const remainingMs = Math.max(0, comboEndsAt - Date.now());
  comboMultiplierEl.textContent = `Combo: ${combo}`;
  comboDurationEl.textContent = `Duration: ${Math.ceil(remainingMs / 1000)}s`;
}

function updateManaDisplay() {
  manaEl.hidden = !hasMana;
  if (!hasMana) return;

  manaEl.textContent = `Mana: ${Math.floor(mana)}/${MAX_MANA}`;
}

function updateLevelButtons() {
  const buttons = levelButtons.querySelectorAll("button");
  for (const button of buttons) {
    const isActive = Number(button.dataset.level) === currentLevel;
    button.classList.toggle("active", isActive);
  }
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
  updateManaDisplay();
}

function loadLevel(level) {
  currentConfig = LEVELS[level];

  boardWidth = currentConfig.gridWidth;
  boardHeight = currentConfig.gridHeight;

  winScore = currentConfig.winScore;
  baseTickMs = currentConfig.baseTickMs;
  speedSteps = currentConfig.speedSteps;
  wrap = currentConfig.wrap;
  foodCount = currentConfig.foodCount || 1;
  obstacleCount = currentConfig.obstacleCount;
  showEffects = currentConfig.showEffects;

  missionPool = [];
  for (const id of currentConfig.missionIds) {
    missionPool.push(MISSIONS[id]);
  }
  missionCount = currentConfig.missionCount;

  hasTimeLimit = currentConfig.hasTimeLimit;
  timeLimit = currentConfig.timeLimit;

  hasHealth = currentConfig.hasHealth;
  health = currentConfig.health || 0;

  hasCombo = currentConfig.hasCombo;

  hasMovingObstacles = currentConfig.hasMovingObstacles;
  numberOfMovingObstacles = currentConfig.numberOfMovingObstacles || 0;

  hasHazards = currentConfig.hasHazards;
  maxHazards = currentConfig.maxHazards;
  hazardSpawnEveryTicks = currentConfig.hazardSpawnEveryTicks;

  hasMana = currentConfig.hasMana;
}

function resetGame() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];
  snakeDirection = RIGHT;

  tickCount = 0;
  lastTickTime = Date.now();
  timeElapsedMs = 0;
  timeRemainingMs = timeLimit;

  score = 0;
  foodEaten = 0;
  eatenCount = {
    normal: 0,
    slow: 0,
    speed: 0,
    extraFood: 0,
    extraTime: 0,
    poison: 0,
  };
  combo = 0;
  comboEndsAt = 0;
  mana = hasMana ? START_MANA : 0;
  effects = [];

  foods = [];
  obstacles = [];
  movingObstacles = [];
  hazards = [];

  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(spawnObstacle());
  }

  if (hasMovingObstacles) {
    for (let i = 0; i < numberOfMovingObstacles; i++) {
      movingObstacles.push(spawnMovingObstacle());
    }
  }

  foods = spawnFoods(foodCount);
  missions = pickMissions();
}

function scheduleTick() {
  tickTimer = setTimeout(tick, baseTickMs / getSpeed());
}

function startGame() {
  clearTimeout(tickTimer);
  for (const food of foods) {
    clearTimeout(food.timeoutId);
  }

  loadLevel(currentLevel);
  updateLevelButtons();
  drawBoard();
  resetGame();

  renderAll();
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

  checkCombo();
  addMana(MANA_REGEN_PER_TICK);

  moveSnake();
  applyHazard();

  if (isGameOver()) {
    alert("Game Over!");
    startGame();
    return;
  }

  moveMovingObstacles();
  updateHazards();

  renderSnake();
  renderMovingObstacles();
  renderHazards();
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

function handleKeydown(e) {
  if (e.key === " ") {
    e.preventDefault();
    useShield();
  }

  if ((e.key === "ArrowUp" || e.key === "w") && snakeDirection !== DOWN) {
    snakeDirection = UP;
  }

  if ((e.key === "ArrowDown" || e.key === "s") && snakeDirection !== UP) {
    snakeDirection = DOWN;
  }

  if ((e.key === "ArrowLeft" || e.key === "a") && snakeDirection !== RIGHT) {
    snakeDirection = LEFT;
  }

  if ((e.key === "ArrowRight" || e.key === "d") && snakeDirection !== LEFT) {
    snakeDirection = RIGHT;
  }
}

function handleLevelClick(e) {
  const button = e.target.closest("button");
  if (!button) return;

  currentLevel = Number(button.dataset.level);
  button.blur();
  startGame();
}

document.addEventListener("keydown", handleKeydown);
levelButtons.addEventListener("click", handleLevelClick);

startGame();
