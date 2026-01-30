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
import MatchHistoryTable from '@/components/profile/match-history-table';
import GameStatsChart from '@/components/profile/game-stats-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LevelIcon from '@/components/ui/level-icon';
import LevelInfoDialog from '@/components/profile/level-info-dialog';
import LeaderboardDialog from '@/components/profile/leaderboard-dialog';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Swords, Flame, Trophy, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FriendsList from './friends-list';
import { friendsData } from '@/lib/data';

type ProfileViewProps = {
  initialUser: any;
  isSelf?: boolean;
};

export default function ProfileView({ initialUser, isSelf = false }: ProfileViewProps) {
  const { language } = useTheme();
  const t = translations[language];
  
  const [profile, setProfile] = useState(initialUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLevelInfoOpen, setIsLevelInfoOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleProfileUpdate = (values: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      name: values.name,
      bio: values.bio,
      bannerUrl: values.bannerUrl || prevProfile.bannerUrl,
      avatarUrl: values.avatarUrl || prevProfile.avatarUrl,
      country: values.country,
      language: values.language,
    }));
  };

  const getLevelColorClass = (level: number) => {
    if (level <= 3) return 'from-green-500/10';
    if (level <= 7) return 'from-yellow-500/10';
    if (level <= 9) return 'from-orange-500/10';
    return 'from-red-500/10';
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {!isSelf && (
        <div className="fixed top-6 left-6 z-50">
          <Button asChild variant="outline" className="border-primary/20 bg-background/50 backdrop-blur-md hover:bg-primary/10 transition-all font-bold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.view_profile}
            </Link>
          </Button>
        </div>
      )}

      <ProfileHeader
        user={profile}
        onEdit={() => setIsDialogOpen(true)}
        hideButtons={!isSelf}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-card border">
              <TabsTrigger value="overview">{t.overview}</TabsTrigger>
              <TabsTrigger value="game_stats">{t.game_stats}</TabsTrigger>
              <TabsTrigger value="match_history">{t.match_history}</TabsTrigger>
            </TabsList>
            
            {isSelf && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="flex-1 md:flex-none font-bold"
                >
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  {t.top_players}
                </Button>
                <Button asChild size="lg" className="flex-1 md:flex-none font-bold px-8 shadow-lg shadow-primary/20">
                  <Link href="/matchmaking">
                    <Swords className="mr-2 h-5 w-5" /> 
                    {t.play}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={cn(
                    "bg-gradient-to-br to-card/5",
                    getLevelColorClass(profile.level)
                  )}>
                    <CardHeader>
                      <CardTitle>{t.rank}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <button onClick={() => setIsLevelInfoOpen(true)} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md transition-transform hover:scale-105">
                        <LevelIcon level={profile.level} className="h-20 w-20" />
                      </button>
                      <div>
                        <p className="text-3xl font-bold">{profile.elo} <span className="text-sm text-muted-foreground">{t.elo}</span></p>
                        <p className="text-muted-foreground text-sm">{t.level} {profile.level}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
                    {/* Watermark Typography Background */}
                    <div className="absolute right-[-10%] bottom-[-20%] select-none pointer-events-none opacity-25 z-0">
                      <svg width="250" height="250" viewBox="0 0 250 250" className="overflow-visible">
                        <defs>
                          <linearGradient id="streakFade" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <text
                          x="240"
                          y="230"
                          textAnchor="end"
                          fill="none"
                          stroke="url(#streakFade)"
                          strokeWidth="3"
                          className="font-black italic"
                          style={{ fontSize: '280px', lineHeight: '1' }}
                        >
                          {profile.winStreak}
                        </text>
                      </svg>
                    </div>

                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {t.win_streak}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-5xl font-black italic tracking-tighter text-primary">
                        {profile.winStreak}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-1">{t.player_stats}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{t.stats_subtitle}</p>
                  <StatsGrid stats={profile.stats || []} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">{t.friends}</h2>
                </div>
                <FriendsList friends={friendsData as any} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="game_stats">
             <GameStatsChart data={profile.chartData || []} />
          </TabsContent>
          <TabsContent value="match_history">
            <MatchHistoryTable matches={profile.matchHistory || []} />
          </TabsContent>
        </Tabs>
      </main>

      {isSelf && (
        <EditProfileDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onUpdate={handleProfileUpdate}
          currentUser={profile}
        />
      )}

      <LevelInfoDialog isOpen={isLevelInfoOpen} setIsOpen={setIsLevelInfoOpen} />
      <LeaderboardDialog isOpen={isLeaderboardOpen} setIsOpen={setIsLeaderboardOpen} />
    </div>
  );
}
