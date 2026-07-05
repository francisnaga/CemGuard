"use client";

import { cn } from "@/lib/utils";
import { MachineState } from "@/lib/store";

export function AssetSVG({ machine, className }: { machine: MachineState; className?: string }) {
  const isHealthy = machine.health > 80;
  const isWarning = machine.health <= 80 && machine.health > 50;
  const isCritical = machine.health <= 50;

  // Determine glow and color based on health
  const colorClass = isHealthy ? "text-primary" : isWarning ? "text-warning" : "text-destructive";
  const glowClass = isHealthy ? "drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" : isWarning ? "drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]";

  // Animation speed based on RPM
  const rpmSpeed = Math.max(1, 1000 / (machine.rpm || 1));
  const spinStyle = { animationDuration: `${rpmSpeed}s` };

  const renderSVG = () => {
    if (machine.name.includes("Crusher")) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <g className={cn("origin-center animate-spin", colorClass)} style={spinStyle}>
            {/* Outer Gear */}
            <path d="M50 5 C55 5, 58 10, 60 15 C65 17, 70 20, 75 25 C80 23, 85 25, 88 30 C90 35, 88 40, 85 45 C86 50, 86 55, 85 60 C88 65, 90 70, 88 75 C85 80, 80 82, 75 80 C70 85, 65 88, 60 90 C58 95, 55 100, 50 100 C45 100, 42 95, 40 90 C35 88, 30 85, 25 80 C20 82, 15 80, 12 75 C10 70, 12 65, 15 60 C14 55, 14 50, 15 45 C12 40, 10 35, 12 30 C15 25, 20 23, 25 25 C30 20, 35 17, 40 15 C42 10, 45 5, 50 5 Z M50 25 A25 25 0 1 0 50 75 A25 25 0 1 0 50 25 Z" />
            <circle cx="50" cy="50" r="15" className="fill-background" />
          </g>
          {/* Base */}
          <rect x="20" y="85" width="60" height="10" className="fill-muted-foreground/30" />
        </svg>
      );
    }
    
    if (machine.name.includes("Kiln")) {
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <g className={colorClass}>
            {/* Base Supports */}
            <rect x="30" y="70" width="20" height="20" className="fill-muted-foreground/40" />
            <rect x="150" y="70" width="20" height="20" className="fill-muted-foreground/40" />
            {/* The rotating cylinder */}
            <g className="origin-center" style={{ transformOrigin: '100px 50px', animation: `spin ${rpmSpeed * 5}s linear infinite` }}>
              <rect x="10" y="30" width="180" height="40" rx="5" className={cn("transition-colors duration-1000", glowClass)} />
              {/* Heat bands */}
              <rect x="40" y="30" width="20" height="40" className={cn("fill-destructive/40", isCritical && "animate-pulse")} />
              <rect x="90" y="30" width="40" height="40" className={cn("fill-destructive/60", (isWarning || isCritical) && "animate-pulse")} />
              <rect x="150" y="30" width="20" height="40" className={cn("fill-destructive/30")} />
            </g>
          </g>
        </svg>
      );
    }

    if (machine.name.includes("Mill")) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <g className={colorClass}>
            <circle cx="50" cy="50" r="40" className="fill-muted/20 stroke-current stroke-[4px]" />
            <g className="origin-center animate-spin" style={spinStyle}>
              {/* Internal grinding balls */}
              <circle cx="50" cy="25" r="10" className={cn(glowClass)} />
              <circle cx="75" cy="50" r="10" className={cn(glowClass)} />
              <circle cx="50" cy="75" r="10" className={cn(glowClass)} />
              <circle cx="25" cy="50" r="10" className={cn(glowClass)} />
            </g>
          </g>
          <rect x="30" y="85" width="40" height="10" className="fill-muted-foreground/40" />
        </svg>
      );
    }

    if (machine.name.includes("Cooler") || machine.name.includes("Packing")) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <g className={cn("origin-center animate-spin", colorClass, glowClass)} style={spinStyle}>
            <path d="M50 10 Q60 50 50 90 Q40 50 50 10 Z" />
            <path d="M10 50 Q50 60 90 50 Q50 40 10 50 Z" />
          </g>
          <circle cx="50" cy="50" r="10" className="fill-background" />
        </svg>
      );
    }

    // Default 
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
        <rect x="25" y="25" width="50" height="50" rx="10" className={cn(colorClass, glowClass, "animate-pulse")} />
      </svg>
    );
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {renderSVG()}
    </div>
  );
}
