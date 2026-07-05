"use client";

import { useStore } from "@/lib/store";
import { X, Activity, Thermometer, AlertTriangle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedAssetSVG } from "./AnimatedAssetSVG";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

export function AssetDigitalTwinModal() {
  const { selectedMachineIdForTwin, closeDigitalTwin, dtMachines, dtHistory } = useStore();

  if (!selectedMachineIdForTwin) return null;

  const machine = dtMachines.find(m => m.id === selectedMachineIdForTwin);
  
  if (!machine) {
    closeDigitalTwin();
    return null;
  }

  // Generate historical data specifically for this machine
  const chartData = dtHistory.map(h => {
    const mHistory = h.machines.find(m => m.id === machine.id);
    return {
      day: `${Math.floor(h.time * 15 / 60)}:${(h.time * 15 % 60).toString().padStart(2, '0')}`,
      vibration: mHistory?.vibrationRms || 0,
      temperature: mHistory?.temperatureC || 0,
      failureProb: mHistory?.failureProb || 0,
    };
  });

  const isHealthy = machine.health > 80;
  const isWarning = machine.health <= 80 && machine.health > 50;
  const isCritical = machine.health <= 50;

  const headerColor = isHealthy ? "bg-primary/20 text-primary border-primary/30" 
                    : isWarning ? "bg-warning/20 text-warning border-warning/30" 
                    : "bg-destructive/20 text-destructive border-destructive/30";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-md transition-all duration-300" 
        onClick={closeDigitalTwin} 
      />
      
      {/* Modal Body */}
      <div className="relative bg-card border border-border shadow-2xl rounded-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10 relative overflow-hidden">
          {/* Subtle animated gradient background for header based on state */}
          <div className={cn("absolute inset-0 opacity-20", 
            isHealthy ? "bg-gradient-to-r from-success/0 via-success/20 to-success/0" : 
            isWarning ? "bg-gradient-to-r from-warning/0 via-warning/20 to-warning/0 animate-pulse" : 
            "bg-gradient-to-r from-destructive/0 via-destructive/30 to-destructive/0 animate-pulse"
          )} />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className={cn("px-4 py-2 rounded-lg border font-mono font-bold uppercase tracking-wider", headerColor)}>
              ID: {machine.id}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                {machine.name} Digital Twin
                {isCritical && <AlertTriangle className="w-6 h-6 text-destructive animate-bounce" />}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Asset Status: {isHealthy ? 'Nominal Operation' : isWarning ? 'Degraded Performance' : 'Critical Failure Imminent'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeDigitalTwin}
            className="p-3 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-muted/5">
          
          {/* Left Column: Visualizer & Live Gauges (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* 3D Visualizer Mock */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner h-[200px]">
              <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
                <span className="relative flex h-2 w-2">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isHealthy ? "bg-success" : isWarning ? "bg-warning" : "bg-destructive")}></span>
                  <span className={cn("relative inline-flex rounded-full h-2 w-2", isHealthy ? "bg-success" : isWarning ? "bg-warning" : "bg-destructive")}></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground shadow-black drop-shadow-md">Live Telemetry Linked</span>
              </div>
              
              <div className="relative w-full aspect-square max-h-[140px] flex items-center justify-center p-2">
                <AnimatedAssetSVG machine={machine} />
              </div>
              
              <div className="absolute bottom-2 left-0 right-0 text-center z-10">
                <span className="bg-background/80 backdrop-blur text-foreground px-2 py-0.5 rounded-full text-[10px] font-mono border border-border inline-flex items-center gap-1 shadow-lg">
                  <PlayCircle className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} /> 
                  RPM: {Math.round(machine.rpm || 0)}
                </span>
              </div>
            </div>

            {/* Live Gauges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                <Thermometer className={cn("w-6 h-6 mb-1", isCritical ? "text-destructive" : "text-muted-foreground")} />
                <span className="text-2xl font-bold font-mono">{machine.temperatureC.toFixed(1)}°C</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Bearing Temp</span>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                <Activity className={cn("w-6 h-6 mb-1", isCritical ? "text-destructive" : "text-muted-foreground")} />
                <span className="text-2xl font-bold font-mono">{machine.vibrationRms.toFixed(2)}</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Vibration (mm/s)</span>
              </div>
            </div>
            
            {/* Analytics Summary */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Physics Engine Analytics</h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Load Factor</span>
                  <span className="font-bold">{(machine.loadFactor * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wear Accumulation</span>
                  <span className="font-bold text-warning">{machine.wearAccumulation.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Lifetime (η)</span>
                  <span className="font-bold">{machine.baseEta} hrs</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border mt-2">
                  <span className="text-muted-foreground">Current Health Index</span>
                  <span className={cn("font-bold text-lg", isHealthy ? "text-primary" : isWarning ? "text-warning" : "text-destructive")}>{machine.health.toFixed(1)}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Graphs (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Weibull Failure Probability Curve */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm h-[220px] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Weibull Failure Probability</h3>
                  <p className="text-xs text-muted-foreground mt-1">Real-time cumulative distribution function F(t)</p>
                </div>
                <div className="text-right">
                  <span className={cn("text-3xl font-extrabold font-mono", isCritical ? "text-destructive" : "text-foreground")}>
                    {machine.failureProb.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex-1 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isCritical ? "#ef4444" : "#eab308"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isCritical ? "#ef4444" : "#eab308"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                    <XAxis dataKey="day" stroke="currentColor" className="opacity-50 text-xs" tickFormatter={(v) => `Day ${v}`} />
                    <YAxis stroke="currentColor" className="opacity-50 text-xs" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="failureProb" 
                      stroke={isCritical ? "#ef4444" : "#eab308"} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorProb)" 
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensor Telemetry Trends */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm h-[220px] flex flex-col">
              <div className="mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Sensor Telemetry Trends</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Vibration RMS and Bearing Temperature over time</p>
              </div>
              <div className="flex-1 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                    <XAxis dataKey="day" stroke="currentColor" className="opacity-50 text-xs" />
                    <YAxis yAxisId="left" stroke="currentColor" className="opacity-50 text-xs" />
                    <YAxis yAxisId="right" orientation="right" stroke="currentColor" className="opacity-50 text-xs" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="Vibration" />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} name="Temp" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
