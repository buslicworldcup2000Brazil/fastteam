'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userProfile, friendsData } from '@/lib/data';
import { Crown, Plus, Share2, MoreVertical, CheckCircle2, ShieldCheck, X } from 'lucide-react';
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
  { id: 'dust2', name: 'Dust2', image: 'https://picsum.photos/seed/dust2/400/200' },
  { id: 'mirage', name: 'Mirage', image: 'https://picsum.photos/seed/mirage/400/200' },
  { id: 'inferno', name: 'Inferno', image: 'https://picsum.photos/seed/inferno/400/200' },
];

const generateTeam = (size: number, seed: string) => {
  return Array.from({ length: size }).map((_, i) => ({
    name: i === 0 && seed === 'A' ? "ShadowStriker" : `Player_${seed}_${i}`,
    country: ["Россия", "Украина", "Турция", "Германия", "Швеция"][Math.floor(Math.random() * 5)],
    elo: 1450 + Math.floor(Math.random() * 1000),
    level: Math.floor(Math.random() * 10) + 1,
    avatarUrl: `https://picsum.photos/seed/${seed}${i}/100/100`,
    isCaptain: i === 0,
  }));
};

const MatchPlayerCard = ({ player }: { player: any }) => (
  <div className="bg-[#151515] border border-white/5 rounded p-2 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-primary/40">
            <AvatarImage src={player.avatarUrl} />
            <AvatarFallback>{player.name[0]}</AvatarFallback>
          </Avatar>
          {player.isCaptain && <Crown className="absolute -top-1 -right-1 h-3 w-3 text-primary" fill="currentColor" />}
        </div>
        <div>
          <div className="flex items-center gap-1">
             <div className="relative w-4 h-2.5 overflow-hidden rounded-xs border border-white/10 shrink-0">
                <Image src={getFlagEmoji(player.country)} alt={player.country} fill className="object-cover" unoptimized />
              </div>
              <span className="text-sm font-bold truncate max-w-[80px]">{player.name}</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-none">Stats</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded">
         <span className="text-xs font-bold">{player.elo}</span>
         <LevelIcon level={player.level} className="h-4 w-4" />
      </div>
    </div>
    
    <div className="grid grid-cols-4 gap-1 text-center">
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase">Matches</p>
        <p className="text-[10px] font-bold">1450</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase font-bold text-green-500">Win Rate%</p>
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
  const [otherVotes, setOtherVotes] = useState<Record<string, number>>({ dust2: 0, mirage: 0, inferno: 0 });
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [password] = useState(() => Math.floor(Math.random() * (956 - 165 + 1)) + 165);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const teamSize = mode === '5v5' ? 5 : 2;
  const totalPlayers = teamSize * 2;

  const teamA = useMemo(() => generateTeam(teamSize, 'A'), [teamSize]);
  const teamB = useMemo(() => generateTeam(teamSize, 'B'), [teamSize]);

  // Search Timer
  useEffect(() => {
    let interval: any;
    if (status === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
      
      if (searchTime >= 5) {
        setStatus('ready_check');
        setReadyCheckTime(20);
        setIsReady(false);
        setPlayersReady(0);
      }
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [status, searchTime]);

  // Ready Check Timer
  useEffect(() => {
    let interval: any;
    if (status === 'ready_check') {
      interval = setInterval(() => {
        setReadyCheckTime(prev => {
          if (prev <= 1) {
            handleReadyCheckEnd();
            return 0;
          }
          return prev - 1;
        });

        setPlayersReady(prev => {
          if (prev < totalPlayers - 1 && Math.random() > 0.6) {
            return prev + 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, totalPlayers]);

  // Transition to Match Room
  useEffect(() => {
    if (status === 'ready_check' && isReady && playersReady === totalPlayers - 1) {
      setTimeout(() => setStatus('match_room'), 1000);
    }
  }, [isReady, playersReady, totalPlayers, status]);

  // Veto Timer (Integrated)
  useEffect(() => {
    let interval: any;
    if (status === 'match_room' && matchStatus === 'veto') {
      interval = setInterval(() => {
        setVetoTime(prev => {
          if (prev <= 1) {
            handleVetoEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, matchStatus]);

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

  const handleReadyCheckEnd = () => {
    if (isReady && playersReady >= totalPlayers - 1) {
      setStatus('match_room');
    } else {
      setStatus('lobby');
      toast({ title: "Match cancelled", description: "Not enough players were ready.", variant: "destructive" });
    }
  };

  const handleSetReady = () => setIsReady(true);

  const votes = useMemo(() => {
    return {
      dust2: otherVotes.dust2 + (myVote === 'dust2' ? 1 : 0),
      mirage: otherVotes.mirage + (myVote === 'mirage' ? 1 : 0),
      inferno: otherVotes.inferno + (myVote === 'inferno' ? 1 : 0),
    };
  }, [otherVotes, myVote]);

  const handleVetoEnd = () => {
    const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    const winnerId = sorted[0][1] > 0 ? sorted[0][0] : MAPS[Math.floor(Math.random() * 3)].id;
    setSelectedMap(MAPS.find(m => m.id === winnerId));
    setMatchStatus('active');
  };

  useEffect(() => {
    if (status === 'match_room' && matchStatus === 'veto') {
      const initialOthers = { dust2: 0, mirage: 0, inferno: 0 };
      for (let i = 0; i < totalPlayers - 1; i++) {
        const randomMap = MAPS[Math.floor(Math.random() * 3)].id;
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

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDER STATES ---

  if (status === 'ready_check') {
    const displayPlayersReady = isReady ? playersReady + 1 : playersReady;
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-8">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Match Found!</h2>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-xs">Confirm your readiness</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: totalPlayers }).map((_, i) => {
              const ready = i < displayPlayersReady;
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    ready ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-110" : "bg-white/10 text-white/30"
                  )}
                >
                  <CheckCircle2 className={cn("h-6 w-6", ready ? "opacity-100" : "opacity-20")} />
                </div>
              );
            })}
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
               <p className="text-4xl font-mono font-bold text-primary">{formatTime(readyCheckTime)}</p>
               <div className="max-w-[200px] mx-auto">
                 <TimerProgressBar current={readyCheckTime} total={20} />
               </div>
            </div>
            <Button 
              disabled={isReady}
              onClick={handleSetReady}
              className="w-full h-16 text-2xl font-black italic tracking-tighter uppercase"
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
      <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-body p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-8">
          <div className="flex gap-8">
            <button className="text-primary font-bold uppercase tracking-tighter italic border-b-2 border-primary pb-4 -mb-4">{mode} Ranked</button>
          </div>
          <div className="flex items-center gap-4">
            <Share2 className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
            <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-3">
             <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teamA[0].avatarUrl} />
                  </Avatar>
                  <span className="font-bold text-sm uppercase tracking-tighter italic">team_A</span>
                </div>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
             </div>
             {teamA.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
          </div>

          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="text-center mb-6">
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{mode} · EU</p>
               <h2 className="text-2xl font-black italic uppercase text-white leading-none">
                 {matchStatus === 'veto' ? t.map_veto : "Match Ready"}
               </h2>
            </div>

            <Card className="w-full bg-[#121212] border-white/5 p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
                {matchStatus === 'veto' ? (
                  <div className="w-full space-y-8">
                    <div className="text-center space-y-2">
                       <p className="text-4xl font-mono font-black text-primary">{formatTime(vetoTime)}</p>
                       <div className="w-[150px] mx-auto">
                         <TimerProgressBar current={vetoTime} total={20} />
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {MAPS.map((map) => {
                        const count = votes[map.id as keyof typeof votes];
                        const percentage = (count / totalPlayers) * 100;
                        return (
                          <div 
                            key={map.id} 
                            onClick={() => setMyVote(map.id)}
                            className={cn(
                              "relative group cursor-pointer border rounded overflow-hidden transition-all",
                              myVote === map.id ? "border-primary scale-105" : "border-white/5 opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className="h-24 relative">
                              <Image src={map.image} alt={map.name} fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/40" />
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-black uppercase italic">{map.name}</span>
                                <span className="text-[10px] font-bold mt-1">{count}/{totalPlayers}</span>
                                <div className="h-1 w-12 bg-white/20 mt-1 rounded-full overflow-hidden">
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
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Connect now</p>
                    <div className="text-center space-y-3 mb-8 w-full">
                      <p className="text-5xl font-mono font-black text-primary">{formatTime(connectTime)}</p>
                      <div className="w-[200px] mx-auto">
                        <TimerProgressBar current={connectTime} total={180} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 w-full mb-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Server</p>
                        <div className="flex items-center gap-3 bg-black/40 p-3 rounded border border-white/5">
                           <div className="relative w-8 h-5 overflow-hidden rounded-xs border border-white/10 shrink-0">
                              <Image src="https://flagcdn.com/w80/de.png" alt="Germany" fill className="object-cover" unoptimized />
                            </div>
                            <span className="text-sm font-bold uppercase italic">Germany</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Map</p>
                        <div className="flex items-center gap-3 bg-black/40 p-3 rounded border border-white/5">
                            <div className="relative w-8 h-5 overflow-hidden rounded-xs border border-white/10 shrink-0">
                              <Image src={selectedMap?.image} alt={selectedMap?.name} fill className="object-cover" />
                            </div>
                            <span className="text-sm font-bold uppercase italic">{selectedMap?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Password</p>
                        <div className="flex items-center bg-black/60 rounded border border-white/10 overflow-hidden">
                           <div 
                            onClick={copyPassword}
                            className="flex-1 px-4 py-3 font-mono text-sm text-muted-foreground tracking-widest italic cursor-pointer hover:text-white"
                           >
                              {password}
                           </div>
                        </div>
                      </div>
                      <Button className="w-full h-14 bg-primary text-primary-foreground font-black italic uppercase tracking-tighter text-xl">
                        Connect
                      </Button>
                    </div>
                  </>
                )}
            </Card>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3">
             <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teamB[0].avatarUrl} />
                  </Avatar>
                  <span className="font-bold text-sm uppercase tracking-tighter italic">team_B</span>
                </div>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
             </div>
             {teamB.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
          <Link href="/">Back to Profile</Link>
        </Button>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-16 text-center">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Lobby</h1>
            <div className="h-1 w-24 bg-primary mx-auto mb-4" />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-20 w-full">
            {Array.from({ length: mode === '2v2' ? 2 : 5 }).map((_, i) => {
              const myPos = mode === '2v2' ? 0 : 2;
              return i === myPos ? (
                <div key="player" className="relative pt-8">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary z-20">
                      <Crown className="h-2 w-2" fill="currentColor" />
                  </div>
                  <Card className="w-48 h-64 bg-card border-border/40 relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
                    <div className="absolute inset-0">
                        <Image src={userProfile.bannerUrl} alt="banner" fill className="object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>
                    <div className="relative text-center flex flex-col items-center">
                      <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary mb-3">
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xl tracking-tight">{userProfile.name}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 text-sm backdrop-blur-md border border-white/10">
                          <LevelIcon level={userProfile.level} className="h-6 w-6" />
                          <span className='text-white font-bold tracking-tighter'>{userProfile.elo}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div key={`empty-${i}`} className="pt-8">
                  <Card 
                    onClick={() => setIsInviteOpen(true)}
                    className="w-48 h-64 bg-card/5 border-border/20 border-dashed flex flex-col items-center justify-center p-4 text-muted-foreground cursor-pointer group"
                  >
                      <div className="bg-muted/10 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                        <Plus className="h-8 w-8" />
                      </div>
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-60">{t.invite}</p>
                  </Card>
                </div>
              );
            })}
        </div>
        
        <div className="flex flex-col items-center gap-10 w-full max-w-md">
            <RadioGroup 
              disabled={status === 'searching'}
              value={mode} 
              onValueChange={setMode} 
              className="flex items-center justify-center gap-4 bg-card/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm w-full"
            >
                <div className="flex-1">
                  <RadioGroupItem value="2v2" id="2v2" className="sr-only"/>
                  <Label htmlFor="2v2" className={`flex items-center justify-center text-sm font-bold uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-all duration-200 ${mode === '2v2' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}>
                      2v2 Wingman
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="5v5" id="5v5" className="sr-only"/>
                  <Label htmlFor="5v5" className={`flex items-center justify-center text-sm font-bold uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-all duration-200 ${mode === '5v5' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}>
                      5v5 Ranked
                  </Label>
                </div>
            </RadioGroup>

            <div className="w-full flex flex-col items-center gap-4">
              {status === 'searching' ? (
                <div className="w-full space-y-4">
                  <Button 
                    variant="destructive"
                    size="lg" 
                    className="w-full h-16 text-2xl font-black italic tracking-tighter bg-red-600 hover:bg-red-700 transition-all" 
                    onClick={() => setStatus('lobby')}
                  >
                      {t.cancel}
                  </Button>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-mono font-bold text-primary animate-pulse">{formatTime(searchTime)}</p>
                  </div>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full h-16 text-2xl font-black italic tracking-tighter shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_15px_50px_-10px_rgba(var(--primary),0.6)] transition-all" 
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
          <div className="space-y-4">
            {friendsData.map((friend) => (
              <div key={friend.name} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={friend.avatarUrl} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.status}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
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
