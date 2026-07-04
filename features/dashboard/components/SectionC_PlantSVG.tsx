'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SimulationContext } from '@/lib/engineering/types';

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
  const [hoveredNode, setHoveredNode] = useState<PlantNodeProps | null>(null);

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
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              className={cn(
                "w-32 h-32 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110",
                getColorClass(node.context.currentState)
              )}
            >
              <span className="font-bold text-white text-center px-2 drop-shadow-md">{node.name}</span>
              <span className="text-xs text-white/80 mt-1">{node.context.currentState}</span>
            </div>

            {/* Connecting Line (except last) */}
            {index < nodes.length - 1 && (
              <div className="w-16 h-1 bg-border relative">
                {/* Flow animation */}
                <div className="absolute top-0 left-0 h-full bg-primary/50 w-full animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg p-4 shadow-xl flex space-x-6 z-50 animate-in fade-in zoom-in duration-200">
          <div>
            <p className="text-xs text-muted-foreground">Equipment</p>
            <p className="font-bold text-foreground">{hoveredNode.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Health</p>
            <p className="font-bold text-foreground">{hoveredNode.health}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{hoveredNode.isProcessTemp ? 'Process Temp' : 'Bearing Temp'}</p>
            <p className="font-bold text-foreground">{hoveredNode.temperature.toFixed(hoveredNode.isProcessTemp ? 0 : 1)}°C</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <p className={cn("font-bold", (hoveredNode.riskTier === 'High' || hoveredNode.riskTier === 'Critical') ? "text-destructive" : hoveredNode.riskTier === 'Medium' ? "text-yellow-500" : "text-success")}>
              {hoveredNode.riskTier}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
