"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';

type ChartDataPoint = {
  date: string;
  skillLevel: number;
};

type GameStatsChartProps = {
  data: ChartDataPoint[];
};

const chartConfig = {
    skillLevel: {
        label: "Skill Level",
        color: "hsl(var(--primary))",
    },
};

export default function GameStatsChart({ data }: GameStatsChartProps) {
  const { language } = useTheme();
  const t = translations[language];
  
  const chartData = useMemo(() => data.map((d, i) => ({...d, name: `Match ${i + 1}`})), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.performance_trend}</CardTitle>
        <CardDescription>{t.skill_over_matches.replace('{count}', data.length.toString())}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis 
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis 
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={80}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="dot"
                        formatter={(value, name, props) => {
                          if (name === 'skillLevel' && props.payload) {
                            return (
                              <div className="flex flex-col">
                                <span className="font-semibold">{props.payload.date}</span>
                                <span className='text-sm'>{t.skill_level}: {value}</span>
                              </div>
                            )
                          }
                          return value;
                        }}
                    />}
                />
                <Line
                    dataKey="skillLevel"
                    type="monotone"
                    stroke="var(--color-skillLevel)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-skillLevel)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
