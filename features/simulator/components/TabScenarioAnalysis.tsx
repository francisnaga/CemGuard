'use client';

import { useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import { cn, formatNaira } from '@/lib/utils';

import { useStore } from '@/lib/store';
import { projectFailureProbability } from '@/lib/engineering/physics-engine';
import { calculateBusinessImpact, determineMaintenanceStrategy } from '@/lib/engineering/business-impact-engine';

export function TabScenarioAnalysis() {
  const dtMachines = useStore(s => s.dtMachines);
  const [targetId, setTargetId] = useState('crusher');
  
  const targetMachine = dtMachines.find(m => m.id === targetId) || dtMachines[0];

  const currentHours  = targetMachine.operatingHours;
  const baseEta       = targetMachine.baseEta;
  const beta          = targetMachine.beta;
  const currentP      = targetMachine.failureProb;

  const currentProbFraction = Math.max(0.0001, Math.min(0.9999, currentP / 100));
  const effectiveEta = currentHours > 0 
    ? currentHours / Math.pow(-Math.log(1 - currentProbFraction), 1 / beta) 
    : baseEta;

  const scenariosDef = [
    { name: 'Scenario A', subtitle: 'Immediate Maintenance', delay: 0, isCurrent: false },
    { name: 'Scenario B', subtitle: 'Current Baseline', delay: Math.max(1, targetMachine.vibrationZone === 'C' ? 7 : 14), isCurrent: true },
    { name: 'Scenario C', subtitle: 'Run to Failure', delay: 30, isCurrent: false }
  ];

  const rawScenarios = scenariosDef.map(s => {
    let projectedProb = projectFailureProbability(currentHours, s.delay * 24, effectiveEta, beta);
    if (s.delay === 0) projectedProb = 5; // Post-maintenance baseline
    
    const strategy = s.delay === 0 ? 'Preventive' : determineMaintenanceStrategy(projectedProb, s.delay);
    const category = targetMachine.name.includes('Kiln') ? 'Kiln' : targetMachine.name.includes('Mill') ? 'Mill' : 'Crusher';
    const impact = calculateBusinessImpact(strategy, category);

    return {
      ...s,
      risk: s.delay === 0 ? 5 : Math.round(projectedProb),
      downtime: impact.downtimeHours,
      cost: impact.totalRiskExposure / 1_000_000
    };
  });

  const bestScenario = rawScenarios.reduce((prev, curr) => (prev.cost < curr.cost) ? prev : curr);
  const currentBaseline = rawScenarios[1];

  const scenarios = rawScenarios.map(s => ({
    ...s,
    isRecommended: s.name === bestScenario.name
  }));

  return (
    <div className="bg-card border border-border p-6 rounded-xl animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Scenario Analysis</h2>
          <p className="text-sm text-muted-foreground">Compare strategic alternatives side-by-side.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="bg-background border border-border rounded-lg p-2 text-sm font-medium focus:outline-none focus:border-primary"
          >
            {dtMachines.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow hover:bg-primary/90">
            Save Current as Scenario
          </button>
        </div>
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
                    <span className={s.downtime > 20 ? "text-destructive" : s.downtime > 10 ? "text-orange-500" : "text-success"}>{Number(s.downtime).toFixed(1)} Hrs</span>
                    {s.isCurrent ? null : <span className="text-xs text-muted-foreground">({s.downtime > scenarios[1].downtime ? '+' : ''}{Number(s.downtime - scenarios[1].downtime).toFixed(1)} Hrs)</span>}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-sm font-semibold text-muted-foreground">Exposure Cost</td>
              {scenarios.map(s => (
                <td key={s.name} className={cn("p-4 text-sm font-bold", s.isCurrent ? "bg-primary/5" : "")}>
                  <div className="flex items-center space-x-2">
                    <span className={s.cost > 50 ? "text-destructive" : s.cost > 20 ? "text-orange-500" : "text-success"}>{formatNaira(s.cost, true)}</span>
                    {s.isCurrent ? null : <span className="text-xs text-muted-foreground">({s.cost > scenarios[1].cost ? '+' : ''}{formatNaira(Math.abs(s.cost - scenarios[1].cost), true)})</span>}
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
          <p className="text-sm text-muted-foreground">
            {bestScenario.name} ({bestScenario.subtitle}) is recommended. 
            {bestScenario.name === currentBaseline.name ? (
              <> The current operational baseline is the optimal strategy. Avoid unnecessary early maintenance or excessive delays to maximize financial efficiency.</>
            ) : (
              <> While it requires {bestScenario.downtime} hours of planned downtime {bestScenario.delay === 0 ? 'today' : `in ${bestScenario.delay} days`}, it mitigates a {Math.abs(currentBaseline.risk - bestScenario.risk)}% difference in failure probability compared to the baseline, saving an estimated {formatNaira(Math.abs(currentBaseline.cost - bestScenario.cost), true)} in avoidable exposure and {currentBaseline.downtime > bestScenario.downtime ? `preventing ${currentBaseline.downtime - bestScenario.downtime} hours of additional downtime.` : `incurring ${bestScenario.downtime - currentBaseline.downtime} hours of extra downtime for a much safer operating margin.`} </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
