# Интеграция с Supabase

Это руководство поможет вам мигрировать ProfileMirror на Supabase для использования PostgreSQL и Realtime возможностей.

## 1. Настройка клиента
Установите пакет `@supabase/supabase-js` и создайте клиент в `src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## 2. Схема базы данных (SQL)

Выполните этот SQL в консоли Supabase для создания необходимых таблиц:

```sql
-- Таблица профилей
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname varchar(12) not null,
  bio varchar(30),
  elo integer default 1000,
  win_streak integer default 0,
  total_matches integer default 0,
  country text,
  avatar_url text,
  banner_url text,
  language text default 'ru',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Таблица матчей
create table matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  map_id text not null,
  is_win boolean not null,
  score text,
  elo_at_time integer,
  elo_change integer,
  kd_ratio float,
  kr_ratio float,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Включение RLS
alter table profiles enable row level security;
alter table matches enable row level security;
```

## 3. Real-time Matchmaking
Для страницы `/matchmaking` используйте подписки (Channels):

```tsx
const lobbyChannel = supabase.channel('lobby_room')
  .on('presence', { event: 'sync' }, () => {
    const state = lobbyChannel.presenceState();
    // Обновление списка игроков в лобби
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await lobbyChannel.track({ user_id: currentUserId });
    }
  });
```

## 4. Миграция данных
В `src/components/profile/profile-view.tsx` замените инициализацию стейта на загрузку из Supabase:

```tsx
useEffect(() => {
  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, matches(*)')
      .eq('id', user.id)
      .single();
    if (data) setProfile(data);
  };
  fetchProfile();
}, [user.id]);
```

---
*Важно: Для корректной работы уровней используйте функцию `calculateLevel` из `src/lib/data.ts` на клиенте, передавая ей значение `elo` из базы.*
