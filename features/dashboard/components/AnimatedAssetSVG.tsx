import { cn } from "@/lib/utils";

import React from 'react';

export const AnimatedAssetSVG = React.memo(function AnimatedAssetSVG({ machine, className }: { machine: any; className?: string }) {
  const isCritical = machine.risk === 'Critical';
  const isWarning = machine.risk === 'High' || machine.risk === 'Medium';
  const isStopped = machine.utilization === 0 || machine.availability === 0;

  // Animation duration based on RPM (clamped to sensible visual limits)
  const baseRPM = Math.max(1, machine.rpm || 100);
  const animationDuration = isStopped ? '0s' : `${Math.max(0.5, Math.min(10, 6000 / baseRPM))}s`;

  // Color logic for status indicators
  const statusColor = isCritical ? '#ef4444' : isWarning ? '#eab308' : '#22c55e';

  // Shared Defs for 3D Shading
  const SharedDefs = () => (
    <defs>
      <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
      </filter>
      <filter id="glow-critical">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <linearGradient id="metal-cylinder" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="30%" stopColor="#94a3b8" />
        <stop offset="50%" stopColor="#f1f5f9" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>

      <linearGradient id="metal-cylinder-vert" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="30%" stopColor="#94a3b8" />
        <stop offset="50%" stopColor="#f1f5f9" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      <linearGradient id="metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      <radialGradient id="flame-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
        <stop offset="40%" stopColor="#f97316" stopOpacity="0.8" />
        <stop offset="80%" stopColor="#ef4444" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </radialGradient>
      
      <linearGradient id="heat-body" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="50%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
  );

  const renderCrusher = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      <SharedDefs />
      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes vibrate-crusher { 0% { transform: translate(0,0); } 20% { transform: translate(-1px,1px); } 40% { transform: translate(1px,-1px); } 60% { transform: translate(-1px,-1px); } 80% { transform: translate(1px,1px); } 100% { transform: translate(0,0); } }
      `}</style>
      <g style={{ animation: isCritical ? 'vibrate-crusher 0.1s infinite' : 'none' }}>
        
        {/* Back Casing */}
        <path d="M 20 20 L 80 20 L 70 85 L 30 85 Z" fill="url(#metal-dark)" filter="url(#drop-shadow)" />
        {/* Internal Cavity */}
        <path d="M 25 25 L 75 25 L 68 80 L 32 80 Z" fill="#020617" />
        
        {/* Status Indicator LED */}
        <circle cx="85" cy="15" r="3" fill={statusColor} filter={isCritical || isWarning ? "url(#glow-critical)" : ""} />

        {/* Left Rotor Group */}
        <g style={{ transformOrigin: '38px 55px', animation: isStopped ? 'none' : `spin-cw ${animationDuration} linear infinite` }}>
          {/* Main Drum */}
          <circle cx="38" cy="55" r="14" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
          {/* Teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <path key={i} d={`M 38 41 L 35 34 L 41 34 Z`} fill="url(#metal-dark)" transform={`rotate(${angle} 38 55)`} />
          ))}
          {/* Shaft */}
          <circle cx="38" cy="55" r="5" fill="#0f172a" />
          <circle cx="38" cy="55" r="3" fill="#cbd5e1" />
        </g>

        {/* Right Rotor Group */}
        <g style={{ transformOrigin: '62px 55px', animation: isStopped ? 'none' : `spin-ccw ${animationDuration} linear infinite` }}>
          {/* Main Drum */}
          <circle cx="62" cy="55" r="14" fill="url(#metal-cylinder-vert)" filter="url(#drop-shadow)" />
          {/* Teeth */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
            <path key={i} d={`M 62 41 L 59 34 L 65 34 Z`} fill="url(#metal-dark)" transform={`rotate(${angle} 62 55)`} />
          ))}
          {/* Shaft */}
          <circle cx="62" cy="55" r="5" fill="#0f172a" />
          <circle cx="62" cy="55" r="3" fill="#cbd5e1" />
        </g>

        {/* Front Hopper Frame */}
        <path d="M 15 15 L 85 15 L 85 22 L 15 22 Z" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
        <path d="M 40 85 L 60 85 L 60 95 L 40 95 Z" fill="url(#metal-dark)" />
        {/* Falling Material (if running) */}
        {!isStopped && (
          <g fill="#94a3b8" className="opacity-60" style={{ animation: `spin-cw 0.3s linear infinite` }}>
            <circle cx="45" cy="88" r="2" />
            <circle cx="55" cy="92" r="1.5" />
            <circle cx="50" cy="85" r="2.5" />
          </g>
        )}
      </g>
    </svg>
  );

  const renderKiln = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      <SharedDefs />
      <style>{`
        @keyframes rotate-kiln { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 40; } }
        @keyframes flame-flicker { 0% { transform: scale(1) translate(0,0); opacity: 0.9; } 50% { transform: scale(1.1) translate(-2px, 1px); opacity: 1; } 100% { transform: scale(1) translate(0,0); opacity: 0.9; } }
        @keyframes vibrate-kiln { 0% { transform: translate(0,0) rotate(-8deg); } 50% { transform: translate(0, 2px) rotate(-8deg); } 100% { transform: translate(0,0) rotate(-8deg); } }
      `}</style>
      <g style={{ transformOrigin: '50px 50px', transform: 'rotate(-8deg)', animation: isCritical ? 'vibrate-kiln 0.2s infinite' : 'none' }}>
        
        {/* Background Supports */}
        <path d="M 26 70 L 34 70 L 34 95 L 26 95 Z" fill="url(#metal-dark)" />
        <path d="M 66 65 L 74 65 L 74 95 L 66 95 Z" fill="url(#metal-dark)" />

        {/* Support Rollers (Tires) */}
        <ellipse cx="30" cy="70" rx="8" ry="4" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
        <ellipse cx="70" cy="65" rx="8" ry="4" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />

        {/* Main Kiln Body */}
        <rect x="10" y="35" width="80" height="28" rx="2" fill={machine.temperatureC > 1000 ? "url(#heat-body)" : "url(#metal-cylinder-vert)"} filter="url(#drop-shadow)" />
        
        {/* Riding Rings (Steel Girths) */}
        <rect x="25" y="32" width="10" height="34" rx="1" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
        <rect x="65" y="32" width="10" height="34" rx="1" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
        
        {/* Rotation texture lines */}
        <path d="M 12 45 L 88 45 M 12 55 L 88 55" stroke="#1e293b" strokeWidth="1" strokeDasharray="5 15" strokeOpacity="0.4" style={{ animation: isStopped ? 'none' : `rotate-kiln ${animationDuration} linear infinite` }} />
        
        {/* Status LED */}
        <circle cx="15" cy="40" r="2" fill={statusColor} filter={isCritical || isWarning ? "url(#glow-critical)" : ""} />

        {/* Burner Flame */}
        {!isStopped && (
          <g style={{ transformOrigin: '85px 50px', animation: 'flame-flicker 0.1s infinite' }}>
            <circle cx="90" cy="49" r="12" fill="url(#flame-glow)" />
            <path d="M 80 44 Q 95 49 80 54 Z" fill="#f97316" />
            <path d="M 80 46 Q 90 49 80 52 Z" fill="#fef08a" />
          </g>
        )}
      </g>
      
      {/* Front Piers */}
      <path d="M 22 72 L 30 72 L 32 95 L 20 95 Z" fill="url(#metal-cylinder-vert)" filter="url(#drop-shadow)" />
      <path d="M 62 67 L 70 67 L 72 95 L 60 95 Z" fill="url(#metal-cylinder-vert)" filter="url(#drop-shadow)" />
    </svg>
  );

  const renderMill = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      <SharedDefs />
      <style>{`
        @keyframes spin-mill-table { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 40; } }
        @keyframes spin-roller { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vibrate-mill { 0% { transform: translate(0,0); } 25% { transform: translate(1px, 0); } 50% { transform: translate(0, 1px); } 75% { transform: translate(-1px, 0); } 100% { transform: translate(0,0); } }
      `}</style>
      <g style={{ animation: isCritical ? 'vibrate-mill 0.1s infinite' : 'none' }}>
        
        {/* Outer Casing / Mill Body */}
        <path d="M 25 15 L 75 15 L 85 45 L 85 85 L 15 85 L 15 45 Z" fill="url(#metal-dark)" filter="url(#drop-shadow)" />
        
        {/* Inner Grinding Cavity */}
        <ellipse cx="50" cy="45" rx="35" ry="12" fill="#020617" />
        <path d="M 15 45 L 85 45 L 80 80 L 20 80 Z" fill="#0f172a" />

        {/* Grinding Table (Rotating Base) */}
        <ellipse cx="50" cy="75" rx="28" ry="8" fill="url(#metal-cylinder)" filter="url(#drop-shadow)" />
        {/* Table Texture (Spins) */}
        <ellipse cx="50" cy="75" rx="24" ry="5" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="8 8" style={{ animation: isStopped ? 'none' : `spin-mill-table ${animationDuration} linear infinite` }} />

        {/* Central Shaft */}
        <path d="M 45 15 L 55 15 L 52 75 L 48 75 Z" fill="url(#metal-cylinder)" />

        {/* Roller 1 (Left) */}
        <g style={{ transformOrigin: '32px 55px', animation: isStopped ? 'none' : `spin-roller ${animationDuration} linear infinite` }}>
          <circle cx="32" cy="55" r="12" fill="url(#metal-cylinder-vert)" filter="url(#drop-shadow)" />
          <circle cx="32" cy="55" r="8" fill="none" stroke="#475569" strokeWidth="2" />
          <circle cx="32" cy="55" r="4" fill="#0f172a" />
          <circle cx="32" cy="55" r="2" fill="#cbd5e1" />
        </g>
        {/* Hydraulic Arm L */}
        <path d="M 15 35 L 32 55 L 28 55 L 15 38 Z" fill="url(#metal-dark)" />

        {/* Roller 2 (Right) */}
        <g style={{ transformOrigin: '68px 55px', animation: isStopped ? 'none' : `spin-roller ${animationDuration} linear infinite` }}>
          <circle cx="68" cy="55" r="12" fill="url(#metal-cylinder-vert)" filter="url(#drop-shadow)" />
          <circle cx="68" cy="55" r="8" fill="none" stroke="#475569" strokeWidth="2" />
          <circle cx="68" cy="55" r="4" fill="#0f172a" />
          <circle cx="68" cy="55" r="2" fill="#cbd5e1" />
        </g>
        {/* Hydraulic Arm R */}
        <path d="M 85 35 L 68 55 L 72 55 L 85 38 Z" fill="url(#metal-dark)" />

        {/* Roller 3 (Center Back) - Slightly darker to show depth */}
        <g style={{ transformOrigin: '50px 45px', animation: isStopped ? 'none' : `spin-roller ${animationDuration} linear infinite` }}>
          <circle cx="50" cy="45" r="10" fill="url(#metal-dark)" filter="url(#drop-shadow)" />
          <circle cx="50" cy="45" r="3" fill="#0f172a" />
        </g>

        {/* Status LED */}
        <circle cx="20" cy="20" r="3" fill={statusColor} filter={isCritical || isWarning ? "url(#glow-critical)" : ""} />

        {/* Front Transparent Shield Overlay */}
        <path d="M 25 15 L 75 15 L 85 45 L 85 85 L 15 85 L 15 45 Z" fill="#94a3b8" fillOpacity="0.1" pointerEvents="none" />
      </g>
    </svg>
  );

  if (machine.id.includes('crusher')) return renderCrusher();
  if (machine.id.includes('kiln') || machine.id.includes('cooler')) return renderKiln();
  return renderMill();
}, (prev, next) => {
  return prev.machine.risk === next.machine.risk &&
         prev.machine.utilization === next.machine.utilization &&
         prev.machine.availability === next.machine.availability &&
         prev.machine.rpm === next.machine.rpm;
});
