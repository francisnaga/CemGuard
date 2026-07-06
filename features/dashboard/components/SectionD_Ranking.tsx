import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Activity } from "lucide-react";

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
  // Sort by expected risk (probability * exposure) descending
  const sorted = [...rankings].sort((a, b) => b.expectedRisk - a.expectedRisk);

  return (
    <div className="flex flex-col space-y-4 bg-card border border-border p-6 rounded-md h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        High Risk Priority (Top 3)
      </h3>
      
      {sorted.filter(item => item.riskTier !== 'Low').length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center border border-dashed border-border rounded-sm bg-muted/5">
          <Activity className="w-8 h-8 mb-3 opacity-20" />
          <p className="text-sm font-medium text-foreground">All systems normal</p>
          <p className="text-xs opacity-80 mt-1">No high-risk equipment detected.</p>
        </div>
      ) : (
        sorted.filter(item => item.riskTier !== 'Low').slice(0,3).map((item, index) => (
          <div 
            key={item.id} 
            className={cn(
              "relative flex items-center p-4 border border-border border-l-4 rounded-sm bg-card transition-colors hover:bg-muted/10",
              (item.riskTier === 'Critical' || item.riskTier === 'High') ? "border-l-destructive" : "border-l-warning"
            )}
          >
            {/* F1 Style Position Marker */}
            <div className="w-8 flex items-center justify-center font-mono font-bold text-lg text-muted-foreground">
              #{index + 1}
            </div>
            
            <div className="ml-4 flex-1 flex justify-between items-center">
              <div>
                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                <div className="flex items-center text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {item.failureMode}
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <p className={cn("text-lg font-mono font-bold tracking-tight", (item.riskTier === 'Critical' || item.riskTier === 'High') ? "text-destructive" : "text-foreground")}>
                  {formatNaira(item.exposureAmount)}
                </p>
                <button 
                  onClick={() => openDigitalTwin(item.id)}
                  className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                >
                  <Activity className="w-3 h-3" /> Inspect Twin
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
