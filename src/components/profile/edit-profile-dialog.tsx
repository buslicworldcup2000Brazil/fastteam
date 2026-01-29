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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileUrlSchema = z.object({
  bannerUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
});

type EditProfileDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpdate: (data: z.infer<typeof profileUrlSchema>) => void;
  currentBannerUrl: string;
  currentAvatarUrl: string;
};

export default function EditProfileDialog({ isOpen, setIsOpen, onUpdate, currentBannerUrl, currentAvatarUrl }: EditProfileDialogProps) {
  const form = useForm<z.infer<typeof profileUrlSchema>>({
    resolver: zodResolver(profileUrlSchema),
    defaultValues: {
      bannerUrl: '',
      avatarUrl: '',
    },
  });

  function onSubmit(values: z.infer<typeof profileUrlSchema>) {
    onUpdate(values);
    setIsOpen(false);
    form.reset();
  }
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Change your banner and avatar by providing new image URLs. Leave a field blank to keep the current image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
