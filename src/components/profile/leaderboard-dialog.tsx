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
import RankBadge from "@/components/ui/rank-badge";

type LeaderboardDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function LeaderboardDialog({ isOpen, setIsOpen }: LeaderboardDialogProps) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t.top_players}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[80px]">{t.rank_position}</TableHead>
                <TableHead>{t.nickname}</TableHead>
                <TableHead>{t.level}</TableHead>
                <TableHead className="text-right">{t.elo}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlayersData.map((player, index) => (
                <TableRow key={player.name} className="border-b-white/5">
                  <TableCell>
                    <RankBadge rank={index + 1} className="h-9 w-9" />
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
                      <span className="font-semibold text-sm">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <LevelIcon level={player.level} className="h-6 w-6" />
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm">
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
