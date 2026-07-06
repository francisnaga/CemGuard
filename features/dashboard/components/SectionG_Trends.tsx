/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const CHART_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
};

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--popover)',
  borderColor: 'var(--border)',
  borderRadius: '8px',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
};

const charts = [
  {
    key: 'health',
    label: 'Fleet Health Trend',
    unit: '%',
    type: 'line',
    stroke: '#22c55e',
    fill: '#22c55e',
  },
  {
    key: 'prob',
    label: 'Failure Probability',
    unit: '%',
    type: 'area',
    stroke: '#ef4444',
    fill: '#ef4444',
  },
  {
    key: 'downtime',
    label: 'Downtime Risk',
    unit: 'Hrs',
    type: 'line',
    stroke: '#f59e0b',
    fill: '#f59e0b',
  },
  {
    key: 'oee',
    label: 'OEE',
    unit: '%',
    type: 'line',
    stroke: 'var(--primary)',
    fill: 'var(--primary)',
  },
];

export function SectionG_Trends({ trendData, presentationMode }: { trendData: any[], presentationMode: boolean }) {
  const chartHeight = presentationMode ? 250 : 200;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {charts.map((c) => (
        <div
          key={c.key}
          className="bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Header row */}
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {c.label}
            </h3>
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase">{c.unit}</span>
          </div>

          <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer>
              {c.type === 'area' ? (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id={`area-grad-${c.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.fill} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={c.fill} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    style={CHART_STYLE}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    style={CHART_STYLE}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={{ color: c.stroke }}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={c.key}
                    stroke={c.stroke}
                    fill={`url(#area-grad-${c.key})`}
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              ) : (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    style={CHART_STYLE}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    style={CHART_STYLE}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)' }}
                    domain={c.key === 'oee' ? [60, 100] : undefined}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={{ color: c.stroke }}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey={c.key}
                    stroke={c.stroke}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
