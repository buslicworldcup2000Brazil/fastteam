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
import { userProfile, statsData, friendsData, matchHistoryData, gameStatsChartData } from '@/lib/data';
import MatchHistoryTable from '@/components/profile/match-history-table';
import GameStatsChart from '@/components/profile/game-stats-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LevelIcon from '@/components/ui/level-icon';

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
        <Tabs defaultValue="match_history" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-card border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="game_stats">Game Stats</TabsTrigger>
            <TabsTrigger value="match_history">Match History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Rank</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <LevelIcon level={profile.level} className="h-24 w-24" />
                    <div>
                      <p className="text-4xl font-bold">{profile.elo.toLocaleString()} <span className="text-lg text-muted-foreground">ELO</span></p>
                      <p className="text-muted-foreground">Level {profile.level}</p>
                    </div>
                  </CardContent>
                </Card>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Player Statistics</h2>
                  <p className="text-sm text-muted-foreground mb-4">Based on the last 30 games</p>
                  <StatsGrid stats={statsData} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Friends Online</h2>
                <FriendsList friends={friendsData} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="game_stats">
             <GameStatsChart data={gameStatsChartData} />
          </TabsContent>
          <TabsContent value="match_history">
            <MatchHistoryTable matches={matchHistoryData} />
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
