import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Search, UserPlus, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getFlagEmoji } from '@/lib/countries';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type UserProfile = {
  name: string;
  bio?: string;
  handle: string;
  tags: string[];
  bannerUrl: string;
  avatarUrl: string;
  elo: number;
  level: number;
  country: string;
  registeredAt?: string;
};

type ProfileHeaderProps = {
  user: UserProfile;
  onEdit: () => void;
  hideButtons?: boolean;
};

const DEFAULT_BANNER = PlaceHolderImages.find(img => img.id === 'profile-banner')?.imageUrl || 'https://picsum.photos/seed/banner/1200/400';
const DEFAULT_AVATAR = PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || 'https://picsum.photos/seed/avatar/200/200';

export default function ProfileHeader({ user, onEdit, hideButtons = false }: ProfileHeaderProps) {
  const { language } = useTheme();
  const t = translations[language];
  const flagUrl = getFlagEmoji(user.country);

  const bannerSrc = user.bannerUrl && user.bannerUrl.trim() !== "" ? user.bannerUrl : DEFAULT_BANNER;
  const avatarSrc = user.avatarUrl && user.avatarUrl.trim() !== "" ? user.avatarUrl : DEFAULT_AVATAR;

  return (
    <header className="relative">
      <div className="h-64 md:h-80 w-full relative">
        <Image
          key={bannerSrc}
          src={bannerSrc}
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
            <AvatarImage key={avatarSrc} src={avatarSrc} alt={user.name} data-ai-hint="gaming avatar" />
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
            <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-1 mt-1">
              {user.bio && (
                <p className="text-muted-foreground text-sm font-medium">{user.bio}</p>
              )}
              {user.registeredAt && (
                <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[10px] uppercase font-bold tracking-wider">
                  <Calendar className="h-3 w-3" />
                  <span>{t.member_since.replace('{date}', user.registeredAt)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:ml-auto flex flex-col md:flex-row items-center gap-2 md:pb-4 w-full md:w-auto">
            {!hideButtons && (
              <>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t.search_placeholder} 
                    className="pl-9 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={onEdit} title={t.edit_profile}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            {hideButtons && (
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {t.invite}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}