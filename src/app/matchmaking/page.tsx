'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userProfile } from '@/lib/data';
import { Crown, Plus, Timer, Copy, ExternalLink, ShieldCheck, Share2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import LevelIcon from '@/components/ui/level-icon';
import { getFlagEmoji } from '@/lib/countries';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- MOCK DATA FOR TEAMS ---
const MAPS = [
  { id: 'dust2', name: 'Dust2', image: 'https://picsum.photos/seed/dust2/400/200' },
  { id: 'mirage', name: 'Mirage', image: 'https://picsum.photos/seed/mirage/400/200' },
  { id: 'inferno', name: 'Inferno', image: 'https://picsum.photos/seed/inferno/400/200' },
];

const teamA = [
  { ...userProfile, name: "ShadowStriker", isCaptain: true },
  { name: "_NSX_", country: "Турция", elo: 768, level: 1, avatarUrl: 'https://picsum.photos/seed/p2/100/100' },
  { name: "NipGes", country: "Турция", elo: 2360, level: 10, avatarUrl: 'https://picsum.photos/seed/p3/100/100' },
  { name: "Mishkiii", country: "Россия", elo: 2282, level: 10, avatarUrl: 'https://picsum.photos/seed/p4/100/100' },
  { name: "wALeYOfdEAHt", country: "Швеция", elo: 2290, level: 10, avatarUrl: 'https://picsum.photos/seed/p5/100/100' },
];

const teamB = [
  { name: "rulant", country: "Россия", elo: 2437, level: 10, isCaptain: true, avatarUrl: 'https://picsum.photos/seed/p6/100/100' },
  { name: "sTOPHONLEBKy", country: "Россия", elo: 2349, level: 10, avatarUrl: 'https://picsum.photos/seed/p7/100/100' },
  { name: "Diarmuid_", country: "Германия", elo: 2257, level: 10, avatarUrl: 'https://picsum.photos/seed/p8/100/100' },
  { name: "confsd", country: "Россия", elo: 2469, level: 10, avatarUrl: 'https://picsum.photos/seed/p9/100/100' },
  { name: "F0rbiddenOne", country: "Украина", elo: 2077, level: 10, avatarUrl: 'https://picsum.photos/seed/p10/100/100' },
];

// --- COMPONENTS ---

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
          <p className="text-[10px] text-muted-foreground leading-none">Overall Stats</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded">
         <span className="text-[10px] font-mono opacity-60">~</span>
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
        <p className="text-[8px] text-muted-foreground uppercase">Win Rate</p>
        <p className="text-[10px] font-bold text-green-500">65%</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase">AVG Kills</p>
        <p className="text-[10px] font-bold">24/40%</p>
      </div>
      <div className="bg-black/20 p-1 rounded">
        <p className="text-[8px] text-muted-foreground uppercase">K/D / K/R</p>
        <p className="text-[10px] font-bold">1.51 / 0.92</p>
      </div>
    </div>
  </div>
);

