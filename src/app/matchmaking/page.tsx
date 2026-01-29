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

const PlayerCard = ({ player, isLeader }: { player: typeof userProfile; isLeader?: boolean }) => (
  <Card className="w-48 h-64 bg-card border-border/40 relative overflow-hidden flex flex-col items-center justify-end pb-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-primary shadow-lg">
    {isLeader && (
      <div className="absolute top-3 right-3 text-primary drop-shadow-lg z-20 bg-background/50 rounded-full p-1">
          <Crown className="h-4 w-4" fill="currentColor" />
      </div>
    )}
    <div className="absolute inset-0">
        <Image src={player.bannerUrl} alt={`${player.name} banner`} fill className="object-cover opacity-20" data-ai-hint="abstract red" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
    </div>

    <div className="relative text-center">
      <Avatar className="h-24 w-24 border-4 border-background/80 ring-2 ring-primary mb-2">
        <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint="gaming avatar" />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="font-bold text-lg">{player.name}</p>
      <p className="text-sm text-muted-foreground -mt-1">{player.handle}</p>
    </div>
    
    <div className="relative mt-3 flex items-center gap-2 bg-black/40 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold text-xs">10</div>
        <span className='text-white font-semibold'>2,450</span>
    </div>
  </Card>
);

const EmptyPlayerCard = () => (
    <Card className="w-48 h-64 bg-card/5 border-border/20 border-dashed flex flex-col items-center justify-center p-4 text-muted-foreground transition-all duration-300 ease-in-out hover:border-primary hover:text-foreground hover:bg-card/10 cursor-pointer">
        <Plus className="h-10 w-10" />
        <p className="mt-2 text-sm font-medium">Invite Player</p>
    </Card>
);

export default function MatchmakingPage() {
  const [mode, setMode] = React.useState('5v5');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
        <Button asChild variant="outline">
          <Link href="/">Back to Profile</Link>
        </Button>
      </div>
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">Lobby</h1>
            <p className="text-muted-foreground">You are the party leader</p>
        </div>

        <div className="flex justify-center items-start gap-6 mb-16">
            <EmptyPlayerCard />
            <EmptyPlayerCard />
            <PlayerCard player={userProfile} isLeader={true} />
            <EmptyPlayerCard />
            <EmptyPlayerCard />
        </div>
        
        <div className="flex flex-col items-center gap-8">
            <RadioGroup value={mode} onValueChange={setMode} className="flex items-center gap-8">
                <Label htmlFor="2v2" className={`text-lg font-medium p-3 rounded-md cursor-pointer transition-colors ${mode === '2v2' ? 'bg-primary/20 text-primary-foreground' : 'text-muted-foreground'}`}>
                    <RadioGroupItem value="2v2" id="2v2" className="sr-only"/>
                    2v2 Wingman
                </Label>
                <Label htmlFor="5v5" className={`text-lg font-medium p-3 rounded-md cursor-pointer transition-colors ${mode === '5v5' ? 'bg-primary/20 text-primary-foreground' : 'text-muted-foreground'}`}>
                    <RadioGroupItem value="5v5" id="5v5" className="sr-only"/>
                    5v5 Ranked
                </Label>
            </RadioGroup>

            <Button size="lg" className="w-80 h-16 text-2xl font-bold tracking-wider">
                PLAY
            </Button>
        </div>
      </div>
    </div>
  );
}
