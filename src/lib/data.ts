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

const elo = 1450;
const level = calculateLevel(elo);

export const userProfile = {
  name: "ShadowStriker",
  bio: "Pro player & Streamer",
  handle: "@shadowstriker99",
  tags: ["Pro", "Streamer", "MVP"],
  bannerUrl: PlaceHolderImages.find(img => img.id === 'profile-banner')?.imageUrl || 'https://picsum.photos/seed/1/1200/400',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || 'https://picsum.photos/seed/2/200/200',
  elo: elo,
  level: level,
  winStreak: 5,
  country: "Россия",
  language: "ru",
  lastFlagChange: 0, // Timestamp
};

export const statsData = [
  { id: '1', title: 'K/D Ratio', value: '2.45', icon: Swords, progress: 49 },
  { id: '2', title: 'Win Rate', value: '68%', icon: Trophy, progress: 68 },
  { id: '5', title: 'Matches Won', value: '816', icon: Star, progress: 54 },
  { id: '6', title: 'Avg. Kills', value: '18.5', icon: Crosshair, progress: 62 },
];

export const matchHistoryData = [
    { id: '1', date: '28 Jan 2026', time: '02:04', result: 'win', score: '13 : 11', skillLevel: 1471, skillChange: 17, kd: '30/20', kdRatio: 1.50, krRatio: 1.25, map: 'Mil. Warehouses' },
    { id: '2', date: '28 Jan 2026', time: '01:20', result: 'win', score: '13 : 11', skillLevel: 1454, skillChange: 25, kd: '25/16', kdRatio: 1.56, krRatio: 1.04, map: 'House' },
    { id: '3', date: '28 Jan 2026', time: '00:31', result: 'win', score: '13 : 4', skillLevel: 1429, skillChange: 29, kd: '23/10', kdRatio: 2.30, krRatio: 1.35, map: 'Factory' },
    { id: '4', date: '27 Jan 2026', time: '23:50', result: 'win', score: '13 : 8', skillLevel: 1400, skillChange: 30, kd: '32/14', kdRatio: 2.29, krRatio: 1.52, map: 'Mil. Warehouses' },
    { id: '5', date: '27 Jan 2026', time: '21:46', result: 'win', score: '13 : 9', skillLevel: 1370, skillChange: 29, kd: '31/13', kdRatio: 2.38, krRatio: 1.41, map: 'House' },
    { id: '6', date: '25 Jan 2026', time: '17:05', result: 'loss', score: '11 : 13', skillLevel: 1341, skillChange: -34, kd: '16/17', kdRatio: 0.94, krRatio: 0.96, map: 'Factory' },
    { id: '7', date: '25 Jan 2026', time: '16:19', result: 'loss', score: '9 : 13', skillLevel: 1375, skillChange: -32, kd: '15/16', kdRatio: 0.94, krRatio: 1.36, map: 'Mil. Warehouses' },
    { id: '8', date: '25 Jan 2026', time: '15:08', result: 'win', score: '13 : 11', skillLevel: 1407, skillChange: 25, kd: '39/15', kdRatio: 2.60, krRatio: 1.62, map: 'House' },
    { id: '9', date: '25 Jan 2026', time: '14:18', result: 'win', score: '13 : 2', skillLevel: 1382, skillChange: 26, kd: '15/10', kdRatio: 1.50, krRatio: 1.00, map: 'Factory' },
    { id: '10', date: '25 Jan 2026', time: '00:20', result: 'win', score: '13 : 6', skillLevel: 1356, skillChange: 25, kd: '29/12', kdRatio: 2.42, krRatio: 1.53, map: 'Mil. Warehouses' },
];

export const gameStatsChartData = matchHistoryData.map(match => ({
    date: `${match.date} ${match.time}`,
    skillLevel: match.skillLevel
})).reverse();

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
  { name: "EliGE", country: "Соединённые Штаты Америки (США)", elo: 3245, level: 10 },
  { name: "sh1ro", country: "Россия", elo: 3210, level: 10 },
  { name: "Ax1Le", country: "Россия", elo: 3185, level: 10 },
  { name: "blameF", country: "Дания", elo: 3150, level: 10 },
  { name: "Spinx", country: "Израиль", elo: 3125, level: 10 },
  { name: "stavn", country: "Дания", elo: 3095, level: 10 },
  { name: "jabbi", country: "Дания", elo: 3070, level: 10 },
  { name: "jks", country: "Австралия", elo: 3045, level: 10 },
  { name: "KSCERATO", country: "Бразилия", elo: 3020, level: 10 },
  { name: "YEKINDAR", country: "Латвия", elo: 2995, level: 10 },
];
