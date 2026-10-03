# Snake Game

A classic Snake game built entirely with **HTML, CSS, and Vanilla JavaScript**.

The game contains **6 progressive levels**, with each level introducing new gameplay mechanics and gradually increasing the difficulty.

## Features

* Classic Snake gameplay
* 6 progressive levels
* Increasing difficulty
* Score system
* Collision detection
* Different types of food
* Temporary gameplay effects
* Static and moving obstacles
* Portal teleportation
* Level progression

## Levels

### Level 1 — Classic Snake

The base version of the game.

**Gameplay:**

* Control the Snake using the keyboard.
* Eat food to increase the Snake's length.
* Gain points from eating food.
* The game ends when the Snake hits the wall or itself.

**New mechanics:** None

---

### Level 2 — Speed Up

Introduces a speed progression mechanic.

**New mechanic:**

* The Snake becomes faster as the score increases.
* Higher scores require faster reaction times.

Example:

```text
Score 0   → Normal Speed
Score 5   → Faster
Score 10  → Very Fast
Score 15  → Extreme Speed
```

**New mechanics:** 1

* Speed progression

---

### Level 3 — Obstacles

Introduces static obstacles on the game board.

**New mechanic:**

* Obstacles are placed at different locations.
* The Snake must avoid them.
* Hitting an obstacle results in Game Over.

The Snake can collide with:

* Walls
* Its own body
* Obstacles

**New mechanics:** 1

* Static obstacles

---

### Level 4 — Special Food

Introduces different types of food with unique effects.

#### Normal Food

```text
+10 Score
+1 Snake Length
```

#### Speed Food

Temporarily increases Snake speed.

```text
Effect Duration: 5 seconds
```

#### Slow Food

Temporarily decreases Snake speed.

```text
Effect Duration: 5 seconds
```

#### Bonus Food

Provides additional score.

```text
+50 Score
```

**New mechanics:** 2

* Special food
* Temporary effects

---

### Level 5 — Moving Obstacles

Introduces moving obstacles while keeping the mechanics from Level 4.

**New mechanics:**

* Some obstacles move automatically.
* The Snake must avoid both static and moving obstacles.
* Moving obstacles create additional collision challenges.

The level combines:

* Speed progression
* Static obstacles
* Special food
* Temporary effects
* Moving obstacles

**New mechanics:** 2

* Moving obstacles
* Dynamic collision detection

---

### Level 6 — Portal

The final level combines the previous mechanics and introduces portals.

**New mechanic:**

When the Snake enters a portal, it is teleported to another portal.

```text
Portal A → Portal B
```

A short cooldown can be applied to prevent continuous teleportation.

The final level combines:

* Increasing Snake speed
* Static obstacles
* Special food
* Temporary effects
* Moving obstacles
* Portal teleportation

**New mechanics:** 3

* Special food
* Moving obstacles
* Portal teleportation

## Level Progression

```text
Level 1
Classic Snake
    |
    v
Level 2
+ Speed Up
    |
    v
Level 3
+ Static Obstacles
    |
    v
Level 4
+ Special Food
+ Temporary Effects
    |
    v
Level 5
+ Moving Obstacles
+ Dynamic Collision
    |
    v
Level 6
+ Portal
+ Previous Mechanics
```

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript

No frameworks or external game engines are used.

## Project Structure

```text
snake-game/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── game.js
│   ├── snake.js
│   ├── food.js
│   ├── obstacle.js
│   └── level.js
├── assets/
│   └── ...
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/your-username/snake-game.git
```

Open the project directory:

```bash
cd snake-game
```

Open `index.html` in a web browser.

No build tools or dependencies are required.

## Project Goals

This project is created to practice:

* JavaScript fundamentals
* DOM manipulation
* Event handling
* Game loops
* Collision detection
* State management
* Timers and intervals
* Object-oriented game design
* Progressive game difficulty

## Future Improvements

Possible future additions:

* Sound effects
* Background music
* High-score system
* Pause and resume
* Multiple game modes
* Responsive mobile controls
* Local Storage for saving progress
* Leaderboard
* Custom Snake skins
* Additional levels

## License

This project is created for learning and educational purposes.
