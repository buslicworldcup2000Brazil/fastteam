"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';

type MapRate = {
  name: string;
  winRate: number;
  matches: number;
};

type MapWinRatesProps = {
  rates: MapRate[];
};

export default function MapWinRates({ rates }: MapWinRatesProps) {
  const { language } = useTheme();
  const t = translations[language];

  const getTranslatedMapName = (name: string) => {
    switch (name) {
      case 'Factory': return t.map_factory;
      case 'House': return t.map_house;
      case 'Mil. Warehouses': return t.map_warehouses;
      default: return name;
    }
  };

  return (
    <Card className="bg-[#121212] border-white/5">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase italic tracking-tighter">{t.map_win_rates}</CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest opacity-60">{t.last_90_games}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {rates.map((map) => (
          <div key={map.name} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <div className="flex flex-col">
                <span>{getTranslatedMapName(map.name)}</span>
                <span className="text-[10px] text-muted-foreground font-normal lowercase">{t.matches}: {map.matches}</span>
              </div>
              <span className={map.winRate >= 50 ? 'text-green-500' : 'text-red-500'}>{map.winRate}%</span>
            </div>
            <Progress value={map.winRate} className="h-1.5 bg-white/5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}