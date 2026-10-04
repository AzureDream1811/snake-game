# Snake Game

A classic Snake game built entirely with **HTML, CSS, and Vanilla JavaScript**.

The game consists of **6 progressive levels**. Each level introduces new gameplay mechanics and gradually increases the complexity of the game.

The project focuses primarily on gameplay logic, state management, collision detection, and JavaScript implementation rather than visual design.

## Features

* Classic Snake gameplay
* 6 progressive levels
* Keyboard controls
* Score system
* Level completion system
* Dynamic Snake speed
* Wrap-around movement
* Mission system
* Static and moving obstacles
* Multiple food types
* Temporary effects
* Combo system
* Environmental hazards
* Timed events
* Dynamic map transformation
* Enemy Snake AI
* Pathfinding
* Game Over and restart system

## Levels

### Level 1 — Classic

The foundation of the game.

**Core mechanics:**

* Snake movement
* Keyboard controls
* Food spawning
* Snake growth
* Score tracking
* Self-collision detection
* Dynamic Snake speed
* Game Over
* Level completion
* Restart

The player completes the level by reaching the required food count.

Example:

```text
Target: 10 food
Progress: 7 / 10
```

**Main focus:**

* Game loop
* Game state
* Coordinate system
* Canvas rendering
* Input handling
* Collision detection

---

### Level 2 — Challenge

Introduces gameplay objectives and map-based challenges.

#### Wrap-around

The Snake can cross the boundaries of the game board and appear on the opposite side.

```text
Right edge  → Left edge
Left edge   → Right edge
Top edge    → Bottom edge
Bottom edge → Top edge
```

#### Mission System

The player receives objectives that must be completed during the level.

Example:

```text
Mission
[ ] Reach length 8
[ ] Collect 5 food
[ ] Score 100
```

Completing a mission provides a reward such as:

* Bonus score
* Temporary speed increase
* Temporary gameplay effect
* Other level-specific rewards

#### Static Obstacles

Static obstacles are placed on the game board.

The Snake must avoid:

* Its own body
* Obstacles
* Other collision areas defined by the level

**New mechanics:** 3

* Wrap-around movement
* Mission and reward system
* Static obstacles

---

### Level 3 — Special Food

Introduces multiple food types and a more complex scoring system.

#### Multiple Food Types

Different foods provide different effects.

Example:

```text
Normal Food
+10 score
+1 length

Bonus Food
+50 score

Poison Food
Decrease length

Speed Food
Increase movement speed
```

Additional food types can be added as the project evolves.

#### Temporary Effects

Some food applies an effect for a limited duration.

Example:

```text
Speed Boost
Duration: 5 seconds

Slow
Duration: 3 seconds
```

Effects expire automatically after their duration.

#### Combo System

Eating food continuously within a defined time window increases the combo multiplier.

Example:

```text
Food 1 → x1
Food 2 → x2
Food 3 → x3
Food 4 → x4
```

The combo resets when the player fails to maintain the required pace.

**New mechanics:** 3

* Multiple food types
* Temporary effects
* Combo system

---

### Level 4 — Dynamic Arena

Introduces gameplay systems that change while the player is playing.

#### Moving Obstacles

Obstacles can move automatically across the map.

The player must react to their changing positions.

#### Environmental Hazards

Specific areas of the map can apply effects to the Snake.

Examples:

```text
Slow Zone
Danger Zone
Damage Zone
```

The effect depends on the type of hazard.

#### Timed Events

Special events are triggered during gameplay.

Examples:

```text
Frenzy Event
Food spawn rate increases

Speed Event
Snake movement becomes faster

Danger Event
Obstacles move faster
```

Timed events have their own duration and state.

**New mechanics:** 3

* Moving obstacles
* Environmental hazards
* Timed events

---

### Level 5 — Dynamic Map

Introduces one complex mechanic: **Dynamic Map Transformation**.

The map changes while the game is running.

Possible changes include:

* Obstacles appearing
* Obstacles disappearing
* Obstacles changing position
* Paths becoming blocked
* Paths becoming available
* Layout changes

Example:

```text
Initial

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
Updated

┌────────────────────┐
│   ███              │
│                    │
│      ████          │
│                    │
│        Snake       │
└────────────────────┘
```

The collision, food spawning, and movement systems must adapt to the current map state.

**New mechanic:** 1 complex mechanic

* Dynamic map transformation

---

### Level 6 — Enemy AI

Introduces one complex mechanic: **Enemy Snake AI**.

An AI-controlled Snake is added to the game.

The enemy can:

* Move independently
* Detect targets
* Select a target
* Navigate through the map
* Avoid obstacles
* Interact with food
* Interact with the player

Basic decision flow:

```text
Detect target
    ↓
Select target
    ↓
Find path
    ↓
Move
    ↓
Re-evaluate
```

The enemy can initially prioritize food and may later be extended to target the player's Snake.

A grid-based pathfinding algorithm such as **Breadth-First Search (BFS)** can be used for navigation.

**New mechanic:** 1 complex mechanic

* Enemy Snake AI

## Level Progression

```text
Level 1 — Classic
    |
    | + Dynamic Speed
    | + Level Completion
    v
Level 2 — Challenge
    |
    | + Wrap-around
    | + Mission System
    | + Static Obstacles
    v
Level 3 — Special Food
    |
    | + Multiple Food Types
    | + Temporary Effects
    | + Combo System
    v
Level 4 — Dynamic Arena
    |
    | + Moving Obstacles
    | + Environmental Hazards
    | + Timed Events
    v
Level 5 — Dynamic Map
    |
    | + Dynamic Map Transformation
    v
Level 6 — Enemy AI
    |
    | + Enemy Snake
    | + Pathfinding / Decision Making
```

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* Canvas API

No frontend frameworks, game engines, backend services, or external dependencies are required.

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

The project structure may evolve as the game becomes more complex.

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

No build tools or package installation are required.

## Development Approach

The game is developed incrementally, with each level being implemented and tested before introducing the mechanics of the next level.

The main priorities are:

1. Correct gameplay logic
2. Reliable state management
3. Clean and maintainable code
4. Testable game mechanics
5. Visual improvements

The visual design is intentionally kept simple so development can focus on JavaScript and game logic.

## Project Goals

This project is primarily intended to practice:

* JavaScript syntax and fundamentals
* Arrays and objects
* Functions
* Event handling
* Canvas API
* Game loops
* State management
* Collision detection
* Coordinate systems
* Timers and intervals
* Randomization
* Dynamic game mechanics
* Pathfinding
* Basic game AI

## License

This project is created for learning and educational purposes.
