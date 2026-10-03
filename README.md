# Snake Game

A classic Snake game built entirely with **HTML, CSS, and Vanilla JavaScript**.

The game consists of **6 progressive levels**. Each level introduces new gameplay logic and gradually increases the complexity of the game.

## Features

* Classic Snake gameplay
* 6 progressive levels
* Keyboard controls
* Score system
* Collision detection
* Dynamic game speed
* Wrap-around map behavior
* Static and moving obstacles
* Multiple food types
* Temporary gameplay effects
* Score multiplier
* Dynamic map
* Enemy Snake AI
* Game Over and restart system

## Levels

### Level 1 — Classic Snake

The base version of the game.

**Core mechanics:**

* Snake movement
* Keyboard controls
* Food spawning
* Snake growth
* Score system
* Wall collision
* Self collision
* Game Over
* Restart

This level establishes the core game loop, game state, rendering, input handling, and collision system used by the following levels.

---

### Level 2 — Speed and Wrap-around

Introduces two new mechanics.

#### 1. Dynamic Speed

The Snake becomes faster as the game progresses.

Speed can increase based on score or the number of food items collected.

Example:

```text
Score 0   → 200ms
Score 5   → 180ms
Score 10  → 160ms
Score 15  → 140ms
```

#### 2. Wrap-around

Instead of causing Game Over, crossing one edge of the map moves the Snake to the opposite side.

```text
Right edge → Left edge
Left edge  → Right edge
Top edge   → Bottom edge
Bottom edge → Top edge
```

**New mechanics:** 2

* Dynamic speed
* Wrap-around movement

---

### Level 3 — Obstacles and Special Food

Introduces two new mechanics.

#### 1. Static Obstacles

Static obstacles are placed on the game board.

The Snake must avoid:

* Walls
* Its own body
* Obstacles

Collision with an obstacle causes Game Over.

#### 2. Special Food

Different types of food provide different effects.

Example:

```text
Normal Food
+10 Score
+1 Length

Bonus Food
+50 Score

Poison Food
Decrease Snake Length
```

Each food type has its own behavior and effect.

**New mechanics:** 2

* Static obstacles
* Special food

---

### Level 4 — Dynamic Obstacles and Effects

Introduces three new mechanics.

#### 1. Moving Obstacles

Some obstacles move automatically across the map.

The Snake must continuously adapt to changing obstacle positions.

#### 2. Temporary Food Effects

Some food applies an effect for a limited amount of time.

Example:

```text
Speed Boost
Duration: 5 seconds

Slow
Duration: 3 seconds
```

Effects automatically expire after their duration ends.

#### 3. Score Multiplier

The player can activate a score multiplier.

Example:

```text
Normal:
10 × 1 = 10

Multiplier:
10 × 3 = 30
```

The final score is calculated based on the base food value and the current multiplier.

**New mechanics:** 3

* Moving obstacles
* Temporary effects
* Score multiplier

---

### Level 5 — Dynamic Map

Introduces one complex mechanic: **Dynamic Map**.

The map changes while the game is running.

Possible changes include:

* Obstacles appearing
* Obstacles disappearing
* Obstacles changing position
* Paths becoming blocked
* Paths becoming available

Example:

```text
Initial State

┌────────────────────┐
│                    │
│      ████          │
│                    │
│        Snake       │
│                    │
└────────────────────┘
```

Later:

```text
Updated State

┌────────────────────┐
│                    │
│      ████          │
│                    │
│        Snake   ███ │
│                    │
└────────────────────┘
```

The collision system must always use the current state of the map.

**New mechanics:** 1 complex mechanic

* Dynamic map transformation

---

### Level 6 — Enemy Snake AI

Introduces one complex mechanic: **Enemy Snake AI**.

An AI-controlled Snake is added to the game.

The Enemy Snake can:

* Move independently
* Select a target
* Navigate through the game board
* Avoid obstacles
* Interact with food
* Interact with the player's Snake

A simple version can prioritize reaching food:

```text
Food
  ↓
Find path
  ↓
Move toward target
```

A more advanced version can allow the Enemy Snake to make decisions based on the player's position.

Possible pathfinding algorithms include:

* Breadth-First Search (BFS)
* Other grid-based pathfinding approaches

**New mechanics:** 1 complex mechanic

* Enemy Snake AI

---

## Level Progression

```text
Level 1
Classic Snake
    |
    v
Level 2
+ Dynamic Speed
+ Wrap-around
    |
    v
Level 3
+ Static Obstacles
+ Special Food
    |
    v
Level 4
+ Moving Obstacles
+ Temporary Effects
+ Score Multiplier
    |
    v
Level 5
+ Dynamic Map
    |
    v
Level 6
+ Enemy Snake AI
```

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript

No frameworks, game engines, or backend services are required.

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
│   ├── input.js
│   └── level.js
├── assets/
│   └── ...
└── README.md
```

The structure may evolve as the game becomes more complex.

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

This project is primarily created to practice JavaScript and game development fundamentals, including:

* JavaScript syntax and data structures
* Arrays and objects
* Functions
* Event handling
* DOM and Canvas API
* Game loops
* State management
* Collision detection
* Coordinate systems
* Timers and intervals
* Randomization
* Dynamic game mechanics
* Pathfinding and basic AI

## Development Approach

The game is developed incrementally.

Each level is implemented and tested before introducing the mechanics of the next level.

The main priority is:

1. Correct game logic
2. Reliable state management
3. Clean and maintainable code
4. Testable game mechanics
5. Visual improvements

The visual design is intentionally kept simple so that development can focus on gameplay logic and JavaScript implementation.

## License

This project is created for learning and educational purposes.
