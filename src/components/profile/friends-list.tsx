import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar: ImagePlaceholder;
  status: 'online' | 'ingame';
};

type FriendsListProps = {
  friends: Friend[];
};

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10 relative">
              <AvatarImage src={friend.avatar?.imageUrl} alt={friend.name} data-ai-hint={friend.avatar?.imageHint} />
              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card ${friend.status === 'online' ? 'bg-green-500' : 'bg-accent'}`}></span>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold">{friend.name}</p>
              <p className="text-sm text-muted-foreground">{friend.handle}</p>
            </div>
            <span className={`text-xs font-semibold ${friend.status === 'online' ? 'text-green-400' : 'text-accent'}`}>
              {friend.status === 'online' ? 'Online' : 'In Game'}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
