
'use client';

import React from 'react';

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export default function RankBadge({ rank, className }: RankBadgeProps) {
  // Common path for all badges
  const badgePath = "M20,10 L95,10 L80,90 L5,90 Z";

  if (rank === 1) {
    return (
      <svg width="40" height="40" viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="20%" stopColor="#fcf6ba" />
            <stop offset="40%" stopColor="#b38728" />
            <stop offset="60%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
          <pattern id="tech-lines" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" strokeWidth="1" opacity="0.2"/>
          </pattern>
          <linearGradient id="glass-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="50%" stopColor="white" stopOpacity="0.0"/>
            <stop offset="51%" stopColor="white" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={badgePath} fill="#000" transform="translate(4,4)" opacity="0.5"/>
        <path d={badgePath} fill="url(#gold-metal)"/>
        <path d={badgePath} fill="url(#tech-lines)"/>
        <path d="M25,15 L90,15 L78,85 L13,85 Z" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1"/>
        <path d={badgePath} fill="url(#glass-sheen)"/>
        <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="50" textAnchor="middle" fill="#2d2200" fontWeight="bold" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.4)' }}>1</text>
      </svg>
    );
  }

  if (rank === 2) {
    return (
      <svg width="40" height="40" viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8c8c8c" />
            <stop offset="20%" stopColor="#e6e6e6" />
            <stop offset="40%" stopColor="#8c8c8c" />
            <stop offset="60%" stopColor="#d9d9d9" />
            <stop offset="100%" stopColor="#595959" />
          </linearGradient>
        </defs>
        <path d={badgePath} fill="#000" transform="translate(4,4)" opacity="0.5"/>
        <path d={badgePath} fill="url(#silver-metal)"/>
        <path d={badgePath} fill="url(#tech-lines)"/>
        <path d="M25,15 L90,15 L78,85 L13,85 Z" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1"/>
        <path d={badgePath} fill="url(#glass-sheen)"/>
        <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="50" textAnchor="middle" fill="#1a1a1a" fontWeight="bold" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>2</text>
      </svg>
    );
  }

  if (rank === 3) {
    return (
      <svg width="40" height="40" viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="bronze-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#804a00" />
            <stop offset="20%" stopColor="#d99a4e" />
            <stop offset="40%" stopColor="#8c5814" />
            <stop offset="60%" stopColor="#d99a4e" />
            <stop offset="100%" stopColor="#693b00" />
          </linearGradient>
        </defs>
        <path d={badgePath} fill="#000" transform="translate(4,4)" opacity="0.5"/>
        <path d={badgePath} fill="url(#bronze-metal)"/>
        <path d={badgePath} fill="url(#tech-lines)"/>
        <path d="M25,15 L90,15 L78,85 L13,85 Z" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1"/>
        <path d={badgePath} fill="url(#glass-sheen)"/>
        <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="50" textAnchor="middle" fill="#2e1a05" fontWeight="bold" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.3)' }}>3</text>
      </svg>
    );
  }

  // 4-20
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="dark-carbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#353b48" />
          <stop offset="100%" stopColor="#1e272e" />
        </linearGradient>
      </defs>
      <path d={badgePath} fill="#000" transform="translate(4,4)" opacity="0.7"/>
      <path d={badgePath} fill="url(#dark-carbon)" stroke="#444" strokeWidth="1"/>
      <path d={badgePath} fill="url(#tech-lines)"/>
      <path d={badgePath} fill="none" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M20,10 L30,10 M95,10 L85,10 M80,90 L70,90 M5,90 L15,90" stroke="#fff" strokeWidth="4"/>
      <text x="52" y="68" fontFamily="Inter, sans-serif" fontSize={rank > 9 ? "42" : "48"} textAnchor="middle" fill="#fff" fontWeight="bold" style={{ filter: 'drop-shadow(0px 0px 5px rgba(255,255,255,0.5))', letterSpacing: '-2px' }}>{rank}</text>
      <path d="M20,10 L95,10 L88,50 L12,50 Z" fill="white" opacity="0.05"/>
    </svg>
  );
}
