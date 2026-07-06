import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Activity, ShieldOff } from "lucide-react";

interface RankedEquipment {
  id: string;
  name: string;
  health: number;
  expectedRisk: number;
  exposureAmount: number;
  failureMode: string;
  riskTier: string;
}

export function SectionD_Ranking({ rankings }: { rankings: RankedEquipment[] }) {
  const openDigitalTwin = useStore(state => state.openDigitalTwin);
  const sorted = [...rankings].sort((a, b) => b.expectedRisk - a.expectedRisk);

  const getBorderClass = (tier: string) => {
    switch (tier) {
      case 'Critical': return 'border-l-red-500';
      case 'High':     return 'border-l-orange-500';
      case 'Medium':   return 'border-l-amber-400';
      default:         return 'border-l-emerald-500';
    }
  };

  const getExposureColor = (tier: string) => {
    switch (tier) {
      case 'Critical': return 'text-red-400';
      case 'High':     return 'text-orange-400';
      case 'Medium':   return 'text-amber-400';
      default:         return 'text-emerald-400';
    }
  };

  const getRankBadgeClass = (index: number) => {
    if (index === 0) return 'text-red-400 bg-red-500/10 border border-red-500/20';
    if (index === 1) return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
    return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
  };

  return (
    <div className="flex flex-col space-y-3 bg-card border border-border p-5 rounded-xl h-full shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        High Risk Priority (Top 3)
      </h3>

      {sorted.filter(item => item.riskTier !== 'Low').length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center border border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5">
          <ShieldOff className="w-8 h-8 mb-3 text-emerald-500 opacity-50" />
          <p className="text-sm font-bold text-emerald-400">All Systems Normal</p>
          <p className="text-xs text-muted-foreground mt-1">No high-risk equipment detected.</p>
        </div>
      ) : (
        sorted.filter(item => item.riskTier !== 'Low').slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "relative flex items-center p-4 border border-border border-l-4 rounded-xl bg-card transition-all duration-200 hover:bg-muted/10 hover:shadow-md cursor-pointer",
              getBorderClass(item.riskTier)
            )}
          >
            {/* Rank badge */}
            <div className={cn(
              "w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded-lg shrink-0",
              getRankBadgeClass(index)
            )}>
              #{index + 1}
            </div>

            <div className="ml-3 flex-1 flex justify-between items-center min-w-0">
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{item.name}</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5 truncate">
                  {item.failureMode}
                </p>
              </div>

              <div className="text-right ml-2 shrink-0">
                <p className={cn("text-base font-mono font-bold tabular-nums", getExposureColor(item.riskTier))}>
                  {formatNaira(item.exposureAmount)}
                </p>
                <button
                  onClick={() => openDigitalTwin(item.id)}
                  className="mt-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  <Activity className="w-3 h-3" /> Diagnostics
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
