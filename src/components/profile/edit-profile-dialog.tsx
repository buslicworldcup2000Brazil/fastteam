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

const profileSchema = z.object({
  name: z.string().min(2, "Nickname must be at least 2 characters."),
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
    bannerUrl: string;
    avatarUrl: string;
    country: string;
    language: string;
    lastFlagChange: number;
  };
};

export default function EditProfileDialog({ isOpen, setIsOpen, onUpdate, currentUser }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [canChangeFlag, setCanChangeFlag] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
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

  function onSubmit(values: ProfileValues) {
    const isCountryChanged = values.country !== currentUser.country;
    
    if (isCountryChanged && !canChangeFlag) {
      toast({
        variant: "destructive",
        title: "Wait a moment",
        description: `You can change your flag again on ${nextChangeDate?.toLocaleDateString()}`,
      });
      return;
    }

    if (isCountryChanged) {
      localStorage.setItem('lastFlagChangeDate', Date.now().toString());
    }

    onUpdate(values);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your gaming identity and preferences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="CoolGamer123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
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
                    <SelectContent className="max-h-[200px]">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          <span className="flex items-center gap-2">
                            <div className="relative w-5 h-3.5 overflow-hidden rounded-xs border border-white/10">
                              <Image src={getFlagEmoji(country)} alt={country} fill className="object-cover" unoptimized />
                            </div>
                            {country}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!canChangeFlag && (
                    <FormDescription className="text-xs text-amber-500">
                      Country can be changed once every 14 days.
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
                  <FormLabel>Interface Language</FormLabel>
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
            <FormField
              control={form.control}
              name="bannerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL</FormLabel>
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
                  <FormLabel>Avatar Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/new-avatar.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
