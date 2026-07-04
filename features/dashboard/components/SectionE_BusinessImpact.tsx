import { ArrowRight, Activity, Clock, TrendingDown, DollarSign, CloudRain, ShieldCheck } from "lucide-react";
import { BusinessImpact } from "@/lib/engineering/types";

export function SectionE_BusinessImpact({ impact }: { impact: BusinessImpact }) {
  const formatCur = (val: number) => `NGN ${(val / 1000000).toFixed(1)}M`;

  const steps = [
    { label: 'Failure', value: 'Trigger', icon: Activity, color: 'text-destructive' },
    { label: 'Downtime', value: `${impact.downtimeHours} Hrs`, icon: Clock, color: 'text-yellow-500' },
    { label: 'Production Loss', value: formatCur(impact.productionLossValue), icon: TrendingDown, color: 'text-orange-500' },
    { label: 'Repair Cost', value: formatCur(impact.repairCost), icon: DollarSign, color: 'text-red-500' },
    { label: 'CO₂ Impact', value: `${impact.co2ImpactTons} Tons`, icon: CloudRain, color: 'text-gray-400' },
    { label: 'Total Exposure', value: formatCur(impact.totalRiskExposure), icon: ShieldCheck, color: 'text-primary' },
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-xl overflow-x-auto">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
        Business Impact Flow
      </h3>
      
      <div className="flex items-center min-w-max space-x-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-background border border-border rounded-lg min-w-[140px] text-center">
              <step.icon className={`h-6 w-6 mb-2 ${step.color}`} />
              <span className="text-xl font-bold text-foreground">{step.value}</span>
              <span className="text-xs text-muted-foreground uppercase mt-1">{step.label}</span>
            </div>
            
            {i < steps.length - 1 && (
              <div className="mx-4 text-muted-foreground animate-pulse">
                <ArrowRight className="h-6 w-6" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
