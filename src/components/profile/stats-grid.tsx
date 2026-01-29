import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from 'lucide-react';

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
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {stats.map((stat) => (
          <div key={stat.id}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <span className="ml-auto text-sm text-foreground font-bold">{stat.value}</span>
            </div>
            <Progress value={stat.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
