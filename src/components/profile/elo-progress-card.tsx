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
  { level: 1, start: 100, end: 300, color: '#00ff16' },
  { level: 2, start: 300, end: 500, color: '#00ff16' },
  { level: 3, start: 500, end: 700, color: '#00ff16' },
  { level: 4, start: 700, end: 900, color: '#FFEA00' },
  { level: 5, start: 900, end: 1100, color: '#FFEA00' },
  { level: 6, start: 1100, end: 1300, color: '#FFEA00' },
  { level: 7, start: 1300, end: 1500, color: '#FFEA00' },
  { level: 8, start: 1500, end: 1700, color: '#FF9100' },
  { level: 9, start: 1700, end: 1899, color: '#FF9100' },
  { level: 10, start: 1900, end: 2100, color: '#D50000' },
];

export default function EloProgressCard({ currentElo, currentLevel }: EloProgressCardProps) {
  const { language } = useTheme();
  const t = translations[language];

  const currentThreshold = LEVEL_THRESHOLDS.find(t => currentElo >= t.start && currentElo < t.end) || 
                          (currentElo >= 2100 ? LEVEL_THRESHOLDS[9] : LEVEL_THRESHOLDS[0]);
  
  const eloToNext = currentElo >= 2100 ? 0 : Math.max(0, currentThreshold.end - currentElo);

  return (
    <Card className="bg-[#121212] border-white/5 overflow-hidden">
      <CardContent className="p-6 space-y-8">
        {/* Top Info */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">
            <LevelIcon level={currentLevel} className="h-16 w-16" />
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-white">
                {Math.round(currentElo)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                {t.elo}
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xl font-black text-white">{Math.round(eloToNext)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
              {t.elo_needed_to_next}
            </span>
          </div>
        </div>

        {/* Segmented Row: Icons on top, Bars below */}
        <div className="grid grid-cols-10 gap-1.5">
          {LEVEL_THRESHOLDS.map((threshold) => {
            // Calculate progress for this specific segment
            let progress = 0;
            if (currentElo >= threshold.end) {
              progress = 100;
            } else if (currentElo >= threshold.start) {
              progress = ((currentElo - threshold.start) / (threshold.end - threshold.start)) * 100;
            }

            const isActive = currentLevel === threshold.level;

            return (
              <div key={threshold.level} className="flex flex-col items-center gap-3">
                {/* Icon */}
                <div className={cn(
                  "relative transition-all duration-300",
                  isActive ? "scale-110" : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                )}>
                  <LevelIcon level={threshold.level} className="h-10 w-10" />
                </div>

                {/* Segment Bar (Progress bar under icon) */}
                <div className="h-1.5 w-full bg-white/5 rounded-sm overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: threshold.color
                    }}
                  />
                </div>
                
                {/* Value */}
                <span className={cn(
                  "text-[9px] font-mono font-bold tracking-tight",
                  isActive ? "text-white" : "text-muted-foreground/40"
                )}>
                  {threshold.start}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
