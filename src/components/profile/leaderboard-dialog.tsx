"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTheme } from "@/components/theme-provider";
import { translations } from "@/lib/translations";
import { topPlayersData } from "@/lib/data";
import LevelIcon from "@/components/ui/level-icon";
import Image from "next/image";
import { getFlagEmoji } from "@/lib/countries";
import { Trophy } from "lucide-react";

type LeaderboardDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function LeaderboardDialog({ isOpen, setIsOpen }: LeaderboardDialogProps) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t.top_players}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t.rank_position}</TableHead>
                <TableHead>{t.nickname}</TableHead>
                <TableHead>{t.level}</TableHead>
                <TableHead className="text-right">{t.elo}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlayersData.map((player, index) => (
                <TableRow key={player.name}>
                  <TableCell className="font-bold text-muted-foreground">
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-6 h-4 overflow-hidden rounded-xs border border-white/10 shrink-0">
                        <Image 
                          src={getFlagEmoji(player.country)} 
                          alt={player.country} 
                          fill 
                          className="object-cover" 
                          unoptimized 
                        />
                      </div>
                      <span className="font-semibold">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <LevelIcon level={player.level} className="h-7 w-7" />
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {player.elo}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
