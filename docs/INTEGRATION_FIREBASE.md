# Интеграция с Firebase Studio

Это руководство описывает процесс перевода ProfileMirror с моковых данных на реальный бэкенд Firebase.

## 1. Подготовка (Scaffolding)
Для начала работы в Firebase Studio необходимо вызвать команду `RequestFirebaseBackendTool`. Это создаст:
- `docs/backend.json`: Основной чертеж вашей базы данных.
- `src/firebase/config.ts`: Конфигурация SDK.
- `src/firebase/index.ts`: Точки доступа к Auth и Firestore.

## 2. Структура данных (Firestore)

Все моковые данные из `src/lib/data.ts` должны быть распределены по следующим коллекциям:

### Коллекция `/users/{userId}`
Содержит профиль игрока.
- `name`: string (max 12 chars)
- `bio`: string (max 30 chars)
- `elo`: number (используется для расчета level на лету)
- `country`: string (название страны)
- `avatarUrl` / `bannerUrl`: string
- `winStreak`: number
- `totalMatches`: number
- `registeredAt`: timestamp

### Подколлекция `/users/{userId}/matches/{matchId}`
История игр конкретного пользователя.
- `date`: timestamp
- `result`: "win" | "loss"
- `score`: string (например, "13 : 11")
- `map`: string (идентификатор карты: "factory", "mil_base" и т.д.)
- `skillChange`: number (+/- ELO)
- `kdRatio` / `krRatio`: number

### Коллекция `/lobbies/{lobbyId}`
Для системы реального времени в Matchmaking.
- `players`: array of userIds
- `status`: "searching" | "ready_check" | "match_room"
- `mode`: "2v2" | "5v5"

## 3. Аутентификация
Используйте хук `useUser()` из `@/firebase` для получения текущего авторизованного игрока. Все записи в БД должны защищаться правилами (Security Rules), разрешающими запись только владельцу `userId`.

## 4. Реализация в коде
Вместо импорта `userProfile` из `lib/data.ts`, используйте:
```tsx
const { user } = useUser();
const userDoc = useMemoFirebase(() => doc(db, 'users', user.uid), [db, user]);
const { data: profile } = useDoc(userDoc);
```

---
*Примечание: Firebase Studio автоматически разворачивает правила безопасности на основе структуры в backend.json.*