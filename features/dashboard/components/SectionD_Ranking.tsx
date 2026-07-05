import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

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
  // Sort by expected risk (probability * exposure) descending
  const sorted = [...rankings].sort((a, b) => b.expectedRisk - a.expectedRisk);

  return (
    <div className="flex flex-col space-y-4 bg-card border border-border p-6 rounded-md h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        High Risk Priority (Top 3)
      </h3>
      
      {sorted.slice(0,3).map((item, index) => (
        <div 
          key={item.id} 
          className={cn(
            "relative flex items-center p-4 border border-border border-l-4 rounded-sm bg-card",
            (item.riskTier === 'Critical' || item.riskTier === 'High') ? "border-l-destructive" : "border-l-muted"
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
            
            <div className="text-right">
              <p className={cn("text-lg font-mono font-bold tracking-tight", (item.riskTier === 'Critical' || item.riskTier === 'High') ? "text-destructive" : "text-foreground")}>
                {formatNaira(item.exposureAmount)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Exposure</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
