'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LevelIconProps {
  level: number;
  className?: string;
}

const LevelIcon: React.FC<LevelIconProps> = ({ level, className }) => {
  let color: string;
  switch (true) {
    case level >= 1 && level <= 3:
      color = '#00ff16'; // Green
      break;
    case level >= 4 && level <= 7:
      color = '#FFEA00'; // Yellow
      break;
    case level >= 8 && level <= 9:
      color = '#FF9100'; // Orange
      break;
    case level === 10:
      color = '#D50000'; // Red
      break;
    default:
      // A fallback color, though level should be within 1-10
      color = 'hsl(var(--muted-foreground))';
  }

  // For a given level N, the dash array should be N*10
  const dashArray = `${level * 10} 100`;

  return (
    <div className={cn(className)}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeWidth="5">
          {/* Skeleton/background path */}
          <path d="M50 5 L95 38 L80 90 L20 90 L5 38 Z" stroke="hsl(var(--muted-foreground))" opacity="0.3"/>
          
          {/* Active paths */}
          <path d="M50 5 L95 38 L80 90 L50 90" stroke={color} pathLength="100" strokeDasharray={dashArray} />
          <path d="M50 5 L5 38 L20 90 L50 90" stroke={color} pathLength="100" strokeDasharray={dashArray} />

          {/* Level number */}
          <text x="50" y="65" fontSize="40" textAnchor="middle" fill={color} stroke="none" fontWeight="bold">{level}</text>
      </svg>
    </div>
  );
};

export default LevelIcon;
