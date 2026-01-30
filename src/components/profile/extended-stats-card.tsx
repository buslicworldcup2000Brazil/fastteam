"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import LevelIcon from '@/components/ui/level-icon';
import { calculateLevel } from '@/lib/data';

type ExtendedStatsCardProps = {
  stats: {
    wins: number;
    losses: number;
    highestElo: number;
    lowestElo: number;
    eloChange: number;
  };
};

export default function ExtendedStatsCard({ stats }: ExtendedStatsCardProps) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <Card className="bg-[#121212] border-white/5 overflow-hidden">
      <CardContent className="p-6 space-y-8">
        {/* Win / Loss Summary */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span className="text-green-500 font-bold text-xs">{t.wins_short}</span>
              </div>
              <span className="text-green-500 font-black text-xl">{stats.wins}</span>
            </div>
            <span className="text-white/20 font-bold">/</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <span className="text-red-500 font-bold text-xs">{t.losses_short}</span>
              </div>
              <span className="text-red-500 font-black text-xl">{stats.losses}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/20" />
        </div>

        {/* Elo Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-muted-foreground font-bold tracking-tight">{t.highest_elo}</span>
            <div className="flex items-center gap-2">
              <LevelIcon level={calculateLevel(stats.highestElo)} className="h-7 w-7" />
              <span className="text-white font-black text-lg font-mono">{stats.highestElo}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-muted-foreground font-bold tracking-tight">{t.lowest_elo}</span>
            <div className="flex items-center gap-2">
              <LevelIcon level={calculateLevel(stats.lowestElo)} className="h-7 w-7" />
              <span className="text-white font-black text-lg font-mono">{stats.lowestElo}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold tracking-tight">{t.elo_change}</span>
              <Info className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <span className="text-white font-black text-lg font-mono">+{stats.eloChange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
