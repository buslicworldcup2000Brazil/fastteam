import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from 'lucide-react';
import { useTheme } from "@/components/theme-provider";
import { translations } from "@/lib/translations";

type Stat = {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  progress: number;
};

type StatsGridProps = {
  stats: Stat[];
};

export default function StatsGrid({ stats }: StatsGridProps) {
  const { language } = useTheme();
  const t = translations[language];

  const getTranslatedTitle = (title: string) => {
    switch (title) {
      case 'K/D Ratio': return t.kd_ratio;
      case 'Win Rate': return t.win_rate;
      case 'Matches Won': return t.matches_won;
      case 'Avg. Kills': return t.avg_kills;
      default: return title;
    }
  };

  const formatDisplayValue = (title: string, value: string) => {
    if (title === 'Avg. Kills') {
      return Math.round(parseFloat(value)).toString();
    }
    return value;
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {stats.map((stat) => (
          <div key={stat.id}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{getTranslatedTitle(stat.title)}</span>
              <span className="ml-auto text-sm text-foreground font-bold">
                {formatDisplayValue(stat.title, stat.value)}
              </span>
            </div>
            <Progress value={stat.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
