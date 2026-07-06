/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import { MetricExplainer } from "@/components/MetricExplainer";

interface KPICardProps {
  title: string;
  value: string;
  trendDir: 'up' | 'down' | 'neutral';
  trendValue: string;
  trendText: string;
  isGood: boolean;
  highlighted?: boolean;
  explainerBasis: string;
  explainerFormula?: string;
}

function KPICard({ title, value, trendDir, trendValue, trendText, isGood, highlighted, explainerBasis, explainerFormula }: KPICardProps) {
  return (
    <div className={cn(
      "flex flex-col p-5 bg-card rounded-xl border shadow-sm transition-shadow duration-300 hover:shadow-md",
      highlighted
        ? "border-primary shadow-[0_0_18px_rgba(var(--primary),0.15)]"
        : "border-border"
    )}>
      <MetricExplainer title={title} basis={explainerBasis} formula={explainerFormula}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      </MetricExplainer>
      <p className="mt-3 text-3xl font-mono font-bold tracking-tight tabular-nums text-foreground">{value}</p>

      <div className="mt-4 flex items-center space-x-2 text-xs">
        <span className={cn(
          "flex items-center font-mono font-semibold px-2 py-0.5 rounded border",
          isGood
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
            : "bg-red-500/10 text-red-400 border-red-500/25"
        )}>
          {trendDir === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
          {trendDir === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
          {trendDir === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
          {trendValue}
        </span>
        <span className="text-muted-foreground uppercase tracking-wide text-[10px]">{trendText}</span>
      </div>
    </div>
  );
}

export function SectionA_KPIs({ kpiData, presentationMode }: { kpiData: any, presentationMode: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        title="Historical Fleet Health"
        value={`${Number(kpiData.health).toFixed(1)}%`}
        trendDir={kpiData.healthTrend > 0 ? 'up' : 'down'}
        trendValue={`${Math.abs(kpiData.healthTrend).toFixed(1)}%`}
        trendText={kpiData.healthTrend > 0 ? 'Improving' : 'Degrading'}
        isGood={kpiData.healthTrend >= 0}
        highlighted={presentationMode}
        explainerBasis="Composite index aggregating vibration, temperature, and wear state across all machines."
        explainerFormula="Avg(Machine Health Index)"
      />
      <KPICard
        title="OEE (A×P×Q)"
        value={`${Number(kpiData.oee).toFixed(1)}%`}
        trendDir={kpiData.oeeTrend > 0 ? 'up' : kpiData.oeeTrend < 0 ? 'down' : 'neutral'}
        trendValue={`${Math.abs(kpiData.oeeTrend).toFixed(1)}%`}
        trendText={kpiData.oeeTrend > 0 ? 'Improving' : kpiData.oeeTrend < 0 ? 'Decreasing' : 'Stable'}
        isGood={kpiData.oeeTrend >= 0}
        explainerBasis="Overall Equipment Effectiveness. Reflects true productive capacity."
        explainerFormula="Availability × Performance × Quality"
      />
      <KPICard
        title="Active Alerts"
        value={kpiData.alerts.toString()}
        trendDir={kpiData.alertsTrend > 0 ? 'up' : kpiData.alertsTrend < 0 ? 'down' : 'neutral'}
        trendValue={kpiData.alertsTrend !== 0 ? `${kpiData.alertsTrend > 0 ? '+' : ''}${kpiData.alertsTrend}` : '0'}
        trendText="Since yesterday"
        isGood={kpiData.alertsTrend <= 0}
        highlighted={presentationMode && kpiData.alerts > 0}
        explainerBasis="Current count of unresolved predictive warnings and critical alerts."
      />
      <KPICard
        title="Risk Exposure"
        value={formatNaira(kpiData.risk)}
        trendDir={kpiData.riskTrend > 0 ? 'up' : kpiData.riskTrend < 0 ? 'down' : 'neutral'}
        trendValue={formatNaira(Math.abs(kpiData.riskTrend))}
        trendText="Change"
        isGood={kpiData.riskTrend <= 0}
        highlighted={presentationMode && kpiData.risk > 10_000_000}
        explainerBasis="Total financial exposure due to potential impending equipment failures."
        explainerFormula="P(failure) × (Repair Cost + Logistics + Production Loss)"
      />
      <KPICard
        title="Production Availability"
        value={`${Number(kpiData.availability).toFixed(1)}%`}
        trendDir={kpiData.availabilityTrend > 0 ? 'up' : kpiData.availabilityTrend < 0 ? 'down' : 'neutral'}
        trendValue={`${Math.abs(kpiData.availabilityTrend).toFixed(1)}%`}
        trendText={kpiData.availabilityTrend > 0 ? 'Increase' : kpiData.availabilityTrend < 0 ? 'Decrease' : 'Stable'}
        isGood={kpiData.availabilityTrend >= 0}
        explainerBasis="Percentage of time the plant is ready for normal production."
        explainerFormula="(Operating Time / Planned Production Time) × 100"
      />
      <KPICard
        title="Maint. Cost Avoided"
        value={formatNaira(kpiData.savings, true)}
        trendDir={kpiData.savingsTrend > 0 ? 'up' : kpiData.savingsTrend < 0 ? 'down' : 'neutral'}
        trendValue={`${Math.abs(kpiData.savingsTrend).toFixed(1)}%`}
        trendText={kpiData.savingsTrend > 0 ? 'Improving' : kpiData.savingsTrend < 0 ? 'Decreasing' : 'Stable'}
        isGood={kpiData.savingsTrend >= 0}
        explainerBasis="Estimated cost savings from proactive intervention vs catastrophic failure."
      />
    </div>
  );
}
