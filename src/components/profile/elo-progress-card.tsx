"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import LevelIcon from '@/components/ui/level-icon';
import { cn } from '@/lib/utils';

type EloProgressCardProps = {
  currentElo: number;
  currentLevel: number;
};

const LEVEL_THRESHOLDS = [
  { level: 1, elo: 100, color: '#3b3b3b' },
  { level: 2, elo: 501, color: '#00ff16' },
  { level: 3, elo: 751, color: '#00ff16' },
  { level: 4, elo: 901, color: '#FFEA00' },
  { level: 5, elo: 1051, color: '#FFEA00' },
  { level: 6, elo: 1201, color: '#FFEA00' },
  { level: 7, elo: 1351, color: '#FF9100' },
  { level: 8, elo: 1531, color: '#FF9100' },
  { level: 9, elo: 1751, color: '#D50000' },
  { level: 10, elo: 2001, color: '#D50000' },
];

const PRO_THRESHOLD = 3663;

export default function EloProgressCard({ currentElo, currentLevel }: EloProgressCardProps) {
  const { language } = useTheme();
  const t = translations[language];

  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.elo > currentElo) || { elo: PRO_THRESHOLD, level: 11 };
  const eloToNext = Math.max(0, nextThreshold.elo - currentElo);

  return (
    <Card className="bg-[#121212] border-white/5 overflow-hidden">
      <CardContent className="p-6 space-y-8">
        {/* Top Info */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">
            <LevelIcon level={currentLevel} className="h-16 w-16" />
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-white">{currentElo.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xl font-black text-white">{eloToNext}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
              {t.elo_needed_to_next}
            </span>
          </div>
        </div>

        {/* Levels Row */}
        <div className="flex items-center justify-between gap-1 px-1">
          {LEVEL_THRESHOLDS.map((threshold) => (
            <div key={threshold.level} className="flex flex-col items-center gap-2 group">
              <div className={cn(
                "relative transition-all duration-300",
                currentLevel === threshold.level ? "scale-110" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
              )}>
                <LevelIcon level={threshold.level} className="h-10 w-10" />
              </div>
              <span className={cn(
                "text-[9px] font-mono font-bold tracking-tight",
                currentLevel === threshold.level ? "text-white" : "text-muted-foreground/40"
              )}>
                {threshold.elo}
              </span>
            </div>
          ))}
          {/* Pro/Crown Badge */}
          <div className="flex flex-col items-center gap-2 opacity-40 grayscale">
             <div className="h-10 w-10 flex items-center justify-center border-2 border-primary/20 rounded-full">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
                   <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                </svg>
             </div>
             <span className="text-[9px] font-mono font-bold text-muted-foreground/40">{PRO_THRESHOLD}</span>
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="flex h-1.5 w-full gap-1 overflow-hidden">
           {LEVEL_THRESHOLDS.map((threshold, idx) => {
             const isActive = currentLevel >= threshold.level;
             return (
               <div 
                 key={idx} 
                 className={cn(
                   "flex-1 rounded-sm transition-all duration-500",
                   isActive ? "" : "bg-white/5"
                 )}
                 style={{ backgroundColor: isActive ? threshold.color : undefined }}
               />
             );
           })}
           <div className="flex-1 rounded-sm bg-white/5" />
        </div>
      </CardContent>
    </Card>
  );
}