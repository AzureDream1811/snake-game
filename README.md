# Snake Game — 6-Level Development Plan

## Overview

The game is developed across six levels. Each level introduces new gameplay mechanics while reusing the core Snake gameplay and features from previous levels.

The main goals are:
- Gradually increase gameplay difficulty.
- Introduce new mechanics in each level.
- Keep the code modular and reusable.
- Ensure that existing levels remain functional when new features are added.

---

## Level 1 — Basic Snake

**Status:** Completed

**Goal:** Implement the core Snake gameplay.

### Features
- Basic snake movement and food collection.
- Collision detection with walls and the snake's body.
- Score tracking.
- Win condition based on a target score.
- Gradually increasing movement speed.

---

## Level 2 — Missions, Obstacles & Mana

**Status:** Completed / Mana to be implemented

**Goal:** Introduce additional objectives and a resource-management mechanic.

### Features
- Wrap-around movement: the snake can pass through one edge and appear on the opposite edge.
- Static obstacles.
- Random missions with different objectives.
- Rewards for completing missions.
- **Mana system:**
  - Introduce a mana resource.
  - Consume mana to activate special abilities.
  - Manage mana consumption and recovery.
  - Display the current mana level in the game UI.

### Mana Design
The exact abilities and recovery rules will be defined during implementation. Mana should provide meaningful gameplay benefits without making the level too easy.

---

## Level 3 — Special Food & Time Limit

**Status:** Completed

**Goal:** Make gameplay more dynamic through food effects and time pressure.

### Features
- Larger game board.
- Multiple food items spawned simultaneously.
- Special food types:
  - Slow: temporarily reduces movement speed.
  - Speed: temporarily increases movement speed.
  - Extra Food: grants additional points.
  - Extra Time: adds time to the countdown.
  - Poison: reduces score and applies its configured penalty.
- Time limit of 150 seconds.
- Win condition: reach 50 points.

---

## Level 4 — Health & Combo

**Status:** In progress

**Goal:** Introduce health management and score multipliers.

### Features
- Health system with 3 health points.
- Collisions reduce health instead of immediately ending the game.
- Game Over when health reaches zero.
- Combo system for consecutive food pickups.
- Combo multiplier capped at x5.
- Combo expires after 5 seconds without extending the combo.
- Three food items spawned simultaneously.
- Retain special food and mission mechanics.
- Time limit of 60 seconds.
- Win condition: reach 100 points.

### Design Notes
- Keep collision detection separate from health reduction.
- Ensure each collision deducts health only once.
- Ensure the snake returns to a safe position or receives temporary collision protection after taking damage.

---

## Level 5 — Hazards

**Status:** Planned

**Goal:** Introduce environmental threats that require more careful movement and planning.

### Features
- Hazard system with dangerous areas or objects on the board.
- Hazards can move, change position, or activate according to defined rules.
- Collision detection between the snake and hazards.
- Hazard interactions follow the Level 4 health rules where appropriate.
- Retain relevant mechanics from previous levels, such as special food, combo, and missions.
- Increase difficulty through hazard placement, movement patterns, or activation timing.

### Design Notes
- Keep hazards distinct from ordinary static obstacles.
- Prevent hazards from spawning on the snake, food, or other occupied positions.
- Define hazard behavior and damage rules before implementation.
- Ensure hazards cannot trap the snake in an unavoidable collision.

---

## Level 6 — Final Challenge

**Status:** Planned

**Goal:** Combine previously introduced mechanics into the most challenging level.

### Features
- Combine core Snake gameplay with selected mechanics from Levels 2–5.
- Use mana and special abilities to help the player handle difficult situations.
- Include hazards and more demanding obstacle arrangements.
- Retain health and combo mechanics.
- Introduce a higher target score and a more challenging time limit.
- Require the player to balance scoring, survival, resource usage, and movement.

### Design Notes
- Tune the difficulty so the level remains challenging but achievable.
- Avoid introducing too many unrelated mechanics at once.
- Define the final score target, time limit, hazard behavior, and mana abilities during implementation.
- Test interactions between all active systems.

---

## Implementation Order

1. Complete and test Level 1.
2. Complete Level 2 and implement the mana system.
3. Complete Level 3 and validate special food behavior.
4. Implement and test Level 4 health and combo mechanics.
5. Develop Level 5 hazards.
6. Build Level 6 by combining and tuning existing mechanics.
7. Run regression tests across all six levels.

---

## General Development Guidelines

- Use a shared core game loop across all levels.
- Configure level-specific features through the `LEVELS` configuration object.
- Enable or disable mechanics through level configuration instead of duplicating gameplay logic.
- Separate collision detection, damage handling, scoring, and game-state management.
- Prevent invalid spawning positions and infinite spawn loops.
- Test interactions between mechanics, especially mana, health, combo, food effects, and hazards.
- Ensure that changes to later levels do not break earlier levels.

## Completion Criteria

A level is considered complete when:
- All configured mechanics work as intended.
- Win and Game Over conditions are handled correctly.
- UI displays the relevant gameplay information.
- Edge cases have been tested.
- Previously completed levels continue to work correctly.
