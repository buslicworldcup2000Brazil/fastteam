"use client";

import React from 'react';
import ProfileView from '@/components/profile/profile-view';
import { userProfile } from '@/lib/data';

export default function Home() {
  return <ProfileView initialUser={userProfile} isSelf={true} />;
}
