import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trendDir: 'up' | 'down' | 'neutral';
  trendValue: string;
  trendText: string;
  isGood: boolean;
  highlighted?: boolean;
}

function KPICard({ title, value, trendDir, trendValue, trendText, isGood, highlighted }: KPICardProps) {
  return (
    <div className={cn(
      "flex flex-col p-6 bg-card rounded-xl border transition-all duration-300",
      highlighted ? "border-primary shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-border"
    )}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      
      <div className="mt-4 flex items-center space-x-2 text-sm">
        <span className={cn(
          "flex items-center font-medium",
          isGood ? "text-success" : "text-destructive"
        )}>
          {trendDir === 'up' && <ArrowUpRight className="h-4 w-4 mr-1" />}
          {trendDir === 'down' && <ArrowDownRight className="h-4 w-4 mr-1" />}
          {trendDir === 'neutral' && <Minus className="h-4 w-4 mr-1" />}
          {trendValue}
        </span>
        <span className="text-muted-foreground">{trendText}</span>
      </div>
    </div>
  );
}

export function SectionA_KPIs({ kpiData, presentationMode }: { kpiData: any, presentationMode: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard 
        title="Historical Fleet Health" 
        value={`${kpiData.health}%`} 
        trendDir={kpiData.healthTrend > 0 ? 'up' : 'down'} 
        trendValue={`${Math.abs(kpiData.healthTrend)}%`} 
        trendText={kpiData.healthTrend > 0 ? 'Improving' : 'Degrading'} 
        isGood={kpiData.healthTrend >= 0}
        highlighted={presentationMode}
      />
      <KPICard 
        title="OEE (A×P×Q)"
        value={`${kpiData.oee}%`} 
        trendDir="neutral"
        trendValue="0%" 
        trendText="Stable" 
        isGood={true}
      />
      <KPICard 
        title="Active Alerts" 
        value={kpiData.alerts.toString()} 
        trendDir="up" 
        trendValue="+2" 
        trendText="Since yesterday" 
        isGood={kpiData.alerts === 0}
        highlighted={presentationMode && kpiData.alerts > 0}
      />
      <KPICard 
        title="Risk Exposure" 
        value={`₦${(kpiData.risk / 1_000_000).toFixed(1)}M`} 
        trendDir={kpiData.riskTrend > 0 ? 'up' : 'down'} 
        trendValue={`₦${Math.abs(kpiData.riskTrend).toFixed(1)}M`} 
        trendText="Change" 
        isGood={kpiData.riskTrend <= 0}
        highlighted={presentationMode && kpiData.risk > 10}
      />
      <KPICard 
        title="Production Availability" 
        value={`${kpiData.availability}%`} 
        trendDir="down" 
        trendValue="1.2%" 
        trendText="Decrease" 
        isGood={false}
      />
      <KPICard 
        title="Maint. Cost Avoided" 
        value={`₦${kpiData.savings.toFixed(1)}M`} 
        trendDir="up" 
        trendValue="15%" 
        trendText="Improving" 
        isGood={true}
      />
    </div>
  );
}
