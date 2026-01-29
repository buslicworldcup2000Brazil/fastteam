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
import EditProfileDialog from '@/components/profile/edit-profile-dialog';
import { userProfile, statsData, matchHistoryData, gameStatsChartData } from '@/lib/data';
import MatchHistoryTable from '@/components/profile/match-history-table';
import GameStatsChart from '@/components/profile/game-stats-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LevelIcon from '@/components/ui/level-icon';
import LevelInfoDialog from '@/components/profile/level-info-dialog';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Swords } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { language } = useTheme();
  const t = translations[language];
  
  const [profile, setProfile] = useState(userProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLevelInfoOpen, setIsLevelInfoOpen] = useState(false);

  const handleProfileUpdate = (values: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      name: values.name,
      bannerUrl: values.bannerUrl || prevProfile.bannerUrl,
      avatarUrl: values.avatarUrl || prevProfile.avatarUrl,
      country: values.country,
      language: values.language,
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-card border">
              <TabsTrigger value="overview">{t.overview}</TabsTrigger>
              <TabsTrigger value="game_stats">{t.game_stats}</TabsTrigger>
              <TabsTrigger value="match_history">{t.match_history}</TabsTrigger>
            </TabsList>
            
            <Button asChild size="lg" className="w-full md:w-auto font-bold px-8 shadow-lg shadow-primary/20">
              <Link href="/matchmaking">
                <Swords className="mr-2 h-5 w-5" /> 
                {t.play}
              </Link>
            </Button>
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.rank}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <button onClick={() => setIsLevelInfoOpen(true)} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
                      <LevelIcon level={profile.level} className="h-24 w-24" />
                    </button>
                    <div>
                      <p className="text-4xl font-bold">{profile.elo} <span className="text-lg text-muted-foreground">{t.elo}</span></p>
                      <p className="text-muted-foreground">{t.level} {profile.level}</p>
                    </div>
                  </CardContent>
                </Card>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t.player_stats}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{t.stats_subtitle}</p>
                  <StatsGrid stats={statsData} />
                </div>
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
        currentUser={profile}
      />

      <LevelInfoDialog isOpen={isLevelInfoOpen} setIsOpen={setIsLevelInfoOpen} />
    </div>
  );
}
