import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Trophy, Swords, Star, Crosshair } from 'lucide-react';

export const calculateLevel = (elo: number): number => {
  if (elo >= 1900) return 10;
  if (elo >= 1700) return 9;
  if (elo >= 1500) return 8;
  if (elo >= 1300) return 7;
  if (elo >= 1100) return 6;
  if (elo >= 900) return 5;
  if (elo >= 700) return 4;
  if (elo >= 500) return 3;
  if (elo >= 300) return 2;
  if (elo >= 100) return 1;
  return 1;
};

const DEFAULT_BANNER = PlaceHolderImages.find(img => img.id === 'profile-banner')?.imageUrl || 'https://picsum.photos/seed/1/1200/400';
const DEFAULT_AVATAR = PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || 'https://picsum.photos/seed/2/200/200';

export const statsData = [
  { id: '1', title: 'K/D Ratio', value: '2.45', icon: Swords, progress: 49 },
  { id: '2', title: 'Win Rate', value: '68%', icon: Trophy, progress: 68 },
  { id: '5', title: 'Matches Won', value: '816', icon: Star, progress: 54 },
  { id: '6', title: 'Avg. Kills', value: '18.5', icon: Crosshair, progress: 62 },
];

export const matchHistoryData = [
    { id: '1', date: '28 Jan 2026', time: '02:04', result: 'win' as const, score: '13 : 11', skillLevel: 1471, skillChange: 17, kd: '30/20', kdRatio: 1.50, krRatio: 1.25, map: 'Mil. Warehouses' },
    { id: '2', date: '28 Jan 2026', time: '01:20', result: 'win' as const, score: '13 : 11', skillLevel: 1454, skillChange: 25, kd: '25/16', kdRatio: 1.56, krRatio: 1.04, map: 'House' },
    { id: '3', date: '28 Jan 2026', time: '00:31', result: 'win' as const, score: '13 : 4', skillLevel: 1429, skillChange: 29, kd: '23/10', kdRatio: 2.30, krRatio: 1.35, map: 'Factory' },
    { id: '4', date: '27 Jan 2026', time: '23:50', result: 'win' as const, score: '13 : 8', skillLevel: 1400, skillChange: 30, kd: '32/14', kdRatio: 2.29, krRatio: 1.52, map: 'Mil. Warehouses' },
    { id: '5', date: '27 Jan 2026', time: '21:46', result: 'win' as const, score: '13 : 9', skillLevel: 1370, skillChange: 29, kd: '31/13', kdRatio: 2.38, krRatio: 1.41, map: 'House' },
    { id: '6', date: '27 Jan 2026', time: '20:10', result: 'loss' as const, score: '10 : 13', skillLevel: 1341, skillChange: -25, kd: '18/22', kdRatio: 0.81, krRatio: 0.85, map: 'Factory' },
    { id: '7', date: '26 Jan 2026', time: '23:15', result: 'win' as const, score: '13 : 7', skillLevel: 1366, skillChange: 28, kd: '27/12', kdRatio: 2.25, krRatio: 1.28, map: 'House' },
    { id: '8', date: '26 Jan 2026', time: '22:00', result: 'loss' as const, score: '9 : 13', skillLevel: 1338, skillChange: -24, kd: '20/24', kdRatio: 0.83, krRatio: 0.91, map: 'Mil. Warehouses' },
    { id: '9', date: '26 Jan 2026', time: '21:05', result: 'win' as const, score: '13 : 10', skillLevel: 1362, skillChange: 26, kd: '24/18', kdRatio: 1.33, krRatio: 1.04, map: 'Factory' },
    { id: '10', date: '25 Jan 2026', time: '23:40', result: 'win' as const, score: '13 : 5', skillLevel: 1336, skillChange: 31, kd: '28/9', kdRatio: 3.11, krRatio: 1.55, map: 'House' },
    { id: '11', date: '25 Jan 2026', time: '22:30', result: 'loss' as const, score: '11 : 13', skillLevel: 1305, skillChange: -26, kd: '22/25', kdRatio: 0.88, krRatio: 0.92, map: 'Factory' },
    { id: '12', date: '25 Jan 2026', time: '21:15', result: 'win' as const, score: '13 : 8', skillLevel: 1331, skillChange: 27, kd: '26/15', kdRatio: 1.73, krRatio: 1.23, map: 'Mil. Warehouses' },
    { id: '13', date: '24 Jan 2026', time: '23:55', result: 'win' as const, score: '13 : 6', skillLevel: 1304, skillChange: 29, kd: '25/11', kdRatio: 2.27, krRatio: 1.31, map: 'House' },
    { id: '14', date: '24 Jan 2026', time: '22:45', result: 'loss' as const, score: '7 : 13', skillLevel: 1275, skillChange: -28, kd: '15/23', kdRatio: 0.65, krRatio: 0.75, map: 'Factory' },
    { id: '15', date: '24 Jan 2026', time: '21:30', result: 'win' as const, score: '13 : 4', skillLevel: 1303, skillChange: 32, kd: '24/8', kdRatio: 3.00, krRatio: 1.41, map: 'Mil. Warehouses' },
];

