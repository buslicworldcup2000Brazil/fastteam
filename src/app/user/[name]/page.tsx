"use client";

import React from 'react';
import ProfileView from '@/components/profile/profile-view';
import { friendsData } from '@/lib/data';
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
    level: 8,
    country: "Германия",
    avatarUrl: `https://picsum.photos/seed/${name}/200/200`,
    bannerUrl: `https://picsum.photos/seed/banner-${name}/1200/400`,
    winStreak: 3
  };

  return <ProfileView initialUser={friend} isSelf={false} />;
}
