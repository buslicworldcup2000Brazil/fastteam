import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Trophy, Swords, Star, Crosshair } from 'lucide-react';

const elo = 4550;
const level = Math.min(10, Math.floor(elo / 450));

export const userProfile = {
  name: "ShadowStriker",
  handle: "@shadowstriker99",
  tags: ["Pro", "Streamer", "MVP"],
  bannerUrl: PlaceHolderImages.find(img => img.id === 'profile-banner')?.imageUrl || 'https://picsum.photos/seed/1/1200/400',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || 'https://picsum.photos/seed/2/200/200',
  elo: elo,
  level: level,
};

export const statsData = [
  { id: '1', title: 'K/D Ratio', value: '2.45', icon: Swords, progress: 49 },
  { id: '2', title: 'Win Rate', value: '68%', icon: Trophy, progress: 68 },
  { id: '5', title: 'Matches Won', value: '816', icon: Star, progress: 54 },
  { id: '6', title: 'Avg. Kills', value: '18.5', icon: Crosshair, progress: 62 },
];

export const friendsData = [
  { id: '1', name: 'CyberReaper', handle: '@cyber', avatar: PlaceHolderImages.find(img => img.id === 'friend-1') as ImagePlaceholder, status: 'online' as const },
  { id: '2', name: 'VoidWalker', handle: '@void', avatar: PlaceHolderImages.find(img => img.id === 'friend-2') as ImagePlaceholder, status: 'online' as const },
  { id: '3', name: 'PixelPhantm', handle: '@pixel', avatar: PlaceHolderImages.find(img => img.id === 'friend-3') as ImagePlaceholder, status: 'online' as const },
  { id: '4', name: 'IronClad', handle: '@iron', avatar: PlaceHolderImages.find(img => img.id === 'friend-4') as ImagePlaceholder, status: 'ingame' as const },
  { id: '5', name: 'Ghost_Ops', handle: '@ghost', avatar: PlaceHolderImages.find(img => img.id === 'friend-5') as ImagePlaceholder, status: 'ingame' as const },
];

export const matchHistoryData = [
    { id: '1', date: '28 Jan 2026', time: '02:04', result: 'win', score: '13 : 11', skillLevel: 4471, skillChange: 17, kd: '30/20', kdRatio: 1.50, krRatio: 1.25, map: 'Mil. Warehouses' },
    { id: '2', date: '28 Jan 2026', time: '01:20', result: 'win', score: '13 : 11', skillLevel: 4454, skillChange: 25, kd: '25/16', kdRatio: 1.56, krRatio: 1.04, map: 'House' },
    { id: '3', date: '28 Jan 2026', time: '00:31', result: 'win', score: '13 : 4', skillLevel: 4429, skillChange: 29, kd: '23/10', kdRatio: 2.30, krRatio: 1.35, map: 'Factory' },
    { id: '4', date: '27 Jan 2026', time: '23:50', result: 'win', score: '13 : 8', skillLevel: 4400, skillChange: 30, kd: '32/14', kdRatio: 2.29, krRatio: 1.52, map: 'Mil. Warehouses' },
    { id: '5', date: '27 Jan 2026', time: '21:46', result: 'win', score: '13 : 9', skillLevel: 4370, skillChange: 29, kd: '31/13', kdRatio: 2.38, krRatio: 1.41, map: 'House' },
    { id: '6', date: '25 Jan 2026', time: '17:05', result: 'loss', score: '11 : 13', skillLevel: 4341, skillChange: -34, kd: '23/17', kdRatio: 1.35, krRatio: 0.96, map: 'Factory' },
    { id: '7', date: '25 Jan 2026', time: '16:19', result: 'loss', score: '9 : 13', skillLevel: 4375, skillChange: -32, kd: '30/16', kdRatio: 1.88, krRatio: 1.36, map: 'Mil. Warehouses' },
    { id: '8', date: '25 Jan 2026', time: '15:08', result: 'win', score: '13 : 11', skillLevel: 4407, skillChange: 25, kd: '39/15', kdRatio: 2.60, krRatio: 1.62, map: 'House' },
    { id: '9', date: '25 Jan 2026', time: '14:18', result: 'win', score: '13 : 2', skillLevel: 4382, skillChange: 26, kd: '15/10', kdRatio: 1.50, krRatio: 1.00, map: 'Factory' },
    { id: '10', date: '25 Jan 2026', time: '00:20', result: 'win', score: '13 : 6', skillLevel: 4356, skillChange: 25, kd: '29/12', kdRatio: 2.42, krRatio: 1.53, map: 'Mil. Warehouses' },
];

export const gameStatsChartData = matchHistoryData.map(match => ({
    date: `${match.date} ${match.time}`,
    skillLevel: match.skillLevel
})).reverse();
