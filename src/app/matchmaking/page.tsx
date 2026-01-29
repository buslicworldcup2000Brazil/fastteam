'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { userProfile } from '@/lib/data';
import { Crown, Plus } from 'lucide-react';
import Link from 'next/link';
import LevelIcon from '@/components/ui/level-icon';

const PlayerCard = ({ player, isLeader }: { player: typeof userProfile; isLeader?: boolean }) => (
  <div className="relative pt-8">
    {isLeader && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)] z-20">
          <Crown className="h-7 w-7" fill="currentColor" />
      </div>
    )}
    <Card className="w-48 h-64 bg-card border-border/40 relative overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-primary shadow-lg">
      <div className="absolute inset-0">
          <Image src={player.bannerUrl} alt={`${player.name} banner`} fill className="object-cover opacity-30" data-ai-hint="abstract red" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
      </div>

      <div className="relative text-center flex flex-col items-center">
        <Avatar className="h-24 w-24 border-4 border-background/80 ring-2 ring-primary mb-3">
          <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint="gaming avatar" />
          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="font-bold text-xl tracking-tight">{player.name}</p>
        
        <div className="mt-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 text-sm backdrop-blur-md border border-white/10">
            <LevelIcon level={player.level} className="h-6 w-6" />
            <span className='text-white font-bold tracking-tighter'>{player.elo.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  </div>
);

const EmptyPlayerCard = () => (
    <div className="pt-8">
      <Card className="w-48 h-64 bg-card/5 border-border/20 border-dashed flex flex-col items-center justify-center p-4 text-muted-foreground transition-all duration-300 ease-in-out hover:border-primary/50 hover:text-foreground hover:bg-card/10 cursor-pointer group">
          <div className="bg-muted/10 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
            <Plus className="h-8 w-8" />
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-60">Invite</p>
      </Card>
    </div>
);

export default function MatchmakingPage() {
  const [mode, setMode] = React.useState('5v5');
  
  const totalSlots = mode === '2v2' ? 2 : 5;
  const emptySlots = totalSlots - 1;

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
            <PlayerCard player={userProfile} isLeader={true} />
            {Array.from({ length: emptySlots }).map((_, i) => (
              <EmptyPlayerCard key={i} />
            ))}
        </div>
        
        <div className="flex flex-col items-center gap-10 w-full max-w-md">
            <RadioGroup value={mode} onValueChange={setMode} className="flex items-center justify-center gap-4 bg-card/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm w-full">
                <div className="flex-1">
                  <RadioGroupItem value="2v2" id="2v2" className="sr-only"/>
                  <Label 
                    htmlFor="2v2" 
                    className={`flex items-center justify-center text-sm font-bold uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-all duration-200 ${mode === '2v2' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}
                  >
                      2v2 Wingman
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="5v5" id="5v5" className="sr-only"/>
                  <Label 
                    htmlFor="5v5" 
                    className={`flex items-center justify-center text-sm font-bold uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-all duration-200 ${mode === '5v5' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}
                  >
                      5v5 Ranked
                  </Label>
                </div>
            </RadioGroup>

            <Button size="lg" className="w-full h-16 text-2xl font-black italic tracking-tighter shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_15px_50px_-10px_rgba(var(--primary),0.6)] transition-all">
                READY UP
            </Button>
        </div>
      </div>
    </div>
  );
}