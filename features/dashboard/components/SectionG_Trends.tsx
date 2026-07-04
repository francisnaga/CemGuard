'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function SectionG_Trends({ trendData, presentationMode }: { trendData: any[], presentationMode: boolean }) {
  
  const chartHeight = presentationMode ? 250 : 200;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Health Trend */}
      <div className="bg-card border border-border p-4 rounded-xl">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Health Trend</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
              <Line type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={!presentationMode} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Probability */}
      <div className="bg-card border border-border p-4 rounded-xl">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Failure Probability</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
              <Area type="monotone" dataKey="prob" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} isAnimationActive={!presentationMode} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downtime Trend */}
      <div className="bg-card border border-border p-4 rounded-xl">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">Downtime Risk (Hrs)</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
              <Line type="monotone" dataKey="downtime" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={!presentationMode} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OEE Trend */}
      <div className="bg-card border border-border p-4 rounded-xl">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-4">OEE</h3>
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
              <Line type="monotone" dataKey="oee" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={!presentationMode} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
