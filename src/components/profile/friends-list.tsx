import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

type Friend = {
  name: string;
  avatarUrl: string;
  status: 'online' | 'ingame' | 'offline';
  elo: number;
  level: number;
};

type FriendsListProps = {
  friends: Friend[];
};

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <Card className="bg-card/50 border-white/5">
      <CardContent className="p-4 space-y-4">
        {friends.map((friend) => (
          <div key={friend.name} className="flex items-center gap-4 group">
            <div className="relative">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={cn(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card",
                friend.status === 'online' ? 'bg-green-500' : 
                friend.status === 'ingame' ? 'bg-primary' : 'bg-gray-500'
              )}></span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm">{friend.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{friend.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/user/${encodeURIComponent(friend.name)}`}>Profile</Link>
              </Button>
              <div className="text-right">
                <p className="text-xs font-bold font-mono">{friend.elo}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
