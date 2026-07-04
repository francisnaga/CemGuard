'use client';

import { Check, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TabScenarioAnalysis() {
  const scenarios = [
    {
      name: 'Scenario A',
      subtitle: 'Immediate Maintenance',
      delay: 0,
      risk: 15,
      downtime: 8,
      cost: 12.0,
      isCurrent: false,
      isRecommended: true
    },
    {
      name: 'Scenario B',
      subtitle: 'Current Baseline',
      delay: 7,
      risk: 32,
      downtime: 14,
      cost: 41.4,
      isCurrent: true,
      isRecommended: false
    },
    {
      name: 'Scenario C',
      subtitle: 'Run to Failure',
      delay: 14,
      risk: 65,
      downtime: 28,
      cost: 84.8,
      isCurrent: false,
      isRecommended: false
    }
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-xl animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Scenario Analysis</h2>
          <p className="text-sm text-muted-foreground">Compare strategic alternatives side-by-side.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow hover:bg-primary/90">
          Save Current as Scenario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">Metric</th>
              {scenarios.map(s => (
                <th key={s.name} className={cn(
                  "p-4 border-b border-border bg-muted/20 w-[25%]",
                  s.isCurrent ? "border-t-2 border-t-primary bg-primary/5" : ""
                )}>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground">{s.name}</span>
                      {s.isRecommended && <div className="flex items-center text-[10px] uppercase font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded"><Star className="h-3 w-3 mr-1 fill-yellow-500" /> Recommended</div>}
                    </div>
                    <span className="text-xs text-muted-foreground">{s.subtitle}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 text-sm font-semibold text-muted-foreground">Delay (Days)</td>
              {scenarios.map(s => (
                <td key={s.name} className={cn("p-4 text-sm font-bold", s.isCurrent ? "bg-primary/5" : "")}>{s.delay} Days</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-sm font-semibold text-muted-foreground">Failure Risk</td>
              {scenarios.map(s => (
                <td key={s.name} className={cn("p-4 text-sm font-bold", s.isCurrent ? "bg-primary/5" : "")}>
                  <div className="flex items-center space-x-2">
                    <span className={s.risk > 50 ? "text-destructive" : s.risk > 30 ? "text-orange-500" : "text-success"}>{s.risk}%</span>
                    {s.isCurrent ? null : <span className="text-xs text-muted-foreground">({s.risk > scenarios[1].risk ? '+' : ''}{s.risk - scenarios[1].risk}%)</span>}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-sm font-semibold text-muted-foreground">Downtime</td>
              {scenarios.map(s => (
                <td key={s.name} className={cn("p-4 text-sm font-bold", s.isCurrent ? "bg-primary/5" : "")}>
                  <div className="flex items-center space-x-2">
                    <span className={s.downtime > 20 ? "text-destructive" : s.downtime > 10 ? "text-orange-500" : "text-success"}>{s.downtime} Hrs</span>
                    {s.isCurrent ? null : <span className="text-xs text-muted-foreground">({s.downtime > scenarios[1].downtime ? '+' : ''}{s.downtime - scenarios[1].downtime} Hrs)</span>}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-sm font-semibold text-muted-foreground">Exposure Cost</td>
              {scenarios.map(s => (
                <td key={s.name} className={cn("p-4 text-sm font-bold", s.isCurrent ? "bg-primary/5" : "")}>
                  <div className="flex items-center space-x-2">
                    <span className={s.cost > 50 ? "text-destructive" : s.cost > 20 ? "text-orange-500" : "text-success"}>₦{s.cost.toFixed(1)}M</span>
                    {s.isCurrent ? null : <span className="text-xs text-muted-foreground">({s.cost > scenarios[1].cost ? '+' : ''}{(s.cost - scenarios[1].cost).toFixed(1)}M)</span>}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg flex items-start space-x-3">
        <Star className="h-5 w-5 text-yellow-500 mt-0.5 fill-yellow-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-yellow-500 mb-1">Recommendation Basis</p>
          <p className="text-sm text-muted-foreground">Scenario A (Immediate Maintenance) is recommended. While it requires 8 hours of planned downtime today, it mitigates a 65% chance of catastrophic failure over the next 14 days, saving an estimated ₦72.8M in emergency exposure and preventing 20 hours of additional unplanned downtime.</p>
        </div>
      </div>
    </div>
  );
}
