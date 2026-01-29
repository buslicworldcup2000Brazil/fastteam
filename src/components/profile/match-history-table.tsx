import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUp, ArrowDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import LevelIcon from "@/components/ui/level-icon"
import { calculateLevel } from "@/lib/data"
import { useTheme } from "@/components/theme-provider"
import { translations } from "@/lib/translations"

type Match = {
  id: string;
  date: string;
  time: string;
  result: 'win' | 'loss';
  score: string;
  skillLevel: number;
  skillChange: number;
  kd: string;
  kdRatio: number;
  krRatio: number;
  map: string;
};

type MatchHistoryTableProps = {
  matches: Match[];
};

export default function MatchHistoryTable({ matches }: MatchHistoryTableProps) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b-border/50">
            <TableHead className="w-[150px]">{t.date}</TableHead>
            <TableHead>{t.score}</TableHead>
            <TableHead>{t.skill_level}</TableHead>
            <TableHead>{t.kd}</TableHead>
            <TableHead>K/D</TableHead>
            <TableHead>K/R</TableHead>
            <TableHead>{t.map}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => {
            const level = calculateLevel(match.skillLevel);
            return (
            <TableRow key={match.id} className="border-b-border/20 last:border-b-0">
              <TableCell>
                <div className="font-medium">{match.date}</div>
                <div className="text-sm text-muted-foreground">{match.time}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-1 h-6 rounded-full',
                        match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    <span className="font-medium">{match.score}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <LevelIcon level={level} className="h-7 w-7 mr-2" />
                  <span className="font-semibold">{match.skillLevel}</span>
                  <span className={cn(
                    "ml-2 flex items-center text-xs",
                    match.skillChange > 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {match.skillChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(match.skillChange)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{match.kd}</TableCell>
              <TableCell className={cn(
                "font-semibold",
                match.kdRatio < 1.0 ? "text-red-400" : "text-green-400"
              )}>
                {match.kdRatio.toFixed(2)}
              </TableCell>
              <TableCell className={cn(
                "font-semibold",
                match.krRatio < 1.0 ? "text-red-400" : "text-green-400"
              )}>
                {match.krRatio.toFixed(2)}
              </TableCell>
              <TableCell className="font-semibold">{match.map}</TableCell>
              <TableCell className="text-right">
                <button className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}
