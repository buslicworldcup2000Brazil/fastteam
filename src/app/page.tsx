"use client";

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ProfileHeader from '@/components/profile/profile-header';
import StatsGrid from '@/components/profile/stats-grid';
import FriendsList from '@/components/profile/friends-list';
import EditProfileDialog from '@/components/profile/edit-profile-dialog';
import { userProfile, statsData, friendsData } from '@/lib/data';

export default function Home() {
  const [profile, setProfile] = useState(userProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProfileUpdate = (newUrls: { bannerUrl: string; avatarUrl: string }) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      bannerUrl: newUrls.bannerUrl || prevProfile.bannerUrl,
      avatarUrl: newUrls.avatarUrl || prevProfile.avatarUrl,
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileHeader
        user={profile}
        onEdit={() => setIsDialogOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-card border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="game_stats">Game Stats</TabsTrigger>
            <TabsTrigger value="match_history">Match History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
                <StatsGrid stats={statsData} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Friends Online</h2>
                <FriendsList friends={friendsData} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="game_stats">
             <div className="flex items-center justify-center h-48 bg-card rounded-lg">
                <p className="text-muted-foreground">Game stats will be displayed here.</p>
              </div>
          </TabsContent>
          <TabsContent value="match_history">
            <div className="flex items-center justify-center h-48 bg-card rounded-lg">
                <p className="text-muted-foreground">Match history will be displayed here.</p>
              </div>
          </TabsContent>
        </Tabs>
      </main>

      <EditProfileDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onUpdate={handleProfileUpdate}
        currentBannerUrl={profile.bannerUrl}
        currentAvatarUrl={profile.avatarUrl}
      />
    </div>
  );
}
