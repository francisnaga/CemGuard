import { ArrowRight, Activity, Clock, TrendingDown, DollarSign, CloudRain, ShieldCheck } from "lucide-react";
import { BusinessImpact } from "@/lib/engineering/types";
import { formatNaira } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SectionE_BusinessImpact({ impact, strategy = 'Preventive', prob = 0 }: { impact: BusinessImpact, strategy?: string, prob?: number }) {
  const formatCur = (val: number) => formatNaira(val);

  const steps = [
    {
      label: 'Projected Action',
      value: strategy,
      icon: Activity,
      valueColor: strategy === 'Preventive' ? 'text-emerald-400' : 'text-red-400',
      borderColor: strategy === 'Preventive' ? 'border-emerald-500/30' : 'border-red-500/30',
      bgColor: strategy === 'Preventive' ? 'bg-emerald-500/5' : 'bg-red-500/5',
    },
    {
      label: 'Downtime',
      value: `${impact.downtimeHours} Hrs`,
      icon: Clock,
      valueColor: impact.downtimeHours > 24 ? 'text-red-400' : impact.downtimeHours > 8 ? 'text-amber-400' : 'text-foreground',
      borderColor: 'border-border',
      bgColor: '',
    },
    {
      label: 'Production Loss',
      value: formatCur(impact.productionLossValue),
      icon: TrendingDown,
      valueColor: 'text-orange-400',
      borderColor: 'border-border',
      bgColor: '',
    },
    {
      label: 'Repair Cost',
      value: formatCur(impact.repairCost),
      icon: DollarSign,
      valueColor: 'text-red-400',
      borderColor: 'border-border',
      bgColor: '',
    },
    {
      label: 'CO₂ Impact',
      value: `${impact.co2ImpactTons} Tons`,
      icon: CloudRain,
      valueColor: 'text-slate-400',
      borderColor: 'border-border',
      bgColor: '',
    },
    {
      label: 'Total Exposure',
      value: formatCur(impact.totalRiskExposure),
      icon: ShieldCheck,
      valueColor: 'text-primary',
      borderColor: 'border-primary/30',
      bgColor: 'bg-primary/5',
    },
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm overflow-x-auto">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
        Business Impact Flow
      </h3>

      <div className="flex items-center min-w-max space-x-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className={cn(
              "flex flex-col items-center justify-center p-4 border rounded-xl min-w-[148px] text-center transition-colors duration-300",
              step.borderColor,
              step.bgColor || "bg-card"
            )}>
              <step.icon className={cn("h-4 w-4 mb-2 opacity-60", step.valueColor)} />
              <span className={cn("text-base font-mono font-bold tabular-nums mb-1", step.valueColor)}>
                {step.value}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="mx-3 text-border">
                <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
