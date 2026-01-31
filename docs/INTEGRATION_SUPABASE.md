# Интеграция с Supabase

Руководство по миграции приложения на Supabase для работы с реальными данными.

## 1. Установка и настройка
Необходимо установить пакет `@supabase/supabase-js` и настроить клиент в `src/lib/supabase.ts`, используя `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. Схема базы данных (PostgreSQL)

### Таблица `profiles`
- `id`: uuid (references auth.users)
- `nickname`: varchar(12)
- `bio`: varchar(30)
- `elo`: integer default 100
- `country`: text
- `avatar_url`: text
- `banner_url`: text
- `win_streak`: integer
- `total_matches`: integer

### Таблица `matches`
- `id`: uuid
- `user_id`: uuid (FK to profiles)
- `map_id`: text
- `is_win`: boolean
- `score`: text
- `elo_change`: integer
- `kd_ratio`: float
- `created_at`: timestamp

### Таблица `friends`
- `user_id`: uuid
- `friend_id`: uuid
- `status`: text (online/offline/ingame)

## 3. Real-time возможности (Matchmaking)
Для страницы `/matchmaking` необходимо использовать **Supabase Realtime (Channels)**:
- Подписка на изменения в таблице лобби.
- Использование `presence` для отслеживания игроков, которые сейчас находятся в поиске.

## 4. Замена моков
В файле `src/components/profile/profile-view.tsx` необходимо заменить состояние `useState(initialUser)` на фетчинг данных:

```tsx
useEffect(() => {
  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, matches(*)')
      .eq('id', currentUserId)
      .single();
    setProfile(data);
  };
  fetchProfile();
}, [currentUserId]);
```

## 5. Расчет уровней
Функция `calculateLevel` из `src/lib/data.ts` остается актуальной, так как она работает на основе числового значения `elo`, приходящего из БД.

---
*Важно: Для защиты данных настройте RLS (Row Level Security) в консоли Supabase.*