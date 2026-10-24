# Snake Game

A browser Snake game with 5 levels. Each level adds its own mechanic on top of the classic gameplay. Built with plain HTML, CSS and JavaScript, no build step.

- Source: https://github.com/AzureDream1811/snake-game
- Tutorial: https://docs.google.com/document/d/1_0jsPAP5Mg7oID_XaXUXvMBWcBm_wSRil_Z9x-jBl0s/edit?usp=sharing

## Run

Open `index.html` in a browser. `game.js` is loaded from the same folder.

## Controls

| Key     | Action                                   |
| ------- | ---------------------------------------- |
| W / ↑   | Up                                       |
| S / ↓   | Down                                     |
| A / ←   | Left                                     |
| D / →   | Right                                    |
| Space   | Shield (Level 5)                         |
| P / Esc | Pause / Resume (or use the Pause button) |
| 1 - 5   | Select level (or use the level buttons)  |

## How to play

- Eat food to score points and grow. Every 3 food eaten, the speed goes up one step.
- Food that is not eaten within 10 seconds moves to another spot.
- **Win:** reach the target score of the level.
- **Lose:** hit your own body, a wall (Level 1 only), an obstacle, run out of time or run out of health.

## Levels

|                  | L1      | L2       | L3          | L4       | L5       |
| ---------------- | ------- | -------- | ----------- | -------- | -------- |
| Theme            | Classic | Missions | Time attack | Survival | Hardcore |
| Board            | 20x20   | 20x20    | 25x25       | 30x30    | 30x30    |
| Target score     | 10      | 30       | 50          | 80       | 100      |
| Wrap-around      | -       | Yes      | Yes         | Yes      | Yes      |
| Static obstacles | -       | 3        | 6           | 4        | 6        |
| Moving obstacles | -       | -        | -           | 3        | -        |
| Missions         | -       | 3 random | -           | -        | -        |
| Special food     | -       | -        | Yes         | Yes      | Yes      |
| Time limit       | -       | -        | 90s         | -        | 120s     |
| Health / lives   | 1       | 1        | 1           | 3 health | 1        |
| Combo            | -       | -        | -           | Yes      | Yes      |
| Hazards          | -       | -        | -           | -        | Yes      |
| Mana + shield    | -       | -        | -           | -        | Yes      |

## Mechanics

**Food**

| Food          | Color  | Effect                                                                             |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| Normal        | Red    | +1 point                                                                           |
| Speed         | Yellow | +1 point, faster for 5s                                                            |
| Extra Food    | Pink   | +5 points                                                                          |
| Extra Time    | Green  | +2 points, +10s on the clock                                                       |
| Slow / Poison | Purple | Same color on purpose. Slow: +1 point, slower for 5s. Poison: -2 points, -1 health |

**Combo (L4, L5):** eating in a row raises the combo up to x5 and multiplies the points. It resets after 5 seconds without eating.

**Hazards (L5):** 3x3 zones appear on the board, first as a warning, then active. Entering an active zone slows the snake for 3s and resets the combo.

**Mana (L5):** starts at 50, max 100. Each food gives +10 and it also recovers slowly over time. Press Space (cost 50) to activate a shield for 3s: the snake ignores obstacles and hazards (the snake turns rainbow). Hitting your own body or running out of time still ends the game.

**Missions (L2):** 3 random missions from a pool (reach length 8 or 12, collect 5 or 8 food, survive 300 ticks). Each gives a reward such as bonus points or a short speed boost.

## Project structure

```
index.html   page layout, styles, HUD, controls table
game.js      game logic and level configuration (LEVELS)
```

Level features are switched on or off in the `LEVELS` object in `game.js`. All levels share the same game loop (`tick`), so a new level only needs a new config entry.