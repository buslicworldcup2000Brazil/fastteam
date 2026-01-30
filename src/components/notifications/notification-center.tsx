"use client";

import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type Notification = {
  id: string;
  type: 'invite';
  from: string;
  avatarUrl: string;
  mode: string;
  timestamp: number;
};

export default function NotificationCenter() {
  const { language } = useTheme();
  const t = translations[language];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Simulation: Add a random notification after 10s
  useEffect(() => {
    const timer = setTimeout(() => {
      const newInvite: Notification = {
        id: Math.random().toString(),
        type: 'invite',
        from: 's1mple',
        avatarUrl: 'https://picsum.photos/seed/s1/100/100',
        mode: '5v5 Ranked',
        timestamp: Date.now(),
      };
      setNotifications(prev => [newInvite, ...prev]);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "h-12 w-12 rounded-full shadow-2xl transition-all border-primary/20",
            notifications.length > 0 && "animate-bounce"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
              {notifications.length}
            </span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest">{t.invitation_received}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs italic">
                  No new notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="p-4 border-b border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex gap-3 items-start">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={n.avatarUrl} />
                        <AvatarFallback>{n.from[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs leading-relaxed">
                          {t.invite_msg.replace('{name}', n.from).replace('{mode}', n.mode)}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 px-3 text-[10px] font-bold uppercase flex-1" onClick={() => removeNotification(n.id)}>
                            <Check className="h-3 w-3 mr-1" /> {t.accept}
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold uppercase flex-1" onClick={() => removeNotification(n.id)}>
                            <X className="h-3 w-3 mr-1" /> {t.decline}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