export default function MatchmakingPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState<'lobby' | 'searching' | 'veto' | 'ready'>('lobby');
  const [searchTime, setSearchTime] = useState(0);
  const [vetoTime, setVetoTime] = useState(60);
  const [mode, setMode] = useState('5v5');
  const [votes, setVotes] = useState<Record<string, number>>({ dust2: 0, mirage: 0, inferno: 0 });
  const [myVote, setMyVote] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [password] = useState(() => Math.floor(Math.random() * (956 - 165 + 1)) + 165);

  // Search Timer
  useEffect(() => {
    let interval: any;
    if (status === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
      
      if (searchTime >= 5) {
        setStatus('veto');
      }
    }
    return () => clearInterval(interval);
  }, [status, searchTime]);

  // Veto Timer
  useEffect(() => {
    let interval: any;
    if (status === 'veto' && vetoTime > 0) {
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
  }, [status, vetoTime]);

  const handleVetoEnd = () => {
    // Choose map with most votes or random if none
    const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    const winnerId = sorted[0][1] > 0 ? sorted[0][0] : MAPS[Math.floor(Math.random() * 3)].id;
    setSelectedMap(MAPS.find(m => m.id === winnerId));
    setStatus('ready');
  };

  const handleVote = (mapId: string) => {
    if (myVote) return;
    setMyVote(mapId);
    setVotes(prev => ({ ...prev, [mapId]: prev[mapId] + 1 }));
    
    // Simulate other 9 players voting quickly
    setTimeout(() => {
      const newVotes = { ...votes, [mapId]: votes[mapId] + 1 };
      for(let i=0; i<9; i++) {
        const randomMap = MAPS[Math.floor(Math.random() * 3)].id;
        newVotes[randomMap] = (newVotes[randomMap] || 0) + 1;
      }
      setVotes(newVotes);
    }, 500);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password.toString());
    toast({ title: "Copied!", description: "Server password copied to clipboard." });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDERING ---

  if (status === 'searching') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="relative w-48 h-48 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Timer className="h-12 w-12 text-primary animate-pulse" />
            </div>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Searching for Match...</h2>
        <p className="text-4xl font-mono font-bold text-primary">{formatTime(searchTime)}</p>
        <Button variant="ghost" className="mt-8 text-muted-foreground hover:text-red-500" onClick={() => setStatus('lobby')}>
          Cancel Search
        </Button>
      </div>
    );
  }

  if (status === 'veto') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Map Veto</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">All players are voting</p>
            <div className="mt-4 text-5xl font-mono font-bold text-primary">{formatTime(vetoTime)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MAPS.map((map) => {
              const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
              const percentage = totalVotes > 0 ? (votes[map.id] / totalVotes) * 100 : 0;
              
              return (
                <Card 
                  key={map.id} 
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all border-2",
                    myVote === map.id ? "border-primary ring-2 ring-primary/20 scale-105" : "border-white/5 hover:border-white/20",
                    myVote && myVote !== map.id ? "opacity-50 grayscale" : ""
                  )}
                  onClick={() => handleVote(map.id)}
                >
                  <div className="h-48 relative">
                    <Image src={map.image} alt={map.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-black italic uppercase">{map.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs font-bold">{votes[map.id]} / 10</span>
                      </div>
                    </div>
                  </div>
                  {myVote === map.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      My Vote
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-body p-4 md:p-8">
        {/* Header Tabs */}
        <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-8">
          <div className="flex gap-8">
            <button className="text-primary font-bold uppercase tracking-tighter italic border-b-2 border-primary pb-4 -mb-4">5V5 Ranked</button>
            <button className="text-muted-foreground hover:text-white font-bold uppercase tracking-tighter italic pb-4 -mb-4 transition-colors">Overview</button>
            <button className="text-muted-foreground hover:text-white font-bold uppercase tracking-tighter italic pb-4 -mb-4 transition-colors">Scoreboard</button>
          </div>
          <div className="flex items-center gap-4">
            <Share2 className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
            <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Team A */}
          <div className="lg:col-span-3 flex flex-col gap-3">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teamA[0].avatarUrl} />
                  </Avatar>
                  <span className="font-bold text-sm">team_-Korayberk</span>
                </div>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
             </div>
             {teamA.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
          </div>

          {/* Middle Stats / Connection */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Top Match Info */}
            <div className="text-center mb-8">
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">5v5 · EU</p>
               <h2 className="text-2xl font-black italic uppercase text-white leading-none">Ready</h2>
               <p className="text-[10px] text-muted-foreground font-bold mt-1">Best of 1</p>
               <div className="mt-4 flex items-center justify-center gap-1">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <div className="h-1 w-4 bg-primary/40 rounded-full" />
                  <div className="h-1 w-4 bg-white/5 rounded-full" />
               </div>
            </div>

            <Card className="w-full bg-[#121212] border-white/5 p-8 flex flex-col items-center shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Time to connect</p>
                <p className="text-5xl font-mono font-black text-primary mb-8">04:17</p>

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
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Map</p>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-primary cursor-pointer hover:underline">
                          <ShieldCheck className="h-3 w-3" />
                          VETO
                        </div>
                      </div>
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
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Connect with in game console</p>
                    <div className="flex items-center bg-black/60 rounded border border-white/10 overflow-hidden">
                       <div className="flex-1 px-4 py-3 font-mono text-sm text-muted-foreground tracking-widest italic uppercase">
                          Hidden
                       </div>
                       <button 
                        onClick={copyPassword}
                        className="bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-black uppercase italic tracking-tighter border-l border-white/10 transition-colors"
                       >
                          Copy
                       </button>
                    </div>
                  </div>

                  <Button className="w-full h-14 bg-primary text-primary-foreground font-black italic uppercase tracking-tighter text-xl shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all">
                    Connect
                  </Button>

                  <button className="w-full text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground hover:text-white transition-colors py-2">
                    Spectate
                  </button>
                </div>
            </Card>
          </div>

          {/* Team B */}
          <div className="lg:col-span-3 flex flex-col gap-3">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teamB[0].avatarUrl} />
                  </Avatar>
                  <span className="font-bold text-sm">team_rulant</span>
                </div>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
             </div>
             {teamB.map((p, i) => <MatchPlayerCard key={i} player={p} />)}
          </div>
        </div>
      </div>
    );
  }

  // --- LOBBY STATE (Default) ---
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden">
       <div className="absolute top-6 left-6">
        <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
          <Link href="/">Back to Profile</Link>
        </Button>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-16 text-center">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Lobby</h1>
            <div className="h-1 w-24 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">Party Leader Status Active</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-20 w-full">
            {Array.from({ length: mode === '2v2' ? 2 : 5 }).map((_, i) => {
              const myPos = mode === '2v2' ? 0 : 2; // In 5v5, player is in 3rd slot (index 2)
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
                      <Avatar className="h-24 w-24 border-4 border-background/80 ring-2 ring-primary mb-3">
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xl tracking-tight">{userProfile.name}</p>
                        <div className="relative w-5 h-4 overflow-hidden rounded-xs border border-white/5">
                          <Image src={getFlagEmoji(userProfile.country)} alt={userProfile.country} fill className="object-cover" unoptimized />
                        </div>
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
                  <Card className="w-48 h-64 bg-card/5 border-border/20 border-dashed flex flex-col items-center justify-center p-4 text-muted-foreground cursor-pointer group">
                      <div className="bg-muted/10 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                        <Plus className="h-8 w-8" />
                      </div>
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-60">Invite</p>
                  </Card>
                </div>
              );
            })}
        </div>
        
        <div className="flex flex-col items-center gap-10 w-full max-w-md">
            <RadioGroup value={mode} onValueChange={setMode} className="flex items-center justify-center gap-4 bg-card/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm w-full">
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

            <Button size="lg" className="w-full h-16 text-2xl font-black italic tracking-tighter shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_15px_50px_-10px_rgba(var(--primary),0.6)] transition-all" onClick={() => setStatus('searching')}>
                Play
            </Button>
        </div>
      </div>
    </div>
  );
}
