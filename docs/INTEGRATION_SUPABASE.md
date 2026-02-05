# 📋 Руководство по интеграции: Supabase (ProfileMirror)

Supabase — это Open Source альтернатива Firebase, построенная на базе PostgreSQL. Это руководство поможет вам внедрить реляционную структуру данных для ProfileMirror.

## 1. 📋 Краткий обзор и ключевые концепции
Supabase предоставляет:
- **PostgreSQL**: Полноценная реляционная БД.
- **PostgREST**: Автоматическое API на основе вашей схемы.
- **RLS (Row Level Security)**: Политики доступа прямо в SQL.
- **Realtime**: Подписка на изменения через WebSocket.

## 2. 🎯 Предварительные требования
- Аккаунт на [Supabase.com](https://supabase.com/).
- Базовые знания SQL.
- Supabase CLI (опционально, для локальной разработки).

## 3. 🚀 Пошаговая инструкция по настройке
1. Создайте проект в Supabase.
2. Получите URL и Anon Key в разделе `Project Settings -> API`:

```bash
# ПРИМЕР (FAKE) УЧЕТНЫХ ДАННЫХ
NEXT_PUBLIC_SUPABASE_URL="https://vaxclmzpryiqbtvjszxo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefg..."
```

## 4. 🛠 Интеграция на стороне клиента
Установка: `npm install @supabase/supabase-js`

### Инициализация клиента (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 5. ⚙️ Интеграция на стороне сервера (Edge Functions)
Supabase позволяет писать функции на TypeScript (Deno).

```typescript
// supabase/functions/process-match/index.ts
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const { userId, matchResult } = await req.json()
  // Логика обновления ELO через системный клиент (Service Role)
  return new Response(JSON.stringify({ status: 'updated' }))
})
```

## 6. 📁 Работа с данными (Схема SQL)

Выполните этот SQL в Query Editor:

```sql
-- Таблица профилей
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text not null,
  bio text check (char_length(bio) <= 30),
  elo integer default 1000,
  theme_color text default '3 71% 41%',
  country text,
  avatar_url text,
  banner_url text,
  win_streak integer default 0
);

-- Таблица матчей
create table matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  match_date timestamp with time zone default now(),
  result text check (result in ('win', 'loss')),
  score_text text, -- "13 : 11"
  skill_change integer, -- +25 или -18
  kd_ratio float,
  kr_ratio float,
  map_id text
);

-- Настройка RLS
alter table profiles enable row level security;

create policy "Profiles are public." on profiles
  for select using (true);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
```

### Логика цветов и данных:
- **W/L (60/30)**: Считается через `count(*)` в таблице `matches`.
- **Highest Elo**: `max(elo_after_match)` из истории матчей.
- **Цвета UI**:
  - Если `skill_change > 0` -> Цвет `text-green-400`, иконка `ArrowUp`.
  - Если `kd_ratio >= 1.0` -> Текст `text-green-400`.

## 7. 🔐 Модель безопасности
- **Auth**: Supabase использует JWT. При каждом запросе клиент отправляет токен в заголовке `Authorization`.
- **RLS**: База данных сама проверяет права на основе `auth.uid()`.

## 8. ⚠️ Важные предупреждения
- 🛑 **КЛЮЧ SERVICE_ROLE**: Никогда не используйте его во фронтенде. Он обходит все политики RLS.
- ✅ Используйте `upsert` для сохранения профиля, чтобы избежать дубликатов.
- ✅ Подписывайтесь на таблицу `matches` для мгновенного обновления графиков после игры.

## 9. 🔗 Полезные ссылки
- [Supabase JavaScript Library](https://supabase.com/docs/reference/javascript/introduction)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)