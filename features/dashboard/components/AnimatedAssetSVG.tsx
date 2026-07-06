import React, { useId } from 'react';
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export const AnimatedAssetSVG = React.memo(function AnimatedAssetSVG({ machine, className }: { machine: any; className?: string }) {
  const isCritical = machine.risk === 'Critical';
  const isWarning = machine.risk === 'High' || machine.risk === 'Medium';
  const isLive = useStore(s => s.dtClock > 32);
  const isStopped = !isLive || machine.utilization === 0 || machine.availability === 0;
  
  // Dynamic parameters based on physics
  const baseRPM = machine.rpm || 10;
  const animationDuration = isStopped ? '0s' : `${Math.max(0.2, Math.min(10, 60 / baseRPM))}s`;
  const statusColor = isCritical ? '#ef4444' : isWarning ? '#eab308' : '#22c55e';
  
  // Use unique ID prefix for gradients to prevent cross-SVG conflicts
  const uid = useId().replace(/:/g, '');

  const defs = (
    <defs>
      <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="20%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="80%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>

      <linearGradient id={`${uid}-metal-horiz`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="20%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="80%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      
      <linearGradient id={`${uid}-metal-dark`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      <linearGradient id={`${uid}-kiln-heat`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="20%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="80%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={statusColor} stopOpacity="0.8" />
        <stop offset="50%" stopColor={statusColor} stopOpacity="0.3" />
        <stop offset="100%" stopColor={statusColor} stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}-fire`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#f97316" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </radialGradient>

      <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.4" />
      </filter>
    </defs>
  );

  const renderKiln = () => (
    <svg viewBox="0 0 120 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes rotate-kiln { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 20; } }
        @keyframes fire-pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
        @keyframes kiln-vibrate { 0% { transform: translate(0,0) rotate(-6deg); } 50% { transform: translate(0px, 1.5px) rotate(-6deg); } 100% { transform: translate(0,0) rotate(-6deg); } }
      `}</style>
      
      {/* Background Ambient Glow */}
      <circle cx="60" cy="50" r="40" fill={`url(#${uid}-glow)`} className="opacity-50" />

      {/* Tilted Group for Kiln */}
      <g style={{ transformOrigin: '60px 50px', transform: 'rotate(-6deg)', animation: (isCritical && !isStopped) ? 'kiln-vibrate 0.1s infinite' : 'none' }}>
        
        {/* Foundation / Piers */}
        <path d="M 25 70 L 35 70 L 35 110 L 25 110 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        <path d="M 85 70 L 95 70 L 95 110 L 85 110 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />

        {/* Support Rollers */}
        <ellipse cx="30" cy="68" rx="7" ry="5" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        <ellipse cx="90" cy="68" rx="7" ry="5" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />

        {/* Main Cylinder Tube */}
        {/* We use horizontal gradient so it looks like a lit tube */}
        <rect x="5" y="35" width="110" height="30" rx="3" fill={machine.temperatureC > 1000 ? `url(#${uid}-kiln-heat)` : `url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Riding Rings (Steel Girths) */}
        <rect x="23" y="32" width="14" height="36" rx="2" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        <rect x="83" y="32" width="14" height="36" rx="2" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Rotation Texture Lines */}
        <g style={{ animation: isStopped ? 'none' : `rotate-kiln ${animationDuration} linear infinite` }}>
          <path d="M 5 45 L 115 45 M 5 55 L 115 55" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 8" strokeOpacity="0.4" />
        </g>
        
        {/* Burner Hood (Right Side) */}
        <path d="M 110 30 L 125 35 L 125 65 L 110 70 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Exhaust Housing (Left Side) */}
        <path d="M -5 25 L 10 30 L 10 70 L -5 75 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />

        {/* Flame FX inside Burner Hood */}
        {!isStopped && (
          <g style={{ transformOrigin: '115px 50px', animation: 'fire-pulse 0.15s infinite' }}>
            <circle cx="118" cy="50" r="14" fill={`url(#${uid}-fire)`} />
            <path d="M 112 45 Q 100 50 112 55 Z" fill="#ffffff" opacity="0.9" />
          </g>
        )}
      </g>
      
      {/* Front Status Plate */}
      <g transform="translate(10, 85)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  const renderMill = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes spin-table { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes spin-roller-l { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-roller-r { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes mill-vibrate { 0% { transform: translate(0,0); } 50% { transform: translate(1px, -1px); } 100% { transform: translate(0,0); } }
      `}</style>

      {/* Ambient Glow */}
      <circle cx="50" cy="50" r="45" fill={`url(#${uid}-glow)`} className="opacity-40" />

      <g style={{ animation: (isCritical && !isStopped) ? 'mill-vibrate 0.1s infinite' : 'none' }}>
        {/* Massive Base / Gearbox */}
        <path d="M 20 70 L 80 70 L 85 95 L 15 95 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        <rect x="40" y="90" width="20" height="10" fill="#020617" />
        
        {/* Rotating Grinding Table */}
        {/* Simulated 3D perspective by compressing Y */}
        <g transform="translate(50, 70)">
          <ellipse cx="0" cy="0" rx="35" ry="12" fill={`url(#${uid}-metal-horiz)`} filter={`url(#${uid}-shadow)`} />
          {/* Table surface */}
          <ellipse cx="0" cy="-2" rx="33" ry="10" fill="#cbd5e1" />
          
          {/* Animated Table Texture (Spinning) */}
          <g style={{ animation: isStopped ? 'none' : `spin-table ${animationDuration} linear infinite` }}>
             <ellipse cx="0" cy="-2" rx="20" ry="6" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 20" />
             <ellipse cx="0" cy="-2" rx="10" ry="3" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 10" />
          </g>
        </g>

        {/* Central Shaft */}
        <rect x="45" y="20" width="10" height="40" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />

        {/* Left Grinding Roller */}
        <g transform="translate(25, 55)">
          {/* Roller Arm */}
          <path d="M 20 -35 L 0 0 L 10 0 L 25 -30 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
          {/* Spinning Roller Cone */}
          <g style={{ animation: isStopped ? 'none' : `spin-roller-l ${animationDuration} linear infinite` }}>
            <ellipse cx="0" cy="0" rx="14" ry="18" fill={`url(#${uid}-metal-horiz)`} transform="rotate(30)" filter={`url(#${uid}-shadow)`} />
            {/* Center Pin */}
            <circle cx="2" cy="-2" r="4" fill="#0f172a" />
          </g>
        </g>

        {/* Right Grinding Roller */}
        <g transform="translate(75, 55)">
          {/* Roller Arm */}
          <path d="M -20 -35 L 0 0 L -10 0 L -25 -30 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
          {/* Spinning Roller Cone */}
          <g style={{ animation: isStopped ? 'none' : `spin-roller-r ${animationDuration} linear infinite` }}>
            <ellipse cx="0" cy="0" rx="14" ry="18" fill={`url(#${uid}-metal-horiz)`} transform="rotate(-30)" filter={`url(#${uid}-shadow)`} />
            {/* Center Pin */}
            <circle cx="-2" cy="-2" r="4" fill="#0f172a" />
          </g>
        </g>
      </g>
      
      <g transform="translate(10, 15)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  const renderCrusher = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes rock-fall { 0% { transform: translateY(-10px); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(50px); opacity: 0; } }
        @keyframes crusher-vibrate { 0% { transform: translate(0,0); } 50% { transform: translate(1px, 2px); } 100% { transform: translate(0,0); } }
      `}</style>
      
      <circle cx="50" cy="50" r="40" fill={`url(#${uid}-glow)`} className="opacity-40" />

      <g style={{ animation: (isCritical && !isStopped) ? 'crusher-vibrate 0.1s infinite' : 'none' }}>
        {/* Main Casing Body */}
        <path d="M 15 30 L 85 30 L 75 90 L 25 90 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Internal Dark Cavity */}
        <path d="M 22 35 L 78 35 L 70 85 L 30 85 Z" fill="#020617" />
        
        {/* Falling Rocks FX */}
        {!isStopped && (
          <g>
            <path d="M 45 40 Q 48 38 50 42 Q 47 45 45 40" fill="#94a3b8" style={{ animation: 'rock-fall 0.8s infinite' }} />
            <path d="M 55 35 Q 58 32 60 37 Q 54 39 55 35" fill="#64748b" style={{ animation: 'rock-fall 0.6s infinite 0.2s' }} />
            <path d="M 40 45 Q 43 41 47 44 Q 42 48 40 45" fill="#cbd5e1" style={{ animation: 'rock-fall 0.9s infinite 0.4s' }} />
          </g>
        )}

        {/* Left Crusher Rotor */}
        <g style={{ transformOrigin: '35px 60px', animation: isStopped ? 'none' : `spin-cw ${animationDuration} linear infinite` }}>
          <circle cx="35" cy="60" r="16" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
          {/* Heavy Teeth */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <path key={i} d="M 35 44 L 30 35 L 40 35 Z" fill={`url(#${uid}-metal-dark)`} transform={`rotate(${angle} 35 60)`} />
          ))}
          <circle cx="35" cy="60" r="5" fill="#0f172a" />
        </g>

        {/* Right Crusher Rotor */}
        <g style={{ transformOrigin: '65px 60px', animation: isStopped ? 'none' : `spin-ccw ${animationDuration} linear infinite` }}>
          <circle cx="65" cy="60" r="16" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
          {/* Heavy Teeth */}
          {[30, 90, 150, 210, 270, 330].map((angle, i) => (
            <path key={i} d="M 65 44 L 60 35 L 70 35 Z" fill={`url(#${uid}-metal-dark)`} transform={`rotate(${angle} 65 60)`} />
          ))}
          <circle cx="65" cy="60" r="5" fill="#0f172a" />
        </g>
        
        {/* Front Top Hopper Shield */}
        <path d="M 10 20 L 90 20 L 85 30 L 15 30 Z" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
      </g>
      
      <g transform="translate(10, 10)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  const renderBallMill = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes rotate-ballmill { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 20; } }
        @keyframes ballmill-vibrate { 0% { transform: translate(0,0); } 50% { transform: translate(0px, 1.5px); } 100% { transform: translate(0,0); } }
      `}</style>
      
      <circle cx="50" cy="50" r="40" fill={`url(#${uid}-glow)`} className="opacity-40" />

      <g style={{ animation: (isCritical && !isStopped) ? 'ballmill-vibrate 0.1s infinite' : 'none' }}>
        {/* Foundation Bases */}
        <path d="M 15 70 L 25 70 L 25 95 L 15 95 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        <path d="M 75 70 L 85 70 L 85 95 L 75 95 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />

        {/* Trunnion Bearings */}
        <rect x="18" y="55" width="4" height="20" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        <rect x="78" y="55" width="4" height="20" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />

        {/* Main Mill Body (Horizontal Cylinder) */}
        <rect x="22" y="35" width="56" height="40" rx="3" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Bull Gear (Drive) */}
        <rect x="68" y="30" width="8" height="50" rx="2" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Drive Motor and Pinion Box */}
        <rect x="70" y="75" width="25" height="15" rx="1" fill={`url(#${uid}-metal-horiz)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Rotation Texture Lines */}
        <g style={{ animation: isStopped ? 'none' : `rotate-ballmill ${animationDuration} linear infinite` }}>
          <path d="M 24 45 L 66 45 M 24 65 L 66 65" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 8" strokeOpacity="0.4" />
        </g>
      </g>
      
      <g transform="translate(10, 10)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  const renderPacker = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes spin-packer { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes bag-drop { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(15px, 20px); opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(25px, 20px); opacity: 0; } }
        @keyframes packer-vibrate { 0% { transform: translate(0,0); } 50% { transform: translate(1px, -1px); } 100% { transform: translate(0,0); } }
      `}</style>

      <circle cx="50" cy="50" r="40" fill={`url(#${uid}-glow)`} className="opacity-40" />

      <g style={{ animation: (isCritical && !isStopped) ? 'packer-vibrate 0.1s infinite' : 'none' }}>
        {/* Main Base and Conveyor */}
        <rect x="20" y="80" width="60" height="15" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        <rect x="25" y="75" width="50" height="5" fill="#1e293b" />
        
        {/* Central Silo / Feed Tube */}
        <rect x="40" y="10" width="20" height="30" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />

        {/* Rotary Carousel Frame */}
        <g transform="translate(50, 55)">
          {/* Top Plate */}
          <ellipse cx="0" cy="-20" rx="30" ry="8" fill={`url(#${uid}-metal-horiz)`} filter={`url(#${uid}-shadow)`} />
          {/* Bottom Plate */}
          <ellipse cx="0" cy="15" rx="30" ry="8" fill={`url(#${uid}-metal-horiz)`} filter={`url(#${uid}-shadow)`} />
          {/* Central Housing */}
          <rect x="-20" y="-20" width="40" height="35" fill={`url(#${uid}-metal)`} />
          
          {/* Spinning Spouts and Bags on Carousel */}
          <g style={{ animation: isStopped ? 'none' : `spin-packer ${animationDuration} linear infinite` }}>
            {/* Spouts */}
            <rect x="-25" y="-10" width="6" height="15" fill={`url(#${uid}-metal-dark)`} />
            <rect x="-10" y="-5" width="6" height="15" fill={`url(#${uid}-metal-dark)`} />
            <rect x="5" y="-5" width="6" height="15" fill={`url(#${uid}-metal-dark)`} />
            <rect x="20" y="-10" width="6" height="15" fill={`url(#${uid}-metal-dark)`} />
            
            {/* Bags on Spouts */}
            <rect x="-27" y="5" width="10" height="12" rx="1" fill="#e2e8f0" />
            <rect x="-12" y="10" width="10" height="12" rx="1" fill="#e2e8f0" />
            <rect x="3" y="10" width="10" height="12" rx="1" fill="#e2e8f0" />
            <rect x="18" y="5" width="10" height="12" rx="1" fill="#e2e8f0" />
          </g>
        </g>

        {/* Dropping Bags FX onto Conveyor */}
        {!isStopped && (
          <g>
            <rect x="65" y="65" width="12" height="8" rx="1" fill="#e2e8f0" style={{ animation: 'bag-drop 1.5s infinite' }} filter={`url(#${uid}-shadow)`} />
            <rect x="65" y="65" width="12" height="8" rx="1" fill="#cbd5e1" style={{ animation: 'bag-drop 1.5s infinite 0.75s' }} filter={`url(#${uid}-shadow)`} />
          </g>
        )}
      </g>
      
      <g transform="translate(10, 10)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  const renderCooler = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-2xl", className)}>
      {defs}
      <style>{`
        @keyframes spin-fan { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cooler-vibrate { 0% { transform: translate(0,0); } 50% { transform: translate(0, 1px); } 100% { transform: translate(0,0); } }
        @keyframes clinker-move { 0% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
      `}</style>
      
      {/* Background Ambient Glow */}
      <circle cx="50" cy="50" r="40" fill={`url(#${uid}-glow)`} className="opacity-40" />

      <g style={{ animation: (isCritical && !isStopped) ? 'cooler-vibrate 0.1s infinite' : 'none' }}>
        
        {/* Under-Grate Cooling Fans */}
        <g transform="translate(25, 80)">
           <rect x="-5" y="0" width="10" height="15" fill={`url(#${uid}-metal-dark)`} />
           <g style={{ animation: isStopped ? 'none' : `spin-fan ${animationDuration} linear infinite`, transformOrigin: '0px 10px' }}>
             <circle cx="0" cy="10" r="6" fill={`url(#${uid}-metal)`} />
             <path d="M 0 4 L 3 10 L -3 10 Z" fill="#0f172a" />
             <path d="M 0 16 L 3 10 L -3 10 Z" fill="#0f172a" />
           </g>
        </g>
        <g transform="translate(50, 82)">
           <rect x="-5" y="0" width="10" height="15" fill={`url(#${uid}-metal-dark)`} />
           <g style={{ animation: isStopped ? 'none' : `spin-fan ${animationDuration} linear infinite`, transformOrigin: '0px 10px' }}>
             <circle cx="0" cy="10" r="6" fill={`url(#${uid}-metal)`} />
             <path d="M 0 4 L 3 10 L -3 10 Z" fill="#0f172a" />
             <path d="M 0 16 L 3 10 L -3 10 Z" fill="#0f172a" />
           </g>
        </g>
        <g transform="translate(75, 84)">
           <rect x="-5" y="0" width="10" height="15" fill={`url(#${uid}-metal-dark)`} />
           <g style={{ animation: isStopped ? 'none' : `spin-fan ${animationDuration} linear infinite`, transformOrigin: '0px 10px' }}>
             <circle cx="0" cy="10" r="6" fill={`url(#${uid}-metal)`} />
             <path d="M 0 4 L 3 10 L -3 10 Z" fill="#0f172a" />
             <path d="M 0 16 L 3 10 L -3 10 Z" fill="#0f172a" />
           </g>
        </g>

        {/* Main Casing Body */}
        {/* Sloped top, flat bottom */}
        <path d="M 10 40 L 90 55 L 90 85 L 10 80 Z" fill={`url(#${uid}-metal-dark)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Side Access Doors */}
        <rect x="20" y="55" width="15" height="15" fill={`url(#${uid}-metal)`} rx="1" />
        <rect x="45" y="58" width="15" height="15" fill={`url(#${uid}-metal)`} rx="1" />
        <rect x="70" y="61" width="15" height="15" fill={`url(#${uid}-metal)`} rx="1" />
        
        {/* Exhaust Stack */}
        <path d="M 20 40 L 35 43 L 30 15 L 25 15 Z" fill={`url(#${uid}-metal-horiz)`} filter={`url(#${uid}-shadow)`} />

        {/* Hot Clinker Inlet (Left) */}
        <rect x="5" y="30" width="15" height="25" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
        
        {/* Moving Clinker Bed (Visible through an open cutaway window) */}
        <path d="M 15 48 L 85 62 L 85 70 L 15 56 Z" fill="#020617" />
        
        {/* Clinker gradient (Red -> Gray) */}
        <defs>
          <linearGradient id={`${uid}-clinker-bed`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="20%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        
        <path d="M 15 52 L 85 66 M 15 56 L 85 70" stroke={`url(#${uid}-clinker-bed)`} strokeWidth="3" strokeDasharray="5 5" style={{ animation: isStopped ? 'none' : `clinker-move ${animationDuration} linear infinite` }} />

        {/* Cooled Clinker Outlet (Right) */}
        <rect x="80" y="65" width="15" height="25" fill={`url(#${uid}-metal)`} filter={`url(#${uid}-shadow)`} />
      </g>
      
      <g transform="translate(10, 10)">
        <rect x="0" y="0" width="8" height="8" rx="4" fill={statusColor} filter={`url(#${uid}-shadow)`} />
        <text x="14" y="7" fontSize="8" fill="#64748b" fontWeight="bold" className="font-mono">RPM: {machine.rpm?.toFixed(1)}</text>
      </g>
    </svg>
  );

  if (machine.id.includes('crusher')) return renderCrusher();
  if (machine.id.includes('kiln')) return renderKiln();
  if (machine.id.includes('cooler')) return renderCooler();
  if (machine.id.includes('packing')) return renderPacker();
  if (machine.id.includes('cementmill')) return renderBallMill();
  return renderMill();
}, (prev, next) => {
  return prev.machine.risk === next.machine.risk &&
         prev.machine.utilization === next.machine.utilization &&
         prev.machine.availability === next.machine.availability &&
         prev.machine.rpm === next.machine.rpm &&
         prev.machine.temperatureC === next.machine.temperatureC;
});
