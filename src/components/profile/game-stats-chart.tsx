"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';

type ChartDataPoint = {
  date: string;
  skillLevel: number;
  kdRatio?: number;
  krRatio?: number;
};

type GameStatsChartProps = {
  data: ChartDataPoint[];
  type?: 'elo' | 'kd' | 'avg';
};

const chartConfig = {
    skillLevel: {
        label: "Skill Level",
        color: "hsl(var(--primary))",
    },
    kdRatio: {
        label: "K/D",
        color: "hsl(var(--accent))",
    },
    krRatio: {
        label: "AVG",
        color: "#3b82f6",
    }
};

export default function GameStatsChart({ data, type = 'elo' }: GameStatsChartProps) {
  const { language } = useTheme();
  const t = translations[language];
  
  const chartData = useMemo(() => data.map((d, i) => ({...d, name: `Match ${i + 1}`})), [data]);

  const title = type === 'elo' ? t.performance_trend : (type === 'kd' ? "K/D Trend" : "AVG Trend");
  const description = type === 'elo' 
    ? t.skill_over_matches.replace('{count}', data.length.toString())
    : (type === 'kd' 
        ? t.kd_over_matches.replace('{count}', data.length.toString())
        : t.avg_over_matches.replace('{count}', data.length.toString()));

  const dataKey = type === 'elo' ? 'skillLevel' : (type === 'kd' ? 'kdRatio' : 'krRatio');

  return (
    <Card className="bg-[#121212] border-white/5">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase italic tracking-tighter">{title}</CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest opacity-60">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <YAxis 
                    domain={type === 'elo' ? ['dataMin - 50', 'dataMax + 50'] : ['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={50}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="dot"
                        formatter={(value, name, props) => {
                          if (name === dataKey && props.payload) {
                            return (
                              <div className="flex flex-col">
                                <span className="font-semibold text-[10px] opacity-60">{props.payload.date}</span>
                                <span className='text-xs font-black uppercase italic'>{name === 'skillLevel' ? 'ELO' : (name === 'kdRatio' ? 'K/D' : 'AVG')}: {value}</span>
                              </div>
                            )
                          }
                          return value;
                        }}
                    />}
                />
                <Line
                    dataKey={dataKey}
                    type="monotone"
                    stroke={type === 'elo' ? "hsl(var(--primary))" : (type === 'kd' ? "hsl(var(--accent))" : "#3b82f6")}
                    strokeWidth={3}
                    dot={{
                        fill: type === 'elo' ? "hsl(var(--primary))" : (type === 'kd' ? "hsl(var(--accent))" : "#3b82f6"),
                        r: 3
                    }}
                    activeDot={{
                        r: 6,
                        strokeWidth: 0
                    }}
                />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
