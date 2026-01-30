"use client"

import React, { useState, useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTheme } from '@/components/theme-provider';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

type ChartDataPoint = {
  date: string;
  skillLevel: number;
  kdRatio: number;
  krRatio: number;
};

type Metric = 'elo' | 'kd' | 'kr';

type GameStatsChartProps = {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  metrics: Metric[];
  showSidePanel?: boolean;
};

export default function GameStatsChart({ data, title, subtitle, metrics, showSidePanel = false }: GameStatsChartProps) {
  const { language } = useTheme();
  const t = translations[language];
  const [activeMetric, setActiveMetric] = useState<Metric>(metrics[0]);

  const chartData = useMemo(() => data.map((d, i) => ({ ...d, index: i + 1 })), [data]);

  const metricConfigs = {
    elo: { label: 'ELO', key: 'skillLevel' },
    kd: { label: 'K/D', key: 'kdRatio' },
    kr: { label: 'K/R', key: 'krRatio' },
  };

  const currentMetric = metricConfigs[activeMetric];

  const stats = useMemo(() => {
    const values = data.map(d => d[currentMetric.key as keyof ChartDataPoint] as number);
    return {
      latest: values[values.length - 1] || 0,
      highest: Math.max(...values),
      lowest: Math.min(...values),
    };
  }, [data, currentMetric]);

  const formatValue = (val: number) => {
    if (activeMetric === 'elo') return Math.round(val).toString();
    return val.toFixed(2);
  };

  return (
    <Card className="bg-[#121212] border-white/5 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-bold uppercase italic tracking-tighter">{title}</h3>}
            {subtitle && <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">{subtitle}</p>}
          </div>
          
          {metrics.length > 1 && (
            <div className="flex gap-2">
              {metrics.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic transition-all border",
                    activeMetric === m 
                      ? "bg-primary/20 border-primary text-primary" 
                      : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                  )}
                >
                  {metricConfigs[m].label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={cn("grid grid-cols-1 gap-6", showSidePanel ? "lg:grid-cols-12" : "grid-cols-1")}>
          <div className={cn("h-[250px] relative", showSidePanel ? "lg:col-span-8" : "w-full")}>
            <ChartContainer 
              config={{
                [currentMetric.key]: {
                  label: currentMetric.label,
                  color: "hsl(var(--primary))",
                }
              }} 
              className="h-full w-full"
            >
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  width={55}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                  tickFormatter={(value) => formatValue(value)}
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
                            <span className='text-xs font-black uppercase italic text-primary'>
                              {currentMetric.label}: {formatValue(Number(value))}
                            </span>
                          </div>
                        )
                    }}
                  />}
                />
                <Line
                  dataKey={currentMetric.key}
                  type="linear"
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

          {showSidePanel && (
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-lg p-5 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-3xl font-black italic text-white whitespace-nowrap">
                  {formatValue(stats.latest)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  Current {currentMetric.label}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Highest</span>
                  <span className="text-white text-right font-mono">
                    {formatValue(stats.highest)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Lowest</span>
                  <span className="text-white text-right font-mono">
                    {formatValue(stats.lowest)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
