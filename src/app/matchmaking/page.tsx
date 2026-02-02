'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userProfile, friendsData } from '@/lib/data';
import { Crown, Plus, Share2, MoreVertical, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LevelIcon from '@/components/ui/level-icon';
import { getFlagEmoji } from '@/lib/countries';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { translations } from '@/lib/translations';
import { useTheme } from '@/components/theme-provider';

// --- COMPONENTS ---

const TimerProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full h-1.5 bg-white/5 relative overflow-hidden rounded-full">
      <div 
        className="absolute inset-0 bg-primary transition-all duration-1000 ease-linear origin-center"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
    </div>
  );
};

// --- MOCK DATA ---
const MAPS = [
  { id: 'warehouses', name: 'Mil. Warehouses', image: '/maps/warehouses.jpg' },
  { id: 'house', name: 'House', image: '/maps/house.jpg' },
  { id: 'factory', name: 'Factory', image: '/maps/factory.jpg' },
  { id: 'mil_base', name: 'Mil_Base', image: '/maps/Mil_Base.jpg' },
  { id: 'north', name: 'North', image: '/maps/North.jpg' },
];

const generateTeam = (size: number, seed: string) => {
  return Array.from({ length: size }).map((_, i) => ({
    name: i === 0 && seed === 'A' ? userProfile.name : `Player_${seed}_${i}`,
    country: i === 0 && seed === 'A' ? userProfile.country : ["Россия", "Украина", "Турция", "Германия", "Швеция"][Math.floor(Math.random() * 5)],
    elo: i === 0 && seed === 'A' ? userProfile.elo : 1450 + Math.floor(Math.random() * 1000),
    level: i === 0 && seed === 'A' ? userProfile.level : Math.floor(Math.random() * 10) + 1,
    avatarUrl: i === 0 && seed === 'A' ? userProfile.avatarUrl : `https://picsum.photos/seed/${seed}${i}/100/100`,
    isCaptain: i === 0,
  }));
};

