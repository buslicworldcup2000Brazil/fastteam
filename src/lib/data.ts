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
  lastFlagChange: 0,
};

export const friendsData = [
  { name: "S1mple", avatarUrl: "https://picsum.photos/seed/s1/100/100", status: "online", country: "Украина", level: 10, elo: 3842 },
  { name: "m0NESY", avatarUrl: "https://picsum.photos/seed/mo/100/100", status: "ingame", country: "Россия", level: 10, elo: 3612 },
  { name: "donk", avatarUrl: "https://picsum.photos/seed/do/100/100", status: "online", country: "Россия", level: 10, elo: 3589 },
  { name: "ZywOo", avatarUrl: "https://picsum.photos/seed/zy/100/100", status: "offline", country: "Франция", level: 10, elo: 3721 },
];

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
];