export const userProfile = {
  name: "kelleN",
  bio: "Pro player & Streamer",
  handle: "@kellen99",
  tags: ["Pro", "Streamer", "MVP"],
  bannerUrl: DEFAULT_BANNER,
  avatarUrl: DEFAULT_AVATAR,
  elo: 1450,
  level: calculateLevel(1450),
  winStreak: 5,
  country: "Соединённые Штаты Америки (США)",
  language: "ru",
  registeredAt: "Jan 2024",
  stats: statsData,
  matchHistory: matchHistoryData,
  chartData: matchHistoryData.map(match => ({
    date: `${match.date} ${match.time}`,
    skillLevel: match.skillLevel,
    kdRatio: match.kdRatio,
    krRatio: match.krRatio, // We will treat this as AVG
  })).reverse(),
  last90Stats: {
    wins: 60,
    losses: 30,
    highestElo: 4655,
    lowestElo: 4138,
    eloChange: 440,
    mapWinRates: [
      { name: 'Dust2', winRate: 65 },
      { name: 'Mirage', winRate: 58 },
      { name: 'Inferno', winRate: 42 },
      { name: 'Overpass', winRate: 55 },
      { name: 'Ancient', winRate: 38 },
    ]
  }
};

export const friendsData = [
  { 
    name: "S1mple", 
    avatarUrl: "https://picsum.photos/seed/s1/200/200", 
    status: "online", 
    country: "Украина", 
    level: 10, 
    elo: 3842,
    bio: "GOAT of CS",
    handle: "@s1mpleO",
    tags: ["Pro", "MVP", "Legend"],
    bannerUrl: "https://picsum.photos/seed/s1-banner/1200/400",
    winStreak: 12,
    registeredAt: "May 2016",
    stats: [
      { id: '1', title: 'K/D Ratio', value: '3.12', icon: Swords, progress: 85 },
      { id: '2', title: 'Win Rate', value: '74%', icon: Trophy, progress: 74 },
      { id: '5', title: 'Matches Won', value: '2450', icon: Star, progress: 90 },
      { id: '6', title: 'Avg. Kills', value: '24.1', icon: Crosshair, progress: 88 },
    ],
    matchHistory: matchHistoryData.map(m => ({ ...m, skillLevel: 3842 + Math.floor(Math.random() * 100) })),
    chartData: matchHistoryData.map(m => ({ date: `${m.date} ${m.time}`, skillLevel: 3842 + Math.floor(Math.random() * 100), kdRatio: m.kdRatio + 0.5, krRatio: m.krRatio + 0.5 })).reverse(),
    last90Stats: userProfile.last90Stats
  },
  { 
    name: "m0NESY", 
    avatarUrl: "https://picsum.photos/seed/mo/200/200", 
    status: "ingame", 
    country: "Россия", 
    level: 10, 
    elo: 3612,
    bio: "Young star",
    handle: "@m0nesy13",
    tags: ["Pro", "AWP"],
    bannerUrl: "https://picsum.photos/seed/mo-banner/1200/400",
    winStreak: 8,
    registeredAt: "Feb 2020",
    stats: [
      { id: '1', title: 'K/D Ratio', value: '2.89', icon: Swords, progress: 78 },
      { id: '2', title: 'Win Rate', value: '71%', icon: Trophy, progress: 71 },
      { id: '5', title: 'Matches Won', value: '1890', icon: Star, progress: 82 },
      { id: '6', title: 'Avg. Kills', value: '22.5', icon: Crosshair, progress: 84 },
    ],
    matchHistory: matchHistoryData.map(m => ({ ...m, skillLevel: 3612 + Math.floor(Math.random() * 100) })),
    chartData: matchHistoryData.map(m => ({ date: `${m.date} ${m.time}`, skillLevel: 3612 + Math.floor(Math.random() * 100), kdRatio: m.kdRatio + 0.3, krRatio: m.krRatio + 0.3 })).reverse(),
    last90Stats: userProfile.last90Stats
  },
  { 
    name: "donk", 
    avatarUrl: "https://picsum.photos/seed/do/200/200", 
    status: "online", 
    country: "Россия", 
    level: 10, 
    elo: 3589,
    bio: "Headshot machine",
    handle: "@donk66",
    tags: ["Pro", "Rifle"],
    bannerUrl: "https://picsum.photos/seed/do-banner/1200/400",
    winStreak: 15,
    registeredAt: "Jan 2022",
    stats: [
      { id: '1', title: 'K/D Ratio', value: '3.45', icon: Swords, progress: 95 },
      { id: '2', title: 'Win Rate', value: '78%', icon: Trophy, progress: 78 },
      { id: '5', title: 'Matches Won', value: '1200', icon: Star, progress: 75 },
      { id: '6', title: 'Avg. Kills', value: '28.2', icon: Crosshair, progress: 98 },
    ],
    matchHistory: matchHistoryData.map(m => ({ ...m, skillLevel: 3589 + Math.floor(Math.random() * 100) })),
    chartData: matchHistoryData.map(m => ({ date: `${m.date} ${m.time}`, skillLevel: 3589 + Math.floor(Math.random() * 100), kdRatio: m.kdRatio + 0.8, krRatio: m.krRatio + 0.8 })).reverse(),
    last90Stats: userProfile.last90Stats
  }
];

