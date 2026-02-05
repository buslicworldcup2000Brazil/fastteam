# Интеграция с Supabase

Данное руководство описывает миграцию на PostgreSQL. Все моковые данные UI должны быть представлены в виде таблиц или View.

## 1. Схема базы данных (SQL)

### Таблица `profiles`
```sql
create table profiles (
  id uuid references auth.users primary key,
  nickname varchar(12) not null,
  bio varchar(30),
  elo integer default 1000,
  theme_color text default '3 71% 41%', -- Хранение акцентного цвета
  country text,
  avatar_url text,
  banner_url text,
  win_streak integer default 0,
  total_matches integer default 0,
  created_at timestamp with time zone default now()
);
```

### Таблица `matches`
```sql
create table matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  match_date timestamp with time zone default now(),
  is_win boolean, -- True = Green в UI, False = Red
  score_text text, -- "13 : 11"
  elo_after_match integer,
  elo_diff integer, -- Разница (определяет цвет и стрелку в истории)
  kills integer,
  deaths integer,
  kd_ratio float, -- Логика цвета: kd_ratio >= 1.0 ? green : red
  kr_ratio float,
  map_id text
);
```

## 2. Реализация статистики (Dashboard Stats)

Для блока "За последние 90 игр" (W/L, Highest/Lowest Elo) рекомендуется создать SQL View:
```sql
create view player_90day_stats as
select 
  user_id,
  count(*) filter (where is_win = true) as wins,
  count(*) filter (where is_win = false) as losses,
  max(elo_after_match) as highest_elo,
  min(elo_after_match) as lowest_elo,
  (last_value(elo_after_match) over(partition by user_id order by match_date) - 
   first_value(elo_after_match) over(partition by user_id order by match_date)) as elo_change
from matches
where match_date > now() - interval '90 days'
group by user_id;
```

## 3. UI Интеграция и цвета

- **Цвет темы**: При загрузке приложения вызывайте `setPrimaryColor(profile.theme_color)` из `useTheme`.
- **История матчей**:
  - `elo_diff`: Если положительный, рендерим `+` и `ArrowUp` (цвет green-400).
  - `kd_ratio` / `kr_ratio`: Цвет текста зависит от значения (порог 1.0).
- **Карты**: Маппинг `map_id` -> Название (через объект `translations`).

---
*Важно: Используйте Realtime подписки Supabase для обновления лобби и статуса друзей.*