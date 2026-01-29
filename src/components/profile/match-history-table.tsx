import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import LevelIcon from "@/components/ui/level-icon"

type Match = {
  id: string;
  date: string;
  time: string;
  result: 'win' | 'loss';
  score: string;
  skillLevel: number;
  skillChange: number;
  kda: string;
  adr: number;
  kdRatio: number;
  krRatio: number;
  map: string;
};

type MatchHistoryTableProps = {
  matches: Match[];
};

export default function MatchHistoryTable({ matches }: MatchHistoryTableProps) {
  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b-border/50">
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Skill level</TableHead>
            <TableHead>KDA</TableHead>
            <TableHead>ADR</TableHead>
            <TableHead>K/D</TableHead>
            <TableHead>K/R</TableHead>
            <TableHead>Map</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => {
            const level = Math.min(10, Math.floor(match.skillLevel / 450));
            return (
            <TableRow key={match.id} className="border-b-border/20 last:border-b-0">
              <TableCell>
                <div className="font-medium">{match.date}</div>
                <div className="text-sm text-muted-foreground">{match.time}</div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    'w-6 h-6 p-0 mr-2 inline-flex items-center justify-center text-white font-bold text-xs',
                    match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                  )}
                >
                  {match.result === 'win' ? 'W' : 'L'}
                </Badge>
                <span className="font-medium">{match.score}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <LevelIcon level={level} className="h-7 w-7 mr-2" />
                  <span className="font-semibold">{match.skillLevel.toLocaleString()}</span>
                  <span className={cn(
                    "ml-2 flex items-center text-xs",
                    match.skillChange > 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {match.skillChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(match.skillChange)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{match.kda}</TableCell>
              <TableCell className="font-semibold">{match.adr.toFixed(1)}</TableCell>
              <TableCell className="font-semibold">{match.kdRatio.toFixed(2)}</TableCell>
              <TableCell className="font-semibold">{match.krRatio.toFixed(2)}</TableCell>
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