export const topPlayersData = [
  { name: "S1mple", country: "Украина", elo: 3842, level: 10 },
  { name: "ZywOo", country: "Франция", elo: 3721, level: 10 },
  { name: "NiKo", country: "Босния и Герцеговина", elo: 3654, level: 10 },
  { name: "m0NESY", country: "Россия", elo: 3612, level: 10 },
  { name: "donk", country: "Россия", elo: 3589, level: 10 },
  { name: "ropz", country: "Эстония", elo: 3450, level: 10 },
  { name: "dev1ce", country: "Дания", elo: 3410, level: 10 },
  { name: "Twistzz", country: "Канада", elo: 3385, level: 10 },
  { name: "frozen", country: "Словакия", elo: 3312, level: 10 },
  { name: "broky", country: "Латвия", elo: 3290, level: 10 },
  { name: "Rain", country: "Норвегия", elo: 3250, level: 10 },
  { name: "Electronic", country: "Россия", elo: 3210, level: 10 },
  { name: "B1t", country: "Украина", elo: 3180, level: 10 },
  { name: "Magisk", country: "Дания", elo: 3150, level: 10 },
  { name: "Spinx", country: "Израиль", elo: 3120, level: 10 },
  { name: "Hunter-", country: "Босния и Герцеговина", elo: 3090, level: 10 },
  { name: "Jame", country: "Россия", elo: 3050, level: 10 },
  { name: "Shiro", country: "Россия", elo: 3010, level: 10 },
  { name: "Ax1le", country: "Россия", elo: 2980, level: 10 },
  { name: "Karrigan", country: "Дания", elo: 2950, level: 10 },
];
