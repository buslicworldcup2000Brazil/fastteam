# Интеграция с Firebase Studio

Это руководство описывает процесс перевода ProfileMirror с моковых данных на реальный бэкенд Firebase с использованием инструментов Firebase Studio.

## 1. Подготовка (Scaffolding)
Для начала работы вызовите команду `RequestFirebaseBackendTool`. Это сгенерирует необходимую инфраструктуру:
- `docs/backend.json`: Описание структуры вашей базы данных.
- `src/firebase/config.ts`: Конфигурация SDK.
- `src/firebase/index.ts`: Точки доступа к Auth и Firestore.

## 2. Структура данных (Firestore)

Все данные из `src/lib/data.ts` должны быть перенесены в Firestore.

### Коллекция `/users/{userId}`
Содержит основной профиль игрока.
- `name`: string (max 12 chars)
- `bio`: string (max 30 chars)
- `elo`: number (используется для расчета уровня через `calculateLevel`)
- `winStreak`: number
- `totalMatches`: number
- `country`: string (название страны)
- `avatarUrl`: string
- `bannerUrl`: string
- `language`: "ru" | "en"
- `registeredAt`: timestamp
- `last90Stats`: object (содержит агрегированную статистику за 90 дней)

### Подколлекция `/users/{userId}/matches/{matchId}`
История игр пользователя.
- `date`: timestamp
- `result`: "win" | "loss"
- `score`: string (например, "13 : 11")
- `skillLevel`: number (ELO на момент матча)
- `skillChange`: number (изменение ELO)
- `kdRatio`: number
- `krRatio`: number
- `map`: string

### Коллекция `/lobbies/{lobbyId}`
Для системы Matchmaking в реальном времени.
- `players`: array of userIds
- `status`: "searching" | "ready_check" | "match_room"
- `mode`: "2v2" | "5v5"
- `selectedMap`: string (id карты)

## 3. Аутентификация
Используйте хук `useUser()` из `@/firebase` для получения текущего игрока. 
```tsx
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

const { user } = useUser();
const db = useFirestore();
const userDoc = useMemoFirebase(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
const { data: profile } = useDoc(userDoc);
```

## 4. Безопасность (Security Rules)
Firebase Studio автоматически развернет правила на основе `backend.json`. Убедитесь, что запись в `/users/{userId}` разрешена только пользователю с соответствующим `request.auth.uid`.

---
*Примечание: Все изменения данных должны происходить на стороне клиента через SDK Firebase.*
