"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries, getFlagEmoji } from '@/lib/countries';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';
import { Label } from '@/components/ui/label';
import { Check, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, "Nickname must be at least 2 characters.").max(12, "Nickname must be at most 12 characters."),
  bio: z.string().max(30, "Bio must be at most 30 characters.").optional(),
  bannerUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  country: z.string(),
  language: z.enum(['ru', 'en']),
});

type ProfileValues = z.infer<typeof profileSchema>;

type EditProfileDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpdate: (data: ProfileValues) => void;
  currentUser: {
    name: string;
    bio?: string;
    bannerUrl: string;
    avatarUrl: string;
    country: string;
    language: string;
  };
};

const PRESET_COLORS = [
  { name: 'Default', hsl: '3 71% 41%' },
  { name: 'Orange', hsl: '24 94% 50%' },
  { name: 'Green', hsl: '142 71% 45%' },
  { name: 'Blue', hsl: '217 91% 60%' },
  { name: 'Purple', hsl: '262 84% 58%' },
  { name: 'Pink', hsl: '322 84% 58%' },
];

function hexToHsl(hex: string): string | null {
    if (!hex || typeof hex !== 'string') return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    if (!result) return null;

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function EditProfileDialog({ isOpen, setIsOpen, onUpdate, currentUser }: EditProfileDialogProps) {
  const { toast } = useToast();
  const { primaryColor, setPrimaryColor, language, setLanguage } = useTheme();
  const t = translations[language];
  
  const [canChangeFlag, setCanChangeFlag] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  const [customColor, setCustomColor] = useState('');

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      bannerUrl: currentUser.bannerUrl,
      avatarUrl: currentUser.avatarUrl,
      country: currentUser.country,
      language: currentUser.language as 'ru' | 'en',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: currentUser.name,
        bio: currentUser.bio || '',
        bannerUrl: '',
        avatarUrl: '',
        country: currentUser.country,
        language: currentUser.language as 'ru' | 'en',
      });
      
      const lastChange = parseInt(localStorage.getItem('lastFlagChangeDate') || '0');
      const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      if (now - lastChange < fourteenDaysMs) {
        setCanChangeFlag(false);
        setNextChangeDate(new Date(lastChange + fourteenDaysMs));
      } else {
        setCanChangeFlag(true);
        setNextChangeDate(null);
      }
    }
  }, [isOpen, currentUser, form]);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColor(hex);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
        const hsl = hexToHsl(hex);
        if (hsl) {
            setPrimaryColor(hsl);
        }
    }
  };

  function onSubmit(values: ProfileValues) {
    const isCountryChanged = values.country !== currentUser.country;
    
    if (isCountryChanged && !canChangeFlag) {
      toast({
        variant: "destructive",
        title: t.wait_moment,
        description: t.flag_change_limit.replace('{date}', nextChangeDate?.toLocaleDateString() || ''),
      });
      return;
    }

    if (isCountryChanged) {
      localStorage.setItem('lastFlagChangeDate', Date.now().toString());
    }

    setLanguage(values.language);
    onUpdate(values);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[682px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.settings_appearance}
          </DialogTitle>
          <DialogDescription>
            {t.customize_identity}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide")}>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.profile}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nickname}</FormLabel>
                      <FormControl>
                        <Input placeholder="CoolGamer123" {...field} maxLength={12} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {language === 'ru' ? 'Максимум 12 символов' : 'Max 12 characters'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.bio}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.bio_placeholder} {...field} maxLength={30} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {t.bio_limit}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.country}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!canChangeFlag}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[250px] scrollbar-hide">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              <span className="flex items-center gap-2">
                                <div className="relative w-5 h-3.5 overflow-hidden rounded-xs border border-white/10 shrink-0">
                                  <Image 
                                    src={getFlagEmoji(country)} 
                                    alt={country} 
                                    fill 
                                    className="object-cover" 
                                    unoptimized 
                                  />
                                </div>
                                {country}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!canChangeFlag && (
                        <FormDescription className="text-xs text-amber-500">
                          {t.country_change_hint.replace('{date}', nextChangeDate?.toLocaleDateString() || '')}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.interface_lang}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ru">Русский (RU)</SelectItem>
                          <SelectItem value="en">English (EN)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.appearance}</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t.accent_color}</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <Button
                        key={color.name}
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2"
                        style={{ backgroundColor: `hsl(${color.hsl})`, borderColor: primaryColor === color.hsl ? 'white' : 'transparent' }}
                        onClick={() => setPrimaryColor(color.hsl)}
                      >
                        {primaryColor === color.hsl && <Check className="h-4 w-4 text-white" />}
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custom-color">{t.custom_hex}</Label>
                  <Input
                    id="custom-color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    placeholder="#A14827"
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.graphics}</h3>
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.banner_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/new-banner.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.avatar_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/new-avatar.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>{t.cancel}</Button>
              <Button type="submit">{t.save_changes}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}