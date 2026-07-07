'use client';

import { useState } from 'react';
import { cn, formatNaira } from '@/lib/utils';
import { ArrowRight, Trash2 } from 'lucide-react';

export interface SavedScenario {
  id: string;
  name: string;
  delayDays: number;
  health: number;
  failureProb: number;
  downtime: number;
  revenueLoss: number;
}

export function ScenarioComparison({ 
  currentScenario, 
  savedScenarios,
  onDelete
}: { 
  currentScenario: SavedScenario, 
  savedScenarios: SavedScenario[],
  onDelete: (id: string) => void
}) {

  if (savedScenarios.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 mt-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Scenario Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-md">Metric</th>
              <th className="px-4 py-3 border-l border-border bg-primary/5 text-primary">Scenario A (Current)</th>
              {savedScenarios.map((s, i) => (
                <th key={s.id} className="px-4 py-3 border-l border-border">
                  <div className="flex items-center justify-between">
                    <span>{s.name}</span>
                    <button onClick={() => onDelete(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Failure Prob */}
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-4 py-3 font-medium text-muted-foreground">Failure Risk</td>
              <td className="px-4 py-3 border-l border-border bg-primary/5 font-bold">{currentScenario.failureProb}%</td>
              {savedScenarios.map(s => {
                const diff = s.failureProb - currentScenario.failureProb;
                return (
                  <td key={s.id} className="px-4 py-3 border-l border-border">
                    <span className="font-bold">{s.failureProb}%</span>
                    <span className={cn("ml-2 text-xs", diff > 0 ? "text-destructive" : "text-success")}>
                      ({diff > 0 ? '+' : ''}{diff}%)
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Downtime */}
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-4 py-3 font-medium text-muted-foreground">Downtime (Hrs)</td>
              <td className="px-4 py-3 border-l border-border bg-primary/5 font-bold">{currentScenario.downtime}</td>
              {savedScenarios.map(s => {
                const diff = s.downtime - currentScenario.downtime;
                return (
                  <td key={s.id} className="px-4 py-3 border-l border-border">
                    <span className="font-bold">{s.downtime}</span>
                    <span className={cn("ml-2 text-xs", diff > 0 ? "text-orange-500" : "text-success")}>
                      ({diff > 0 ? '+' : ''}{diff}h)
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Production Loss Cost */}
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-4 py-3 font-medium text-muted-foreground">Production Loss Cost</td>
              <td className="px-4 py-3 border-l border-border bg-primary/5 font-bold text-destructive">{formatNaira(currentScenario.revenueLoss, true)}</td>
              {savedScenarios.map(s => {
                const diff = s.revenueLoss - currentScenario.revenueLoss;
                return (
                  <td key={s.id} className="px-4 py-3 border-l border-border">
                    <span className="font-bold text-destructive">{formatNaira(s.revenueLoss, true)}</span>
                    <span className={cn("ml-2 text-xs", diff > 0 ? "text-destructive" : "text-success")}>
                      ({diff > 0 ? '+' : ''}{formatNaira(Math.abs(diff), true)})
                    </span>
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
