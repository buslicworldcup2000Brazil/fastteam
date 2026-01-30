"use client";

import React from 'react';
import ProfileView from '@/components/profile/profile-view';
import { friendsData, matchHistoryData, calculateLevel } from '@/lib/data';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  
  // Find player in mock data or fallback
  const friend = friendsData.find(f => f.name === name) || {
    name: name,
    bio: "Competitor",
    handle: `@${name.toLowerCase()}`,
    tags: ["Pro"],
    elo: 1500,
    level: calculateLevel(1500),
    country: "Германия",
    avatarUrl: `https://picsum.photos/seed/${name}/200/200`,
    bannerUrl: `https://picsum.photos/seed/banner-${name}/1200/400`,
    winStreak: 3,
    stats: [
      { id: '1', title: 'K/D Ratio', value: '1.20', icon: require('lucide-react').Swords, progress: 40 },
      { id: '2', title: 'Win Rate', value: '50%', icon: require('lucide-react').Trophy, progress: 50 },
      { id: '5', title: 'Matches Won', value: '100', icon: require('lucide-react').Star, progress: 30 },
      { id: '6', title: 'Avg. Kills', value: '12.5', icon: require('lucide-react').Crosshair, progress: 45 },
    ],
    matchHistory: matchHistoryData,
    chartData: matchHistoryData.map(m => ({ date: `${m.date} ${m.time}`, skillLevel: 1500 + Math.floor(Math.random() * 50) })).reverse()
  };

  return <ProfileView initialUser={friend} isSelf={false} />;
}
