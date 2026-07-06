import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
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

  const borderColor =
    severity === 'Critical' ? 'border-l-red-500' :
    severity === 'Warning'  ? 'border-l-amber-400' :
    'border-l-emerald-500';

  const bgGlow =
    severity === 'Critical' ? 'bg-red-500/5' :
    severity === 'Warning'  ? 'bg-amber-400/5' :
    'bg-transparent';

  const Icon =
    severity === 'Critical' ? AlertTriangle :
    severity === 'Warning'  ? AlertTriangle :
    severity === 'Healthy'  ? CheckCircle2 :
    Info;

  const iconColor =
    severity === 'Critical' ? 'text-red-500' :
    severity === 'Warning'  ? 'text-amber-400' :
    'text-emerald-500';

  return (
    <div className={cn(
      "w-full rounded-xl border border-border border-l-4 p-6 shadow-sm",
      borderColor,
      bgGlow,
      presentationMode ? "my-8" : "my-6"
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
        <h2 className="text-xs font-bold tracking-widest text-foreground uppercase">Executive Insight</h2>
      </div>

      <div className={cn(
        "grid gap-6",
        presentationMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
      )}>

        {/* Situation */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Situation
          </h3>
          <p className={cn(
            "font-semibold text-foreground leading-snug",
            presentationMode ? "text-xl" : "text-base"
          )}>
            {primaryInsight}
          </p>
        </div>

        {/* Observation */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Observation
          </h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {observation}
          </p>
        </div>

        {/* Recommendation */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Recommendation
          </h3>
          <p className="text-primary font-semibold text-sm leading-relaxed">
            {recommendedAction}
          </p>
        </div>

        {/* Expected Impact */}
        <div className="space-y-2 border-l border-border pl-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Expected Impact
          </h3>
          <p className="text-foreground/80 font-medium text-sm leading-relaxed font-mono tabular-nums">
            {expectedImpact}
          </p>
        </div>

      </div>
    </div>
  );
}
