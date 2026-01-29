import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, UserPlus, Swords } from 'lucide-react';
import ThemeCustomizer from '@/components/theme-customizer';
import Link from 'next/link';

type UserProfile = {
  name: string;
  handle: string;
  tags: string[];
  bannerUrl: string;
  avatarUrl: string;
  elo: number;
  level: number;
};

type ProfileHeaderProps = {
  user: UserProfile;
  onEdit: () => void;
};

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  return (
    <header className="relative">
      <div className="h-48 md:h-64 w-full relative">
        <Image
          key={user.bannerUrl}
          src={user.bannerUrl}
          alt="Profile banner"
          fill
          className="object-cover"
          data-ai-hint="abstract red"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-4">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-2 ring-primary">
            <AvatarImage key={user.avatarUrl} src={user.avatarUrl} alt={user.name} data-ai-hint="gaming avatar" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center md:items-start md:pb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.handle}</p>
            <div className="flex gap-2 mt-2">
              {user.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-2 md:pb-4">
            <Button asChild>
                <Link href="/matchmaking"><Swords className="mr-2 h-4 w-4" /> Play</Link>
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Friend
            </Button>
            <ThemeCustomizer />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
