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
