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

  const getColorClass = (state: string) => {
    switch (state) {
      case 'Healthy':
      case 'New': return 'bg-success border-success/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
      case 'Minor Wear':
      case 'Moderate Wear': return 'bg-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      case 'Severe Wear':
      case 'Critical':
      case 'Failure': return 'bg-destructive border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="relative w-full h-[300px] bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col justify-center">
      <h3 className="absolute top-4 left-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Live Plant Overview
      </h3>

      {/* Simplified SVG / Block Flow Representation */}
      <div className="w-full h-full pt-8 relative z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center justify-start lg:justify-center min-w-max h-full px-2">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative flex items-center group shrink-0">
              {/* The Machine Block */}
              <div 
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => openDigitalTwin(node.id)}
                className={cn(
                  "relative w-32 h-32 rounded-md border flex flex-col items-center justify-center transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50",
                  node.riskTier === 'Low' ? "bg-card border-success" :
                  node.riskTier === 'Medium' ? "bg-card border-warning" :
                  node.context.currentState === 'Idle' || node.context.currentState === 'Offline' ? "bg-card border-muted opacity-60" :
                  "bg-card border-destructive"
                )}
              >
                {/* Top border indicator for status */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1.5 rounded-t-md",
                   node.riskTier === 'Low' ? "bg-success" :
                   node.riskTier === 'Medium' ? "bg-warning" :
                   node.context.currentState === 'Idle' || node.context.currentState === 'Offline' ? "bg-muted" :
                   "bg-destructive"
                )} />
              
              <span className="font-semibold text-foreground text-center px-2 text-sm">{node.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{node.riskTier} Risk</span>
            </div>

            {/* Connecting Line (except last) */}
            {index < nodes.length - 1 && (
              <div className="w-16 h-px bg-border relative">
                {/* Flow indicator (static, no pulse) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-primary/30 w-full" />
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredNodeId && (() => {
        const liveHoveredNode = nodes.find(n => n.id === hoveredNodeId);
        if (!liveHoveredNode) return null;
        return (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-md p-4 shadow-md flex space-x-6 z-50">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Equipment</p>
              <p className="font-semibold text-foreground text-sm">{liveHoveredNode.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Health</p>
              <p className="font-mono text-foreground text-sm">{liveHoveredNode.health.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{liveHoveredNode.isProcessTemp ? 'Process Temp' : 'Bearing Temp'}</p>
              <p className="font-mono text-foreground text-sm">{liveHoveredNode.temperature.toFixed(liveHoveredNode.isProcessTemp ? 0 : 1)}°C</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk Level</p>
              <p className={cn("font-mono font-bold text-sm", liveHoveredNode.riskTier === 'Critical' ? 'text-destructive' : liveHoveredNode.riskTier === 'Low' ? 'text-success' : 'text-warning')}>
                {liveHoveredNode.riskTier}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
