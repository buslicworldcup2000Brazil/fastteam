import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Swords, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { getFlagEmoji } from '@/lib/countries';

type UserProfile = {
  name: string;
  handle: string;
  tags: string[];
  bannerUrl: string;
  avatarUrl: string;
  elo: number;
  level: number;
  country: string;
};

type ProfileHeaderProps = {
  user: UserProfile;
  onEdit: () => void;
};

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const flagUrl = getFlagEmoji(user.country);

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
              <div className="relative w-8 h-6 overflow-hidden rounded-sm shadow-sm border border-white/10" title={user.country}>
                <Image 
                  src={flagUrl} 
                  alt={user.country} 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="md:ml-auto flex flex-col md:flex-row items-center gap-2 md:pb-4 w-full md:w-auto">
            <div className="relative w-full md:w-64 order-2 md:order-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search players..." 
                className="pl-9 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2 order-1 md:order-2">
              <Button asChild>
                  <Link href="/matchmaking"><Swords className="mr-2 h-4 w-4" /> Play</Link>
              </Button>
              <Button variant="outline" size="icon" onClick={onEdit} title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
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
      </div>
    </header>
  );
}