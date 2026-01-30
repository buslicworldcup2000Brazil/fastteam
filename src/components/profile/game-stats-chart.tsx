"use client"

import React, { useState, useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

type ChartDataPoint = {
  date: string;
  skillLevel: number;
  kdRatio: number;
  krRatio: number; // This is AVG
};

type GameStatsChartProps = {
  data: ChartDataPoint[];
};

type Metric = 'elo' | 'kd' | 'avg';

export default function GameStatsChart({ data }: GameStatsChartProps) {
  const { language } = useTheme();
  const t = translations[language];
  const [activeMetric, setActiveMetric] = useState<Metric>('elo');

  const chartData = useMemo(() => data.map((d, i) => ({ ...d, index: i + 1 })), [data]);

  const metrics = {
    elo: { label: 'ELO', key: 'skillLevel', color: 'hsl(var(--primary))' },
    kd: { label: 'K/D', key: 'kdRatio', color: 'hsl(var(--primary))' },
    avg: { label: 'AVG', key: 'krRatio', color: 'hsl(var(--primary))' },
  };

  const currentMetric = metrics[activeMetric];

  const stats = useMemo(() => {
    const values = data.map(d => d[currentMetric.key as keyof ChartDataPoint] as number);
    return {
      latest: values[values.length - 1] || 0,
      highest: Math.max(...values),
      lowest: Math.min(...values),
    };
  }, [data, currentMetric]);

  return (
    <Card className="bg-[#121212] border-white/5 overflow-hidden">
      <div className="p-4 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {(Object.keys(metrics) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-black uppercase italic transition-all border",
                activeMetric === m 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
              )}
            >
              {metrics[m].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Chart Area */}
          <div className="lg:col-span-9 h-[250px] relative">
            <ChartContainer 
              config={{
                [currentMetric.key]: {
                  label: currentMetric.label,
                  color: currentMetric.color,
                }
              }} 
              className="h-full w-full"
            >
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="index"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  domain={activeMetric === 'elo' ? ['dataMin - 50', 'dataMax + 50'] : ['auto', 'auto']}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={40}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                />
                <ChartTooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  content={<ChartTooltipContent 
                    indicator="dot"
                    labelClassName="hidden"
                    formatter={(value, name, props) => {
                        return (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[10px] opacity-40">{props.payload.date}</span>
                            <span className='text-xs font-black uppercase italic text-primary'>{currentMetric.label}: {value}</span>
                          </div>
                        )
                    }}
                  />}
                />
                <Line
                  dataKey={currentMetric.key}
                  type="linear" // SHARP EDGES
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "hsl(var(--primary))",
                    stroke: "#121212",
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <p className="text-2xl font-black italic tracking-tighter text-white">
                {activeMetric === 'elo' ? stats.latest : stats.latest.toFixed(2)}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                Current {currentMetric.label}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">Highest</span>
                <span className="text-white">{activeMetric === 'elo' ? stats.highest : stats.highest.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">Lowest</span>
                <span className="text-white">{activeMetric === 'elo' ? stats.lowest : stats.lowest.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
