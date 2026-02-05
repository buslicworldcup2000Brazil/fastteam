# 📋 Руководство по интеграции: Firebase (ProfileMirror)

Это руководство описывает процесс перевода приложения **ProfileMirror** на платформу Firebase. Мы будем использовать Firestore для данных, Firebase Auth для пользователей и Cloud Functions для серверной логики.

## 1. 📋 Краткий обзор и ключевые концепции
Firebase — это NoSQL платформа (Backend-as-a-Service). Наша архитектура строится на:
- **Cloud Firestore**: Документо-ориентированная база данных для хранения профилей и истории матчей.
- **Firebase Authentication**: Управление сессиями и безопасный вход.
- **Security Rules**: Декларативная защита данных на уровне базы.

## 2. 🎯 Предварительные требования
- Установленный Node.js.
- Аккаунт на [Firebase Console](https://console.firebase.google.com/).
- Firebase CLI (`npm install -g firebase-tools`).

## 3. 🚀 Пошаговая инструкция по настройке
1. Создайте проект в консоли Firebase (напр. `profile-mirror-prod`).
2. Включите **Authentication** (Email/Password).
3. Создайте базу **Cloud Firestore** в тестовом режиме (позже обновим правила).
4. Зарегистрируйте Web App и получите конфиг:

```javascript
// ПРИМЕР (FAKE) КОНФИГУРАЦИИ
export const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
  authDomain: "profile-mirror-123.firebaseapp.com",
  projectId: "profile-mirror-123",
  storageBucket: "profile-mirror-123.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:abcdef1234567890"
};
```

## 4. 🛠 Интеграция на стороне клиента (Next.js/React)
Установка: `npm install firebase`

### Инициализация клиента (`src/lib/firebase.ts`)
```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Пример хука для данных профиля
```typescript
import { doc, onSnapshot } from "firebase/firestore";

export function subscribeToProfile(userId: string, callback: (data: any) => void) {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    callback(doc.data());
  });
}
```

## 5. ⚙️ Серверная логика (Cloud Functions)
Используйте функции для автоматического пересчета ELO или уровней после завершения матча.

```typescript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onMatchCreate = functions.firestore
    .document('users/{userId}/matches/{matchId}')
    .onCreate(async (snap, context) => {
        const matchData = snap.data();
        const userRef = admin.firestore().collection('users').doc(context.params.userId);
        
        // Логика обновления ELO
        return userRef.update({
            elo: admin.firestore.FieldValue.increment(matchData.skillChange)
        });
    });
```

## 6. 📁 Работа с данными (Data Mocking)

### Структура Firestore:
- **Коллекция `/users`**:
  - `userId` (Document ID):
    - `name`: "kelleN"
    - `elo`: 1450
    - `themeColor`: "3 71% 41%"
    - `last90Stats`: { `wins`: 60, `losses`: 30, `highestElo`: 4655, ... }

- **Подколлекция `/users/{userId}/matches`**:
  - `matchId`:
    - `result`: "win" (UI: Green) | "loss" (UI: Red)
    - `skillChange`: +25 (UI: Green ArrowUp) | -18 (UI: Red ArrowDown)
    - `kdRatio`: 1.50 (UI: text-green-400 if >= 1.0)
    - `map`: "Mil_Warehouses"

### Правила безопасности (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      match /matches/{matchId} {
        allow read: if true;
        allow create: if request.auth != null; // Обычно через функции
      }
    }
  }
}
```

## 7. 🔐 Модель безопасности
- **Аутентификация**: Firebase генерирует JWT автоматически.
- **Токены**: Используйте `getIdToken()` для передачи на кастомный бекенд.

## 8. ⚠️ Важные предупреждения
- 🛑 **НИКОГДА** не храните ключи сервисного аккаунта (`service-account.json`) в коде фронтенда.
- 🛑 Избегайте "глубоких" вложенных подколлекций (более 2 уровней).
- ✅ Всегда используйте `onSnapshot` для динамического обновления ELO в реальном времени.

## 9. 🔗 Ссылки
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Rules Playground](https://firebase.google.com/docs/rules)