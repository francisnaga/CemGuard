import { cn } from "@/lib/utils";

export function AnimatedAssetSVG({ machine, className }: { machine: any; className?: string }) {
  const isCritical = machine.risk === 'Critical';
  const isWarning = machine.risk === 'High' || machine.risk === 'Medium';
  const isHealthy = !isCritical && !isWarning;
  const isStopped = machine.utilization === 0 || machine.availability === 0;

  // Animation duration based on RPM (clamped to sensible visual limits)
  // Higher RPM = faster animation = lower duration
  const baseRPM = Math.max(1, machine.rpm || 100);
  const animationDuration = isStopped ? '0s' : `${Math.max(0.5, Math.min(10, 6000 / baseRPM))}s`;

  // Color logic
  const primaryColor = isCritical ? 'text-destructive' : isWarning ? 'text-warning' : 'text-success';
  const strokeColor = 'currentColor';

  const renderCrusher = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)} fill="none" stroke={strokeColor} strokeWidth="2">
      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes vibrate-crusher { 0% { transform: translate(0,0); } 20% { transform: translate(-2px,2px); } 40% { transform: translate(2px,-2px); } 60% { transform: translate(-2px,-2px); } 80% { transform: translate(2px,2px); } 100% { transform: translate(0,0); } }
      `}</style>
      <g style={{ animation: isCritical ? 'vibrate-crusher 0.2s infinite' : 'none' }} className={primaryColor}>
        {/* Housing */}
        <path d="M 20 20 L 80 20 L 70 80 L 30 80 Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="80" width="20" height="10" />
        {/* Left Rotor */}
        <g style={{ transformOrigin: '40px 50px', animation: isStopped ? 'none' : `spin-cw ${animationDuration} linear infinite` }}>
          <circle cx="40" cy="50" r="12" />
          <path d="M 40 38 L 40 62 M 28 50 L 52 50" />
          <circle cx="40" cy="38" r="2" fill="currentColor" />
          <circle cx="40" cy="62" r="2" fill="currentColor" />
          <circle cx="28" cy="50" r="2" fill="currentColor" />
          <circle cx="52" cy="50" r="2" fill="currentColor" />
        </g>
        {/* Right Rotor */}
        <g style={{ transformOrigin: '60px 50px', animation: isStopped ? 'none' : `spin-ccw ${animationDuration} linear infinite` }}>
          <circle cx="60" cy="50" r="12" />
          <path d="M 60 38 L 60 62 M 48 50 L 72 50" />
          <circle cx="60" cy="38" r="2" fill="currentColor" />
          <circle cx="60" cy="62" r="2" fill="currentColor" />
          <circle cx="48" cy="50" r="2" fill="currentColor" />
          <circle cx="72" cy="50" r="2" fill="currentColor" />
        </g>
      </g>
    </svg>
  );

  const renderKiln = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)} fill="none" stroke={strokeColor} strokeWidth="2">
      <style>{`
        @keyframes rotate-kiln { 
          from { stroke-dashoffset: 0; } 
          to { stroke-dashoffset: 40; } 
        }
        @keyframes vibrate-kiln { 0% { transform: translate(0,0) rotate(-10deg); } 50% { transform: translate(0, 3px) rotate(-10deg); } 100% { transform: translate(0,0) rotate(-10deg); } }
      `}</style>
      <g style={{ transformOrigin: '50px 50px', transform: 'rotate(-10deg)', animation: isCritical ? 'vibrate-kiln 0.3s infinite' : 'none' }} className={primaryColor}>
        {/* Kiln Cylinder */}
        <rect x="10" y="35" width="80" height="30" rx="4" strokeWidth="3" />
        {/* Riding Rings (Support Rollers) */}
        <rect x="25" y="30" width="10" height="40" rx="2" fill="currentColor" fillOpacity="0.2" />
        <rect x="65" y="30" width="10" height="40" rx="2" fill="currentColor" fillOpacity="0.2" />
        
        {/* Spinning texture lines to simulate rotation */}
        <path d="M 15 45 L 85 45 M 15 55 L 85 55" strokeDasharray="10 10" style={{ animation: isStopped ? 'none' : `rotate-kiln ${animationDuration} linear infinite` }} />
        
        {/* Burner Flame (if not stopped) */}
        {!isStopped && (
          <path d="M 85 45 Q 95 50 85 55 Z" fill="#ef4444" stroke="none" style={{ animation: 'vibrate-kiln 0.1s infinite' }} />
        )}
      </g>
      {/* Support Piers */}
      <path d="M 25 75 L 35 75 L 35 90 L 25 90 Z" className="text-muted-foreground" />
      <path d="M 65 68 L 75 68 L 75 90 L 65 90 Z" className="text-muted-foreground" />
    </svg>
  );

  const renderMill = () => (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)} fill="none" stroke={strokeColor} strokeWidth="2">
      <style>{`
        @keyframes spin-mill { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vibrate-mill { 0% { transform: translate(0,0); } 25% { transform: translate(2px, 0); } 50% { transform: translate(0, 2px); } 75% { transform: translate(-2px, 0); } 100% { transform: translate(0,0); } }
      `}</style>
      <g style={{ animation: isCritical ? 'vibrate-mill 0.2s infinite' : 'none' }} className={primaryColor}>
        {/* Mill Body (Vertical Cylinder for Raw Mill) */}
        <path d="M 30 20 L 70 20 L 80 50 L 80 80 L 20 80 L 20 50 Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Rotating Table */}
        <ellipse cx="50" cy="70" rx="25" ry="8" strokeWidth="2" />
        {/* Grinding Rollers */}
        <g style={{ transformOrigin: '50px 50px', animation: isStopped ? 'none' : `spin-mill ${animationDuration} linear infinite` }}>
          <circle cx="35" cy="50" r="10" strokeWidth="2" />
          <circle cx="65" cy="50" r="10" strokeWidth="2" />
          <circle cx="50" cy="35" r="10" strokeWidth="2" />
          {/* Inner details for rollers */}
          <circle cx="35" cy="50" r="3" fill="currentColor" />
          <circle cx="65" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="35" r="3" fill="currentColor" />
        </g>
      </g>
    </svg>
  );

  if (machine.id.includes('crusher')) return renderCrusher();
  if (machine.id.includes('kiln') || machine.id.includes('cooler')) return renderKiln();
  return renderMill(); // Raw Mill, Cement Mill, Packing
}
