'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, AlertTriangle, Info, Wrench } from 'lucide-react';

export function TabDigitalTwin() {
  const store = useStore();
  const { 
    dtClock, dtIsRunning, dtStart, dtPause, dtReset,
    dtThroughputNominal, dtThroughputCurrent, dtThroughputEfficiency,
    dtEnergyTarget, dtEnergyCurrent, dtCO2Target, dtCO2Current,
    dtMachines, dtEvents, dtCrewStatus, dtBottleneck
  } = store;

  const hours = Math.floor(dtClock * 15 / 60).toString().padStart(2, '0');
  const mins = ((dtClock * 15) % 60).toString().padStart(2, '0');
  const timeStr = `${hours}:${mins}`;

  const getEventIcon = (cat: string) => {
    switch(cat) {
      case 'Information': return <Info className="h-4 w-4 text-blue-500" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Maintenance': return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getStateMachinePhase = () => {
    if (dtClock === 32 && !dtIsRunning && dtCrewStatus.status === 'Available') return 0; // Idle
    if (dtBottleneck || dtCrewStatus.status === 'Working') return 3; // Resolving
    if (dtCrewStatus.status === 'Assigned') return 2; // Recommending
    if (dtIsRunning) return 1; // Running
    return 0; // Default
  };

  const currentPhase = getStateMachinePhase();

  const phases = [
    { name: 'Idle', desc: 'Baseline' },
    { name: 'Running', desc: 'Deteriorating' },
    { name: 'Recommending', desc: 'Action Required' },
    { name: 'Resolving', desc: 'Maintenance Applied' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* STATE MACHINE PROGRESS BAR */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2 z-0"></div>
          {phases.map((phase, idx) => {
            const isActive = currentPhase === idx;
            const isCompleted = currentPhase > idx;
            return (
              <div key={phase.name} className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-4 font-bold text-xs transition-colors duration-500",
                  isActive ? "bg-primary border-primary/20 text-primary-foreground ring-4 ring-primary/20" : 
                  isCompleted ? "bg-success border-success text-success-foreground" : 
                  "bg-card border-muted text-muted-foreground"
                )}>
                  {isCompleted ? <Info className="h-4 w-4" /> : idx + 1}
                </div>
                <div className="mt-3 text-center">
                  <p className={cn("text-sm font-bold", isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground")}>{phase.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{phase.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* HEADER: Control Bar */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Simulation Time</span>
            <span className="text-3xl font-mono font-bold tracking-tight">{timeStr}</span>
          </div>
          
          <div className="h-10 w-px bg-border" />
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Plant Status</span>
            <span className={cn(
              "px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase transition-colors duration-500",
              dtBottleneck && dtBottleneck.loss === 100 ? "bg-destructive text-white animate-pulse" : 
              dtBottleneck ? "bg-yellow-500 text-black" : "bg-success text-white"
            )}>
              {dtBottleneck && dtBottleneck.loss === 100 ? 'EMERGENCY SHUTDOWN' : 
               dtBottleneck ? 'DEGRADED PERFORMANCE' : 'NORMAL OPERATION'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={dtStart} disabled={dtIsRunning || dtBottleneck !== null} className="p-3 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors disabled:opacity-50">
            <Play className="h-5 w-5" />
          </button>
          <button onClick={dtPause} disabled={!dtIsRunning} className="p-3 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-lg transition-colors disabled:opacity-50">
            <Pause className="h-5 w-5" />
          </button>
          <button onClick={dtReset} className="p-3 bg-muted text-foreground hover:bg-muted/80 rounded-lg transition-colors">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-5 rounded-xl">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Throughput</span>
          <div className="mt-2 flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">{dtThroughputCurrent}</p>
              <p className="text-xs text-muted-foreground">tons/hr (Bottleneck Constrained)</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Nominal: {dtThroughputNominal}</p>
              <p className={cn("text-xs font-bold", dtThroughputEfficiency < 90 ? "text-destructive" : "text-success")}>
                Efficiency: {dtThroughputEfficiency}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Energy Consumption</span>
          <div className="mt-2 flex justify-between items-end">
            <div>
              <p className={cn("text-2xl font-bold", dtEnergyCurrent > dtEnergyTarget ? "text-destructive" : "text-foreground")}>{dtEnergyCurrent.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">MWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Target: {dtEnergyTarget}</p>
              <p className={cn("text-xs font-bold", dtEnergyCurrent > dtEnergyTarget ? "text-destructive" : "text-success")}>
                Variance: {((dtEnergyCurrent - dtEnergyTarget) / dtEnergyTarget * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">CO₂ Intensity</span>
          <div className="mt-2 flex justify-between items-end">
            <div>
              <p className={cn("text-2xl font-bold", dtCO2Current > dtCO2Target ? "text-orange-500" : "text-foreground")}>{dtCO2Current}</p>
              <p className="text-xs text-muted-foreground">kg / ton</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Target: {dtCO2Target}</p>
              <p className={cn("text-xs font-bold", dtCO2Current > dtCO2Target ? "text-orange-500" : "text-success")}>
                Variance: {((dtCO2Current - dtCO2Target) / dtCO2Target * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PLANT OVERVIEW (The Master Visual) */}
      <div className="bg-card border border-border p-6 rounded-xl overflow-x-auto relative shadow-inner">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Mass Flow Balance & Physics Engine</h3>
        
        {dtBottleneck && (
          <div className="absolute top-6 right-6 bg-yellow-500/10 border border-yellow-500/50 px-4 py-2 rounded-lg flex items-center shadow-lg animate-pulse z-10">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
            <div>
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Bottleneck: {dtBottleneck.machine}</p>
              <p className="text-[10px] text-yellow-500/80">{dtBottleneck.reason}</p>
            </div>
          </div>
        )}

        <div className="flex items-center min-w-max pb-4">
          {dtMachines.map((m, i) => (
            <div key={m.id} className="flex items-center">
              {/* Machine Block */}
              <div className={cn(
                "w-56 bg-background border-2 rounded-xl p-4 flex flex-col transition-all duration-500 shadow-sm",
                m.failureProb > 90 ? "border-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]" : 
                m.failureProb > 60 ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : 
                m.failureProb > 30 ? "border-yellow-500" : "border-border"
              )}>
                <div className="border-b border-border pb-2 mb-3">
                  <span className="font-bold text-foreground">{m.name}</span>
                </div>
                
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">RMS Vib.</span>
                    <span className={cn("font-mono font-semibold", m.vibrationZone === 'D' ? "text-destructive" : m.vibrationZone === 'C' ? "text-orange-500" : "text-foreground")}>
                      {m.vibrationRms.toFixed(1)} <span className="text-[9px] text-muted-foreground">mm/s (Z-{m.vibrationZone})</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bearing Temp</span>
                    <span className={cn("font-mono font-semibold", m.temperatureC > 85 ? "text-destructive" : "text-foreground")}>
                      {m.temperatureC.toFixed(1)} <span className="text-[9px] text-muted-foreground">degC</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shaft Power</span>
                    <span className="font-mono font-semibold text-foreground">
                      {m.power.toLocaleString()} <span className="text-[9px] text-muted-foreground">kW</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weibull P(f)</span>
                    <span className={cn("font-mono font-semibold", m.failureProb > 60 ? "text-destructive" : "text-foreground")}>
                      {m.failureProb.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Flow Rate</span>
                    <span className={cn("font-mono font-semibold", m.utilization === 0 ? "text-destructive" : "text-foreground")}>
                      {Math.round(m.throughputCapacity * (m.utilization / 100))} <span className="text-[9px] text-muted-foreground">t/h</span>
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-1 border-t border-border mt-1">
                    <span className="text-muted-foreground font-bold">Health Idx</span>
                    <span className="font-bold">{m.health.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Connector */}
              {i < dtMachines.length - 1 && (
                <div className="w-8 h-1 bg-muted relative overflow-hidden mx-1">
                  <div className={cn(
                    "absolute top-0 left-0 h-full w-full",
                    m.utilization > 0 ? "bg-primary/50 animate-[pulse_1.5s_ease-in-out_infinite]" : "bg-transparent"
                  )} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM PANELS: Events & Crew */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Event Log */}
        <div className="bg-card border border-border rounded-xl flex flex-col h-64 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Operations Event Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {dtEvents.map(evt => (
              <div key={evt.id} className="flex space-x-3 text-sm animate-in slide-in-from-left-2 duration-300">
                <span className="font-mono text-muted-foreground shrink-0">{evt.time}</span>
                <div className="shrink-0 pt-0.5">{getEventIcon(evt.category)}</div>
                <div>
                  <span className="font-mono text-[10px] font-semibold mr-2 px-1 rounded bg-muted text-muted-foreground">{evt.code}</span>
                  <span className="text-foreground text-[13px]">{evt.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Crew */}
        <div className="bg-card border border-border rounded-xl flex flex-col">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Maintenance Crew Status</h3>
          </div>
          <div className="p-6">
            <div className="bg-background border border-border p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground text-lg">{dtCrewStatus.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    dtCrewStatus.status === 'Available' ? 'bg-success' : 'bg-orange-500 animate-pulse'
                  )} />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{dtCrewStatus.status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Target</p>
                <p className="font-bold text-foreground">{dtCrewStatus.target}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">ETA</p>
                <p className="font-bold text-foreground">{dtCrewStatus.eta > 0 ? `${dtCrewStatus.eta} min` : '--'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Priority</p>
                <p className={cn("font-bold", dtCrewStatus.priority === 'Critical' ? "text-destructive" : "text-muted-foreground")}>{dtCrewStatus.priority}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
