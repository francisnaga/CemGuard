import { AlertTriangle, Info, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightProps {
  primaryInsight: string;
  observation: string;
  recommendedAction: string;
  expectedImpact: string;
  presentationMode: boolean;
  severity: 'Healthy' | 'Warning' | 'Critical';
}

export function SectionB_Insight({ 
  primaryInsight, 
  observation, 
  recommendedAction, 
  expectedImpact, 
  presentationMode,
  severity
}: InsightProps) {

  const borderColor = severity === 'Critical' ? 'border-destructive' : severity === 'Warning' ? 'border-yellow-500/50' : 'border-success';
  const bgColor = severity === 'Critical' ? 'bg-destructive/5' : severity === 'Warning' ? 'bg-yellow-500/5' : 'bg-success/5';
  
  return (
    <div className={cn(
      "w-full rounded-2xl border bg-card p-8 shadow-sm transition-all duration-500",
      borderColor,
      bgColor,
      presentationMode ? "scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.05)] my-8" : "my-6"
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <AlertTriangle className={cn("h-6 w-6", severity === 'Critical' ? 'text-destructive' : 'text-primary')} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Executive Insight</h2>
      </div>

      <div className={cn(
        "grid gap-8",
        presentationMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
      )}>
        
        {/* Primary Insight */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
            <Info className="h-4 w-4 mr-2" /> Situation
          </h3>
          <p className={cn(
            "font-medium text-foreground",
            presentationMode ? "text-2xl" : "text-lg"
          )}>
            {primaryInsight}
          </p>
        </div>

        {/* Observation */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Observation
          </h3>
          <p className="text-foreground/80">
            {observation}
          </p>
        </div>

        {/* Recommended Action */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Recommendation
          </h3>
          <p className="text-foreground/80 font-medium text-primary">
            {recommendedAction}
          </p>
        </div>

        {/* Business Impact */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
            <DollarSign className="h-4 w-4 mr-2" /> Expected Impact
          </h3>
          <p className="text-foreground/80 font-medium">
            {expectedImpact}
          </p>
        </div>

      </div>
    </div>
  );
}
