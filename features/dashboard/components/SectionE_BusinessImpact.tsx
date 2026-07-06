import { ArrowRight, Activity, Clock, TrendingDown, DollarSign, CloudRain, ShieldCheck } from "lucide-react";
import { BusinessImpact } from "@/lib/engineering/types";
import { formatNaira } from "@/lib/utils";

export function SectionE_BusinessImpact({ impact, strategy = 'Preventive', prob = 0 }: { impact: BusinessImpact, strategy?: string, prob?: number }) {
  const formatCur = (val: number) => formatNaira(val);

  const steps = [
    { label: 'Projected Action', value: strategy, icon: Activity, color: strategy === 'Preventive' ? 'text-success' : 'text-destructive' },
    { label: 'Downtime', value: `${impact.downtimeHours} Hrs`, icon: Clock, color: 'text-yellow-500' },
    { label: 'Production Loss', value: formatCur(impact.productionLossValue), icon: TrendingDown, color: 'text-orange-500' },
    { label: 'Repair Cost', value: formatCur(impact.repairCost), icon: DollarSign, color: 'text-red-500' },
    { label: 'CO₂ Impact', value: `${impact.co2ImpactTons} Tons`, icon: CloudRain, color: 'text-gray-400' },
    { label: 'Total Exposure', value: formatCur(impact.totalRiskExposure), icon: ShieldCheck, color: 'text-primary' },
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-md overflow-x-auto">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
        Business Impact Flow
      </h3>
      
      <div className="flex items-center min-w-max space-x-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-sm min-w-[140px] text-center">
              <span className="text-lg font-mono font-bold text-foreground mb-1">{step.value}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{step.label}</span>
            </div>
            
            {i < steps.length - 1 && (
              <div className="mx-4 text-border">
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
