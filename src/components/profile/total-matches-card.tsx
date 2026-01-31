"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { Gamepad2 } from 'lucide-react';

type TotalMatchesCardProps = {
  count: number;
};

export default function TotalMatchesCard({ count }: TotalMatchesCardProps) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <Card className="bg-gradient-to-br from-card to-accent/5 relative overflow-hidden">
      <div className="absolute right-[-10%] bottom-[-20%] select-none pointer-events-none opacity-25 z-0">
        <svg width="250" height="250" viewBox="0 0 250 250" className="overflow-visible">
          <defs>
            <linearGradient id="matchesFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="240"
            y="230"
            textAnchor="end"
            fill="none"
            stroke="url(#matchesFade)"
            strokeWidth="3"
            className="font-black italic"
            style={{ fontSize: '180px', lineHeight: '1' }}
          >
            {count}
          </text>
        </svg>
      </div>

      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-accent" />
          {t.total_matches}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-5xl font-black italic tracking-tighter text-accent">
          {count.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}