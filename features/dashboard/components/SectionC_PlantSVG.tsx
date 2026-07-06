'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SimulationContext } from '@/lib/engineering/types';
import { useStore } from '@/lib/store';

interface PlantNodeProps {
  id: string;
  name: string;
  context: SimulationContext;
  health: number;
  temperature: number;
  isProcessTemp?: boolean;
  riskTier: string;
}

export function SectionC_PlantSVG({ nodes }: { nodes: PlantNodeProps[] }) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const openDigitalTwin = useStore((state) => state.openDigitalTwin);

  const getNodeBorderClass = (node: PlantNodeProps) => {
    if (node.context.currentState === 'Idle' || node.context.currentState === 'Offline')
      return 'border-muted opacity-50';
    switch (node.riskTier) {
      case 'Critical': return 'border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.3)]';
      case 'High':     return 'border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.25)]';
      case 'Medium':   return 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
      default:         return 'border-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]';
    }
  };

  const getBarClass = (node: PlantNodeProps) => {
    if (node.context.currentState === 'Idle' || node.context.currentState === 'Offline')
      return 'bg-muted';
    switch (node.riskTier) {
      case 'Critical': return 'bg-red-500';
      case 'High':     return 'bg-orange-500';
      case 'Medium':   return 'bg-amber-400';
      default:         return 'bg-emerald-500';
    }
  };

  const getRiskLabel = (node: PlantNodeProps) => {
    if (node.context.currentState === 'Offline' || node.context.currentState === 'Idle')
      return { text: 'OFFLINE', color: 'text-muted-foreground' };
    switch (node.riskTier) {
      case 'Critical': return { text: 'CRITICAL', color: 'text-red-400' };
      case 'High':     return { text: 'HIGH RISK', color: 'text-orange-400' };
      case 'Medium':   return { text: 'MODERATE', color: 'text-amber-400' };
      default:         return { text: 'NORMAL', color: 'text-emerald-400' };
    }
  };

  return (
    <div className="relative w-full h-[300px] bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col justify-center shadow-sm">
      {/* Subtle grid background for SCADA feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <h3 className="absolute top-4 left-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Live Plant Overview
      </h3>

      <div className="w-full h-full pt-8 relative z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center justify-start lg:justify-center min-w-max h-full px-2">
          {nodes.map((node, index) => {
            const riskLabel = getRiskLabel(node);
            return (
              <div key={node.id} className="relative flex items-center group shrink-0">
                {/* Machine Block */}
                <div
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => openDigitalTwin(node.id)}
                  className={cn(
                    "relative w-32 h-32 rounded-xl border-2 bg-card flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-primary/40 hover:scale-105",
                    getNodeBorderClass(node)
                  )}
                >
                  {/* Top status bar */}
                  <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-xl", getBarClass(node))} />

                  <span className="font-bold text-foreground text-center px-2 text-sm leading-tight">{node.name}</span>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest mt-1.5", riskLabel.color)}>
                    {riskLabel.text}
                  </span>
                </div>

                {/* Flow connector */}
                {index < nodes.length - 1 && (
                  <div className="w-16 flex items-center justify-center relative">
                    <div className="w-full h-0.5 bg-border" />
                    {/* Animated flow pulse */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 overflow-hidden">
                      <div className="h-full w-1/3 bg-primary/50 animate-[slide-right_1.5s_linear_infinite]" />
                    </div>
                    {/* Arrow tip */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredNodeId && (() => {
        const liveHoveredNode = nodes.find(n => n.id === hoveredNodeId);
        if (!liveHoveredNode) return null;
        const riskLabel = getRiskLabel(liveHoveredNode);
        return (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl p-4 shadow-2xl flex space-x-5 z-50 backdrop-blur-sm">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Equipment</p>
              <p className="font-bold text-foreground text-sm">{liveHoveredNode.name}</p>
            </div>
            <div className="border-l border-border pl-4">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Health</p>
              <p className="font-mono font-bold text-foreground text-sm tabular-nums">{liveHoveredNode.health.toFixed(1)}%</p>
            </div>
            <div className="border-l border-border pl-4">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                {liveHoveredNode.isProcessTemp ? 'Process Temp' : 'Bearing Temp'}
              </p>
              <p className="font-mono font-bold text-foreground text-sm tabular-nums">
                {liveHoveredNode.temperature.toFixed(liveHoveredNode.isProcessTemp ? 0 : 1)}°C
              </p>
            </div>
            <div className="border-l border-border pl-4">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Risk</p>
              <p className={cn("font-mono font-bold text-sm", riskLabel.color)}>{riskLabel.text}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
