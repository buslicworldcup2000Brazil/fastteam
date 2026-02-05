# Интеграция с Firebase Studio

Это руководство описывает процесс перевода ProfileMirror на реальный бэкенд Firebase. Каждая деталь, которая сейчас является моковой, должна быть отражена в Firestore.

## 1. Подготовка (Scaffolding)
Вызовите `RequestFirebaseBackendTool` для инициализации инфраструктуры в `src/firebase/`.

## 2. Структура данных (Firestore)

### Коллекция `/users/{userId}`
Содержит основной профиль и агрегированную статистику.

- **Основные данные**:
  - `name`: string (max 12 chars)
  - `bio`: string (max 30 chars)
  - `elo`: number (текущий рейтинг)
  - `themeColor`: string (HSL значение, например, "3 71% 41%")
  - `country`: string (название для `getFlagEmoji`)
  - `avatarUrl` / `bannerUrl`: string
  - `winStreak`: number
  - `totalMatches`: number

- **Агрегаты за 90 дней (`last90Stats`)**:
  - `wins` / `losses`: number (например, 60 / 30)
  - `highestElo` / `lowestElo`: number (рекорды за период)
  - `eloChange`: number (разница между началом и концом периода, например, +440)
  - `mapWinRates`: array of objects `{ mapName: string, winRate: number, matches: number }`

### Подколлекция `/users/{userId}/matches/{matchId}`
История каждой игры для таблицы и графиков.

- `date`: timestamp
- `result`: "win" | "loss" (определяет цвет полоски: Win = Green, Loss = Red)
- `score`: string (например, "13 : 11")
- `skillLevel`: number (ELO на момент окончания матча)
- `skillChange`: number (число со знаком, например, +25 или -18. Если > 0 — Green + ArrowUp, если < 0 — Red + ArrowDown)
- `kd`: string (например, "30/20")
- `kdRatio`: number (если >= 1.0 — Green, < 1.0 — Red)
- `krRatio`: number (аналогичная логика цвета)
- `map`: string (ID карты)

## 3. Логика отображения (UI Logic)

### Тренды (Performance Trends)
Для графика ELO берем последние 15 документов из подколлекции `matches`, сортируя по `date`.
Для Combat Trends (K/D, K/R) используем те же данные, отображая `kdRatio` и `krRatio`.

### Уровни
Используйте функцию `calculateLevel(profile.elo)` из `src/lib/data.ts` для динамического определения иконки уровня на основе ELO из базы.

---
*Важно: Все изменения данных (обновление профиля, запись результата матча) производятся через Client SDK.*