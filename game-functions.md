# Snake Game: flow, function

## 0. Luồng chạy tổng quát

```
startGame()
 ├─ loadLevel(level)      copy cấu hình level vào biến ngoài
 ├─ drawBoard()           dựng lưới ô
 ├─ resetGame()           đặt lại rắn, food, vật cản, điểm...
 ├─ renderAll()           vẽ lần đầu
 └─ scheduleTick()        hẹn tick đầu tiên

tick()  (lặp lại)
 ├─ cập nhật thời gian, checkCombo()
 ├─ moveSnake()           rắn đi, có thể ăn food
 ├─ applyHazard()         đầu rắn trong vùng độc thì bị nhiễm
 ├─ isGameOver()          thua thì startGame() và dừng tick
 ├─ moveMovingObstacles() vật cản di động đi một bước
 ├─ updateHazards()       xóa vùng hết hạn, sinh vùng mới
 ├─ renderSnake / renderMovingObstacles / renderHazards
 ├─ updateMissions()
 ├─ isGameWin()           thắng thì startGame() và dừng tick
 ├─ updateDisplays()
 ├─ cleanupEffects()
 └─ scheduleTick()
```

## 1. Cấu hình và dữ liệu cố định

| Tên | Vai trò |
|---|---|
| `DEFAULT_LEVEL` | Giá trị mặc định cho mọi level |
| `LEVELS` | Cấu hình từng level, ghi đè lên `DEFAULT_LEVEL` |
| `MISSIONS` | Mỗi nhiệm vụ có `text`, `check()` (đạt chưa), `reward()` (thưởng) |
| `FOOD_TYPES` | Mỗi loại food có `effect()` (cộng điểm, thêm hiệu ứng, đếm số lần ăn) |

## 2. Hàm vị trí (dùng ở mọi nơi)

| Hàm | Làm gì |
|---|---|
| `isSamePos(a, b)` | Hai tọa độ có trùng không |
| `containsPos(list, pos)` | Trong mảng có phần tử nào trùng `pos` không |
| `findFoodAt(pos)` | Trả về food tại `pos`, không có thì `null` |
| `isInsideBoard(pos)` | `pos` có nằm trong bảng không |
| `getRandomPosition()` | Một ô ngẫu nhiên trong bảng |
| `isNearSnakeHead(pos, distance)` | `pos` cách đầu rắn không quá `distance` ô (khoảng cách Chebyshev) |
| `isOccupied(pos)` | Ô đã có rắn, vật cản, vật cản di động hoặc food chưa |

## 3. Vẽ (render)

Dữ liệu trong mảng là nguồn sự thật, DOM chỉ là bản hiển thị.

| Hàm | Làm gì |
|---|---|
| `drawBoard()` | Tạo lưới ô và lưu vào `boardCells[x][y]` |
| `getCell(pos)` | Lấy ô DOM tại `pos` |
| `addClass(pos, classname)` | Thêm class vào ô |
| `renderCells(classname, positions)` | Xóa class khỏi mọi ô, rồi thêm lại cho đúng các `positions` |
| `renderSnake()` | Vẽ rắn |
| `renderFoods()` | Vẽ toàn bộ food |
| `showFood(food)` / `hideFood(food)` | Bật/tắt class của một food |
| `renderObstacles()` | Vẽ vật cản tĩnh |
| `renderMovingObstacles()` | Vẽ vật cản di động |
| `renderHazards()` | Vẽ vùng độc, phase `warning` và `active` có class riêng |
| `renderAll()` | Gọi tất cả hàm vẽ ở trên, dùng khi bắt đầu ván |

## 4. Rắn

| Hàm | Làm gì |
|---|---|
| `getNextSnakeHead()` | Tính ô đầu mới theo `snakeDirection`, có xử lý wrap |
| `moveSnake()` | Thêm đầu mới bằng `unshift`. Nếu ăn food thì giữ đuôi, không thì `pop` đuôi |
| `eatFood(food)` | Tăng combo, chạy `effect()` của loại food, thay food mới |
| `handleKeydown(e)` | Đổi hướng, không cho quay ngược 180 độ |

## 5. Food

| Hàm | Làm gì |
|---|---|
| `pickFoodType()` | 70% là `normal`, còn lại chọn ngẫu nhiên trong `specialFoodTypes` của level |
| `spawnFood()` | Sinh một food ở ô trống, đặt `setTimeout` tự thay sau `FOOD_DURATION_MS` |
| `spawnFoods(count)` | Sinh `count` food |
| `replaceFood(oldFood)` | Xóa food cũ (cả timer và hiển thị), sinh food mới cùng vị trí trong mảng `foods` |

## 6. Vật cản

| Hàm | Làm gì |
|---|---|
| `spawnObstacle()` | Vật cản tĩnh ở ô trống, cách đầu rắn hơn `OBSTACLE_SAFE_DISTANCE` |
| `spawnMovingObstacle()` | Vật cản di động ở ô trống, có hướng ngẫu nhiên cố định |
| `canMovingObstacleEnter(pos)` | Ô kế tiếp trong bảng và chưa bị chiếm |
| `moveMovingObstacle(obstacle)` | Đi một ô theo hướng. Bị chặn thì đảo hướng và đứng yên tick đó |
| `moveMovingObstacles()` | Gọi `moveMovingObstacle` cho từng vật cản di động |

## 7. Hazard (Bio Hazard, Lv5)

