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

  const borderColor = severity === 'Critical' ? 'border-l-destructive' : severity === 'Warning' ? 'border-l-warning' : 'border-l-success';
  const Icon = severity === 'Critical' ? AlertTriangle : severity === 'Warning' ? AlertTriangle : Info;
  const iconColor = severity === 'Critical' ? 'text-destructive' : severity === 'Warning' ? 'text-warning' : 'text-success';
  
  return (
    <div className={cn(
      "w-full rounded-md border border-border border-l-4 bg-card p-6 shadow-sm",
      borderColor,
      presentationMode ? "my-8" : "my-6"
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <Icon className={cn("h-5 w-5", iconColor)} />
        <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">Executive Insight</h2>
      </div>

      <div className={cn(
        "grid gap-8",
        presentationMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
      )}>
        
        {/* Primary Insight */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Situation
          </h3>
          <p className={cn(
            "font-medium text-foreground",
            presentationMode ? "text-xl" : "text-base"
          )}>
            {primaryInsight}
          </p>
        </div>

        {/* Observation */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Observation
          </h3>
          <p className="text-foreground/90 text-sm">
            {observation}
          </p>
        </div>

        {/* Recommended Action */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recommendation
          </h3>
          <p className="text-foreground/90 font-medium text-sm text-primary">
            {recommendedAction}
          </p>
        </div>

        {/* Business Impact */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Expected Impact
          </h3>
          <p className="text-foreground/90 font-medium text-sm">
            {expectedImpact}
          </p>
        </div>

      </div>
    </div>
  );
}
