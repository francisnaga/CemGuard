/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function SectionG_Trends({ trendData, presentationMode }: { trendData: any[], presentationMode: boolean }) {
  const chartHeight = presentationMode ? 250 : 200;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Health Trend */}
      <div className="bg-card border border-border p-4 rounded-md">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Health Trend</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }} itemStyle={{ color: 'var(--foreground)' }} labelStyle={{ color: 'var(--muted-foreground)' }} />
              <Line type="monotone" dataKey="health" stroke="var(--success)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Probability */}
      <div className="bg-card border border-border p-4 rounded-md">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Failure Probability</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }} itemStyle={{ color: 'var(--foreground)' }} labelStyle={{ color: 'var(--muted-foreground)' }} />
              <Area type="monotone" dataKey="prob" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downtime Trend */}
      <div className="bg-card border border-border p-4 rounded-md">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Downtime Risk (Hrs)</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }} itemStyle={{ color: 'var(--foreground)' }} labelStyle={{ color: 'var(--muted-foreground)' }} />
              <Line type="monotone" dataKey="downtime" stroke="var(--warning)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OEE Trend */}
      <div className="bg-card border border-border p-4 rounded-md">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">OEE</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }} itemStyle={{ color: 'var(--foreground)' }} labelStyle={{ color: 'var(--muted-foreground)' }} />
              <Line type="monotone" dataKey="oee" stroke="var(--primary)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