| Hàm | Làm gì |
|---|---|
| `createHazardCells(start)` | Tạo các ô của một vùng `HAZARD_SIZE` x `HAZARD_SIZE` từ góc `start` |
| `canPlaceHazard(hazardCells)` | Mọi ô nằm trong bảng, trống, và cách đầu rắn đủ xa |
| `spawnHazard()` | Thử vị trí ngẫu nhiên đến khi đặt được, trả về `{ cells, bornTick }` |
| `getHazardPhase(hazard)` | `warning` (10 tick đầu), `active` (60 tick tiếp theo), `expired` |
| `isInActiveHazard(pos)` | `pos` có nằm trong vùng đang `active` không |
| `updateHazards()` | Bỏ vùng `expired`, và cứ `hazardSpawnEveryTicks` tick thì sinh vùng mới nếu chưa đủ `maxHazards` |
| `applyHazard()` | Đầu rắn trong vùng `active` thì thêm hiệu ứng `infected` và reset combo |

## 8. Hiệu ứng và combo

| Hàm | Làm gì |
|---|---|
| `isEffectActive(effect)` | Hiệu ứng chưa hết hạn |
| `addEffect(type, durationMs)` | Thêm bản ghi `{ type, endsAt }` |
| `hasEffect(type)` | Đang có hiệu ứng loại `type` không |
| `cleanupEffects()` | Giữ lại các hiệu ứng chưa hết hạn |
| `increaseCombo()` | Tăng combo (tối đa `MAX_COMBO`) và gia hạn `comboEndsAt` |
| `checkCombo()` | Hết hạn thì reset combo về 0 |
| `getComboMultiplier()` | `Math.max(1, combo)` |
| `calcFoodScore(points)` | `points` nhân hệ số combo |
| `getSpeed()` | Tốc độ theo số food đã ăn, nhân thêm 1.5 (speed), 0.5 (slow), 0.6 (infected) |

## 9. Nhiệm vụ

| Hàm | Làm gì |
|---|---|
| `pickMissions()` | Chọn ngẫu nhiên `missionCount` nhiệm vụ từ `missionPool` |
| `updateMissions()` | Mỗi tick kiểm tra, nhiệm vụ nào vừa đạt thì đánh dấu `done` và trao thưởng |

## 10. Luật thắng thua

| Hàm | Làm gì |
|---|---|
| `hasHitWall(pos)` | Chạm tường (chỉ khi không wrap) |
| `hasHitSelf(pos)` | Đầu trùng thân |
| `hasHitObstacle(pos)` | Đầu trùng vật cản tĩnh hoặc di động |
| `isGameOver()` | Chạm tường hoặc thân thì thua. Chạm vật cản thì thua (không có máu) hoặc mất 1 máu. Hết giờ hoặc hết máu thì thua |
| `isGameWin()` | `score >= winScore` |

`hasHit*` chỉ kiểm tra, không đổi trạng thái. Chỗ duy nhất quyết định hậu quả (thua hay mất máu) là `isGameOver()`.

## 11. Hiển thị HUD

| Hàm | Làm gì |
|---|---|
| `updateFoodDisplay` / `updateScoreDisplay` | Số food đã ăn, điểm |
| `updateSpeedDisplay` / `updateTickCountDisplay` | Tốc độ, số tick |
| `updateEffectDisplay` | Danh sách hiệu ứng đang chạy (ẩn nếu level không bật `showEffects`) |
| `updateMissionDisplay` | Danh sách nhiệm vụ kèm trạng thái `[x]` / `[ ]` |
| `updateTimeDisplay` | Thời gian còn lại (ẩn nếu không có giới hạn) |
| `updateHealthDisplay` | Máu (ẩn nếu level không có máu) |
| `updateComboDisplay` | Combo và thời gian combo còn lại |
| `updateLevelButtons()` | Tô nút của level đang chơi |
| `updateDisplays()` | Gọi tất cả hàm hiển thị |

## 12. Vòng đời game

| Hàm | Làm gì |
|---|---|
| `loadLevel(level)` | Copy cấu hình `LEVELS[level]` vào các biến ngoài (`boardWidth`, `wrap`, `hasHealth`...) |
| `resetGame()` | Đặt rắn, điểm, combo, hiệu ứng về ban đầu, sinh vật cản, vật cản di động, food, nhiệm vụ |
| `scheduleTick()` | `setTimeout(tick, baseTickMs / getSpeed())` |
| `startGame()` | Xóa timer cũ, nạp level, dựng bảng, reset, vẽ, hẹn tick |
| `tick()` | Một bước game, xem sơ đồ ở mục 0 |
| `handleLevelClick(e)` | Bấm nút level thì đổi `currentLevel` và `startGame()` |

## 13. Biến ngoài chính

| Nhóm | Biến |
|---|---|
| DOM | `board`, `levelButtons`, `*El` |
| Bảng | `boardCells`, `boardWidth`, `boardHeight` |
| Level hiện tại | `currentLevel`, `currentConfig`, và các biến copy từ cấu hình (`winScore`, `wrap`, `hasHealth`, ...) |
| Thời gian | `tickTimer`, `tickCount`, `lastTickTime`, `timeElapsedMs`, `timeRemainingMs` |
| Thực thể | `snake`, `snakeDirection`, `foods`, `obstacles`, `movingObstacles`, `hazards` |
| Người chơi | `score`, `foodEaten`, `eatenCount`, `health`, `combo`, `comboEndsAt`, `effects`, `missions` |
