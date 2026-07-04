import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface RankedEquipment {
  id: string;
  name: string;
  health: number;
  riskValue: number;
  failureMode: string;
}

export function SectionD_Ranking({ rankings }: { rankings: RankedEquipment[] }) {
  // Sort by risk descending
  const sorted = [...rankings].sort((a, b) => b.riskValue - a.riskValue);

  return (
    <div className="flex flex-col space-y-4 bg-card border border-border p-6 rounded-xl h-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        High Risk Priority (Top 3)
      </h3>
      
      {sorted.slice(0,3).map((item, index) => (
        <div 
          key={item.id} 
          className={cn(
            "relative flex items-center p-4 rounded-lg border overflow-hidden",
            index === 0 ? "border-destructive bg-destructive/5" : "border-border bg-background/50"
          )}
        >
          {/* F1 Style Position Marker */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center font-bold text-lg",
            index === 0 ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
          )}>
            #{index + 1}
          </div>
          
          <div className="ml-10 flex-1 flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground">{item.name}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {index === 0 && <AlertCircle className="h-3 w-3 mr-1 text-destructive" />}
                {item.failureMode}
              </div>
            </div>
            
            <div className="text-right">
              <p className={cn("text-xl font-bold tracking-tight", index === 0 ? "text-destructive" : "text-foreground")}>
                ₦{(item.riskValue / 1_000_000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground">Exposure</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