const MatchPlayerCard = ({ player }: { player: any }) => (
  <div className="bg-[#151515] border border-white/5 rounded p-1 md:p-2 flex flex-col gap-1 md:gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 md:gap-2">
        <div className="relative">
          <Avatar className="h-6 w-6 md:h-10 md:w-10 border border-primary/40">
            <AvatarImage src={player.avatarUrl} />
            <AvatarFallback>{player.name[0]}</AvatarFallback>
          </Avatar>
          {player.isCaptain && <Crown className="absolute -top-1 -right-1 h-2 w-2 md:h-3 w-3 text-primary" fill="currentColor" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-0.5 md:gap-1">
             <div className="relative w-3 h-2 md:w-4 md:h-2.5 overflow-hidden rounded-xs border border-white/10 shrink-0">
                <Image src={getFlagEmoji(player.country)} alt={player.country} fill className="object-cover" unoptimized />
              </div>
              <span className="text-[8px] md:text-sm font-bold truncate max-w-[40px] md:max-w-[80px]">{player.name}</span>
          </div>
          <p className="hidden md:block text-[10px] text-muted-foreground leading-none">Stats</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 md:gap-1.5 bg-black/40 px-1 py-0.5 md:px-2 md:py-1 rounded">
         <span className="text-[8px] md:text-xs font-bold">{player.elo}</span>
         <LevelIcon level={player.level} className="h-3 w-3 md:h-4 md:w-4" />
      </div>
    </div>
    
    <div className="hidden md:grid grid-cols-4 gap-1 text-center">
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase font-bold">Matches</p>
        <p className="text-[10px] font-bold">1450</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase font-bold">Win Rate%</p>
        <p className="text-[10px] font-bold">65</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase font-bold">AVG</p>
        <p className="text-[10px] font-bold">24</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase font-bold">K/D</p>
        <p className="text-[10px] font-bold">1.51</p>
      </div>
    </div>
  </div>
);

export default function MatchmakingPage() {
  const { toast } = useToast();
  const { language } = useTheme();
  const t = translations[language];

  const [status, setStatus] = useState<'lobby' | 'searching' | 'ready_check' | 'match_room'>('lobby');
  const [matchStatus, setMatchStatus] = useState<'veto' | 'active'>('veto');
  
  const [searchTime, setSearchTime] = useState(0);
  const [readyCheckTime, setReadyCheckTime] = useState(20);
  const [vetoTime, setVetoTime] = useState(20);
  const [connectTime, setConnectTime] = useState(180);
  
  const [mode, setMode] = useState('5v5');
  const [myVote, setMyVote] = useState<string | null>(null);
  const [otherVotes, setOtherVotes] = useState<Record<string, number>>({ warehouses: 0, house: 0, factory: 0, mil_base: 0, north: 0 });
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [password] = useState(() => Math.floor(Math.random() * (956 - 165 + 1)) + 165);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const teamSize = mode === '5v5' ? 5 : 2;
  const totalPlayers = teamSize * 2;

  const teamA = useMemo(() => generateTeam(teamSize, 'A'), [teamSize]);
  const teamB = useMemo(() => generateTeam(teamSize, 'B'), [teamSize]);

  // Pick one captain to host
  const serverHost = useMemo(() => {
    // временно, надо будет исправить (всегда делаем пользователя хостом для тестов)
    return teamA[0];
  }, [teamA]);

  const isHost = serverHost.name === userProfile.name;

  const getTranslatedMapName = (name: string) => {
    if (name === 'Factory') return t.map_factory;
    if (name === 'House') return t.map_house;
    if (name === 'Mil. Warehouses') return t.map_warehouses;
    if (name === 'Mil_Base') return t.map_mil_base;
    if (name === 'North') return t.map_north;
    return name;
  };

  // Handle Search transition - FAST SEARCH (3 SECONDS)
  useEffect(() => {
    let interval: any;
    if (status === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'searching' && searchTime >= 3) {
      setStatus('ready_check');
      setReadyCheckTime(20);
      setIsReady(false);
      setPlayersReady(0);
    }
  }, [status, searchTime]);

  // Ready Check Timer - FAST READY (1-2 SECONDS)
  useEffect(() => {
    let interval: any;
    if (status === 'ready_check') {
      interval = setInterval(() => {
        setReadyCheckTime(prev => Math.max(0, prev - 1));
        setPlayersReady(prev => {
          if (prev < totalPlayers - 1) {
            const added = Math.floor(Math.random() * 4) + 1;
            return Math.min(totalPlayers - 1, prev + added);
          }
          return prev;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [status, totalPlayers]);

  const handleMatchCompletion = useCallback(() => {
    if (status === 'ready_check' && readyCheckTime === 0) {
      if (!(isReady && playersReady >= totalPlayers - 1)) {
        setStatus('lobby');
      } else {
        setStatus('match_room');
      }
    }
  }, [readyCheckTime, status, isReady, playersReady, totalPlayers]);

  useEffect(() => {
    if (status === 'ready_check' && readyCheckTime === 0) {
        if (!(isReady && playersReady >= totalPlayers - 1)) {
            toast({ title: "Match cancelled", description: "Not enough players were ready.", variant: "destructive" });
        }
        handleMatchCompletion();
    }
  }, [readyCheckTime, status, isReady, playersReady, totalPlayers, toast, handleMatchCompletion]);

  useEffect(() => {
    if (status === 'ready_check' && isReady && playersReady === totalPlayers - 1) {
      const timer = setTimeout(() => setStatus('match_room'), 800);
      return () => clearTimeout(timer);
    }
  }, [isReady, playersReady, totalPlayers, status]);

  // Veto Logic
  useEffect(() => {
    let interval: any;
    if (status === 'match_room' && matchStatus === 'veto') {
      interval = setInterval(() => {
        setVetoTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, matchStatus]);

  useEffect(() => {
    if (status === 'match_room' && matchStatus === 'veto' && vetoTime === 0) {
        const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        const winnerId = sorted[0][1] > 0 ? sorted[0][0] : MAPS[Math.floor(Math.random() * MAPS.length)].id;
        setSelectedMap(MAPS.find(m => m.id === winnerId));
        setMatchStatus('active');
    }
  }, [vetoTime, status, matchStatus]);

  // Connection Timer
  useEffect(() => {
    let interval: any;
    if (status === 'match_room' && matchStatus === 'active' && connectTime > 0) {
      interval = setInterval(() => {
        setConnectTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, matchStatus, connectTime]);

  const votes = useMemo(() => {
    return {
      warehouses: (otherVotes.warehouses || 0) + (myVote === 'warehouses' ? 1 : 0),
      house: (otherVotes.house || 0) + (myVote === 'house' ? 1 : 0),
      factory: (otherVotes.factory || 0) + (myVote === 'factory' ? 1 : 0),
      mil_base: (otherVotes.mil_base || 0) + (myVote === 'mil_base' ? 1 : 0),
      north: (otherVotes.north || 0) + (myVote === 'north' ? 1 : 0),
    };
  }, [otherVotes, myVote]);

  useEffect(() => {
    if (status === 'match_room' && matchStatus === 'veto') {
      const initialOthers = { warehouses: 0, house: 0, factory: 0, mil_base: 0, north: 0 };
      for (let i = 0; i < totalPlayers - 1; i++) {
        const randomMap = MAPS[Math.floor(Math.random() * MAPS.length)].id;
        initialOthers[randomMap as keyof typeof initialOthers]++;
      }
      setOtherVotes(initialOthers);
      setVetoTime(20);
      setMyVote(null);
    }
  }, [status, matchStatus, totalPlayers]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password.toString());
    toast({ title: "Copied!", description: "Server password copied." });
  };

  const handleFinishMatch = () => {
    setStatus('lobby');
    setMatchStatus('veto');
    toast({ title: "Match Finished", description: "You can now search for a new match." });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const MapImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
    <img 
      src={src} 
      alt={alt} 
      className={cn("absolute inset-0 w-full h-full object-cover", className)} 
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Map+Not+Found';
      }}
    />
  );

  // --- RENDER STATES ---

  if (status === 'ready_check') {
    const displayPlayersReady = isReady ? playersReady + 1 : playersReady;
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-1">Match Found!</h2>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px]">Confirm your readiness</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPlayers }).map((_, i) => {
              const ready = i < displayPlayersReady;
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    ready ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-110" : "bg-white/10 text-white/30"
                  )}
                >
                  <CheckCircle2 className={cn("h-4 w-4", ready ? "opacity-100" : "opacity-20")} />
                </div>
              );
            })}
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
               <p className="text-3xl font-mono font-bold text-primary">{formatTime(readyCheckTime)}</p>
               <div className="max-w-[120px] mx-auto">
                 <TimerProgressBar current={readyCheckTime} total={20} />
               </div>
            </div>
            <Button 
              disabled={isReady}
              onClick={() => setIsReady(true)}
              className="w-full h-12 text-lg font-black italic tracking-tighter uppercase"
            >
              {isReady ? "Ready" : "Accept Match"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'match_room') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-body p-2 md:p-6 flex flex-col scrollbar-hide">
        <div className="fixed top-4 left-4 z-50 md:top-6 md:left-6">
          <Button asChild variant="outline" className="h-8 md:h-10 px-2 md:px-4 border-primary/20 bg-background/50 backdrop-blur-md hover:bg-primary/10 transition-all font-bold text-[10px] md:text-sm">
            <Link href="/">
              <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              {t.view_profile}
            </Link>
          </Button>
        </div>

        <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/5 pb-2 mb-4 shrink-0 mt-10 md:mt-0">
          <div className="flex gap-4 md:gap-8">
            <button className="text-primary text-xs md:text-sm font-bold uppercase tracking-tighter italic border-b-2 border-primary pb-2 -mb-2">{mode} Ranked</button>
          </div>
          <div className="flex items-center gap-4">
            <Share2 className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
            <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-2 md:gap-4 flex-1 overflow-hidden">
          {/* Team A - Left Side */}
          <div className="col-span-3 flex flex-col gap-2 overflow-hidden">
             <div className="flex items-center gap-1 md:gap-2 mb-1 px-1 shrink-0">
                <Avatar className="h-5 w-5 md:h-8 md:w-8">
                  <AvatarImage src={teamA[0].avatarUrl} />
                </Avatar>
                <span className="font-bold text-[8px] md:text-sm uppercase tracking-tighter italic truncate">TEAM_A</span>
             </div>
             <div className="flex flex-col gap-1 md:gap-2 overflow-y-auto pr-1 scrollbar-hide pb-4">
              {teamA.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
             </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6 flex flex-col items-center justify-start pt-0">
            <div className="text-center mb-2">
               <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{mode} · EU</p>
               <h2 className="text-[10px] md:text-lg font-black italic uppercase text-white leading-none">
                 {matchStatus === 'veto' ? t.map_veto : "Match Ready"}
               </h2>
            </div>

            <Card className="w-full bg-[#121212] border-white/5 p-2 md:p-4 flex flex-col items-center shadow-2xl relative overflow-hidden">
                {matchStatus === 'veto' ? (
                  <div className="w-full space-y-2 md:space-y-4">
                    <div className="text-center space-y-1">
                       <p className="text-sm md:text-2xl font-mono font-black text-primary">{formatTime(vetoTime)}</p>
                       <div className="w-[60px] md:w-[100px] mx-auto">
                         <TimerProgressBar current={vetoTime} total={20} />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                      {MAPS.map((map) => {
                        const count = (votes as any)[map.id];
                        const percentage = (count / totalPlayers) * 100;
                        return (
                          <div 
                            key={map.id} 
                            onClick={() => setMyVote(map.id)}
                            className={cn(
                              "relative group cursor-pointer border rounded overflow-hidden transition-all",
                              myVote === map.id ? "border-primary scale-102" : "border-white/5 opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className="h-10 md:h-20 relative">
                              <MapImage src={map.image} alt={map.name} />
                              <div className="absolute inset-0 bg-black/40" />
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[7px] md:text-[10px] font-black uppercase italic">{getTranslatedMapName(map.name)}</span>
                                <span className="text-[7px] md:text-[10px] font-bold mt-0.5">{count}/{totalPlayers}</span>
                                <div className="h-0.5 md:h-1 w-6 md:w-10 bg-white/20 mt-0.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-1">Connect now</p>
                    <div className="text-center space-y-1 mb-2 md:mb-4 w-full">
                      <p className="text-xl md:text-4xl font-mono font-black text-primary">{formatTime(connectTime)}</p>
                      <div className="w-[80px] md:w-[120px] mx-auto">
                        <TimerProgressBar current={connectTime} total={180} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full mb-2 md:mb-4">
                      <div>
                        <p className="text-[7px] md:text-[10px] font-bold uppercase text-muted-foreground mb-1">{t.server_host}</p>
                        <div className="flex items-center gap-1.5 md:gap-3 bg-black/40 p-1 md:p-2 rounded border border-white/5">
                            <Avatar className="h-4 w-4 md:h-6 md:w-6">
                                <AvatarImage src={serverHost.avatarUrl} />
                            </Avatar>
                            <span className="text-[8px] md:text-xs font-bold uppercase italic truncate">{serverHost.name}</span>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{t.map}</p>
                        <div className="flex items-center gap-3 bg-black/40 p-2 rounded border border-white/5">
                            <div className="relative w-7 h-4 overflow-hidden rounded-xs border border-white/10 shrink-0">
                              <MapImage src={selectedMap?.image} alt={selectedMap?.name} />
                            </div>
                            <span className="text-xs font-bold uppercase italic">{getTranslatedMapName(selectedMap?.name)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full space-y-2 md:space-y-3">
                      <div>
                        <p className="text-[7px] md:text-[10px] font-bold uppercase text-muted-foreground mb-0.5 md:mb-1">Password</p>
                        <div className="flex items-center bg-black/60 rounded border border-white/10 overflow-hidden">
                           <div 
                            onClick={copyPassword}
                            className="flex-1 px-2 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-sm text-muted-foreground tracking-widest italic cursor-pointer hover:text-white"
                           >
                              {password}
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button className="w-full h-8 md:h-11 bg-primary text-primary-foreground font-black italic uppercase tracking-tighter text-xs md:text-lg">
                          Connect
                        </Button>
                        
                        {isHost && (
                          <Button 
                            variant="outline"
                            onClick={handleFinishMatch}
                            className="w-full h-8 md:h-11 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] md:text-sm font-bold uppercase tracking-widest"
                          >
                            Матч завершен
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
            </Card>
          </div>

          {/* Team B - Right Side */}
          <div className="col-span-3 flex flex-col gap-2 overflow-hidden">
             <div className="flex items-center justify-end gap-1 md:gap-2 mb-1 px-1 shrink-0">
                <span className="font-bold text-[8px] md:text-sm uppercase tracking-tighter italic truncate text-right">TEAM_B</span>
                <Avatar className="h-5 w-5 md:h-8 md:w-8">
                  <AvatarImage src={teamB[0].avatarUrl} />
                </Avatar>
             </div>
             <div className="flex flex-col gap-1 md:gap-2 overflow-y-auto pr-1 scrollbar-hide pb-4">
              {teamB.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden relative scrollbar-hide">
      <div className="fixed top-6 left-6 z-50">
        <Button asChild variant="outline" className="border-primary/20 bg-background/50 backdrop-blur-md hover:bg-primary/10 transition-all font-bold">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.view_profile}
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-1 italic">Lobby</h1>
            <div className="h-1 w-16 bg-primary mx-auto mb-4" />
        </div>

        <div className="flex justify-center items-center gap-2 md:gap-6 mb-12 w-full overflow-x-hidden">
            {Array.from({ length: mode === '2v2' ? 2 : 5 }).map((_, i) => {
              const myPos = mode === '2v2' ? 0 : 2;
              return i === myPos ? (
                <div key="player" className="relative pt-6">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary z-20">
                      <Crown className="h-2 w-2" fill="currentColor" />
                  </div>
                  <Card className="w-[18vw] h-[25vw] md:w-44 md:h-60 bg-card border-border/40 relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
                    <div className="absolute inset-0">
                        <Image src={userProfile.bannerUrl} alt="banner" fill className="object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>
                    <div className="relative text-center flex flex-col items-center p-1">
                      <Avatar className="h-8 w-8 md:h-20 md:w-20 border-2 md:border-4 border-background ring-1 md:ring-2 ring-primary mb-1 md:mb-2">
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-[7px] md:text-lg tracking-tight truncate max-w-[50px] md:max-w-full">{userProfile.name}</p>
                      </div>
                      <div className="mt-1 md:mt-3 flex items-center gap-1 bg-black/60 rounded-full px-1 py-0.5 md:px-2.5 md:py-1 text-[6px] md:text-xs backdrop-blur-md border border-white/10">
                          <LevelIcon level={userProfile.level} className="h-2 w-2 md:h-5 md:w-5" />
                          <span className='text-white font-bold tracking-tighter'>{userProfile.elo}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div key={`empty-${i}`} className="pt-6">
                  <Card 
                    onClick={() => setIsInviteOpen(true)}
                    className="w-[18vw] h-[25vw] md:w-44 md:h-60 bg-card/5 border-border/20 border-dashed flex flex-col items-center justify-center p-1 text-muted-foreground cursor-pointer group"
                  >
                      <div className="bg-muted/10 p-1 md:p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                        <Plus className="h-3 w-3 md:h-6 md:w-6" />
                      </div>
                      <p className="mt-1 text-[5px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 text-center">{t.invite}</p>
                  </Card>
                </div>
              );
            })}
        </div>
        
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <RadioGroup 
              disabled={status === 'searching'}
              value={mode} 
              onValueChange={setMode} 
              className="flex items-center justify-center gap-3 bg-card/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm w-full"
            >
                <div className="flex-1">
                  <RadioGroupItem value="2v2" id="2v2" className="sr-only"/>
                  <Label htmlFor="2v2" className={`flex items-center justify-center text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${mode === '2v2' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}>
                      2v2 Wingman
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="5v5" id="5v5" className="sr-only"/>
                  <Label htmlFor="5v5" className={`flex items-center justify-center text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${mode === '5v5' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}>
                      5v5 Ranked
                  </Label>
                </div>
            </RadioGroup>

            <div className="w-full flex flex-col items-center gap-4">
              {status === 'searching' ? (
                <div className="w-full space-y-3">
                  <Button 
                    variant="destructive"
                    size="lg" 
                    className="w-full h-14 text-xl font-black italic tracking-tighter bg-red-600 hover:bg-red-700 transition-all" 
                    onClick={() => setStatus('lobby')}
                  >
                      {t.cancel}
                  </Button>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-mono font-bold text-primary animate-pulse">{formatTime(searchTime)}</p>
                  </div>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full h-14 text-xl font-black italic tracking-tighter shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_15px_50px_-10px_rgba(var(--primary),0.6)] transition-all" 
                  onClick={() => setStatus('searching')}
                >
                    {t.play}
                </Button>
              )}
            </div>
        </div>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.invite}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {friendsData.map((friend) => (
              <div key={friend.name} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={friend.avatarUrl} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{friend.name}</p>
                    <p className="text-[10px] text-muted-foreground">{friend.status}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="h-8 text-[10px]"
                  onClick={() => {
                    toast({ title: "Invite Sent", description: `Invited ${friend.name} to lobby.` });
                    setIsInviteOpen(false);
                  }}
                >
                  {t.invite}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
