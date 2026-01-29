import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Clock, Crosshair, ShieldCheck, Trophy, Swords, Star } from 'lucide-react';

export const userProfile = {
  name: "ShadowStriker",
  handle: "@shadowstriker99",
  tags: ["Pro", "Streamer", "MVP"],
  bannerUrl: PlaceHolderImages.find(img => img.id === 'profile-banner')?.imageUrl || 'https://picsum.photos/seed/1/1200/400',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || 'https://picsum.photos/seed/2/200/200',
};

export const statsData = [
  { id: '1', title: 'K/D Ratio', value: '2.45', icon: Crosshair },
  { id: '2', title: 'Win Rate', value: '68%', icon: Trophy },
  { id: '3', title: 'Headshot %', value: '42%', icon: ShieldCheck },
  { id: '4', title: 'Hours Played', value: '1,200', icon: Clock },
  { id: '5', title: 'Matches Won', value: '816', icon: Swords },
  { id: '6', title: 'Avg. Score', value: '5,320', icon: Star },
];

export const friendsData = [
  { id: '1', name: 'CyberReaper', handle: '@cyber', avatar: PlaceHolderImages.find(img => img.id === 'friend-1') as ImagePlaceholder, status: 'online' as const },
  { id: '2', name: 'VoidWalker', handle: '@void', avatar: PlaceHolderImages.find(img => img.id === 'friend-2') as ImagePlaceholder, status: 'online' as const },
  { id: '3', name: 'PixelPhantm', handle: '@pixel', avatar: PlaceHolderImages.find(img => img.id === 'friend-3') as ImagePlaceholder, status: 'online' as const },
  { id: '4', name: 'IronClad', handle: '@iron', avatar: PlaceHolderImages.find(img => img.id === 'friend-4') as ImagePlaceholder, status: 'ingame' as const },
  { id: '5', name: 'Ghost_Ops', handle: '@ghost', avatar: PlaceHolderImages.find(img => img.id === 'friend-5') as ImagePlaceholder, status: 'ingame' as const },
];

export const matchHistoryData = [
    { id: '1', date: '28 Jan 2026', time: '02:04', result: 'win', score: '13 : 11', skillLevel: 4471, skillChange: 17, kda: '30/20/9', adr: 131.7, kdRatio: 1.50, krRatio: 1.25, map: 'Ancient' },
    { id: '2', date: '28 Jan 2026', time: '01:20', result: 'win', score: '13 : 11', skillLevel: 4454, skillChange: 25, kda: '25/16/5', adr: 96.3, kdRatio: 1.56, krRatio: 1.04, map: 'Dust 2' },
    { id: '3', date: '28 Jan 2026', time: '00:31', result: 'win', score: '13 : 4', skillLevel: 4429, skillChange: 29, kda: '23/10/1', adr: 123.5, kdRatio: 2.30, krRatio: 1.35, map: 'Mirage' },
    { id: '4', date: '27 Jan 2026', time: '23:50', result: 'win', score: '13 : 8', skillLevel: 4400, skillChange: 30, kda: '32/14/5', adr: 151.4, kdRatio: 2.29, krRatio: 1.52, map: 'Mirage' },
    { id: '5', date: '27 Jan 2026', time: '21:46', result: 'win', score: '13 : 9', skillLevel: 4370, skillChange: 29, kda: '31/13/4', adr: 142.9, kdRatio: 2.38, krRatio: 1.41, map: 'Dust 2' },
    { id: '6', date: '25 Jan 2026', time: '17:05', result: 'loss', score: '11 : 13', skillLevel: 4341, skillChange: -34, kda: '23/17/4', adr: 106.7, kdRatio: 1.35, krRatio: 0.96, map: 'Nuke' },
    { id: '7', date: '25 Jan 2026', time: '16:19', result: 'loss', score: '9 : 13', skillLevel: 4375, skillChange: -32, kda: '30/16/1', adr: 134.0, kdRatio: 1.88, krRatio: 1.36, map: 'Mirage' },
    { id: '8', date: '25 Jan 2026', time: '15:08', result: 'win', score: '13 : 11', skillLevel: 4407, skillChange: 25, kda: '39/15/7', adr: 153.2, kdRatio: 2.60, krRatio: 1.62, map: 'Nuke' },
    { id: '9', date: '25 Jan 2026', time: '14:18', result: 'win', score: '13 : 2', skillLevel: 4382, skillChange: 26, kda: '15/10/6', adr: 103.5, kdRatio: 1.50, krRatio: 1.00, map: 'Anubis' },
    { id: '10', date: '25 Jan 2026', time: '00:20', result: 'win', score: '13 : 6', skillLevel: 4356, skillChange: 25, kda: '29/12/4', adr: 151.8, kdRatio: 2.42, krRatio: 1.53, map: 'Overpass' },
];

export const gameStatsChartData = matchHistoryData.map(match => ({
    date: `${match.date} ${match.time}`,
    skillLevel: match.skillLevel
})).reverse();
