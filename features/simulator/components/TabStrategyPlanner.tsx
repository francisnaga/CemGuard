'use client';

import { useState } from 'react';
import { Settings2, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { projectFailureProbability } from '@/lib/engineering/physics-engine';
import { cn } from '@/lib/utils';

export function TabStrategyPlanner() {
  const [delayDays, setDelayDays] = useState(14);
  const [priority, setPriority] = useState('Critical');

  // Pull live Crusher state from the physics engine (single source of truth)
  const crusher = useStore(s => s.dtMachines.find(m => m.id === 'crusher'));

  // Project failure probability forward using real Weibull equation
  // (non-linear — follows the curve, not a linear estimate)
  const currentHours  = crusher?.operatingHours ?? 12400;
  const baseEta       = crusher?.baseEta ?? 18000;
  const beta          = crusher?.beta ?? 2.5;
  const currentP      = crusher?.failureProb ?? 12.4;

  // Derive effectiveEta from current state (reverse from live P(f))
  // Use the stored failureProb directly as the current baseline and project forward
  const projectedHours = delayDays * 24;
  const projectedProb  = projectFailureProbability(currentHours, projectedHours, baseEta, beta);

  // Business impact — defensible assumption documented in tooltip
  // ₦25,000/hr (representative: ~450 t/h × ₦55/kg ÷ 1000)
  const HOURLY_VALUE = 25000; // ₦/hr, representative assumption
  const plannedDowntime = 8;  // hours — standard crusher bearing replacement
  const plannedCost     = (plannedDowntime * HOURLY_VALUE + 5000000) / 1_000_000; // ₦M
  const emergencyCostM  = delayDays === 0 ? plannedCost
                        : ((projectedProb / 100) * 72 * HOURLY_VALUE * (1 + delayDays / 30) + 50000000) / 1_000_000;
  const downtimeEst     = delayDays === 0 ? plannedDowntime
                        : Math.round(8 + (projectedProb / 100) * 64);

  const probColor = projectedProb > 70 ? 'text-destructive' : projectedProb > 40 ? 'text-orange-500' : 'text-success';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      {/* Inputs */}
      <div className="bg-card border border-border p-6 rounded-xl flex flex-col space-y-6">
        <div className="flex items-center space-x-2 border-b border-border pb-4">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Strategy Inputs</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Equipment</label>
            <select className="mt-1 w-full bg-background border border-border rounded-lg p-2 text-sm font-medium focus:outline-none focus:border-primary">
              <option>Crusher</option>
              <option>Raw Mill</option>
              <option>Kiln</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Delay Maintenance</span>
              <span className="text-primary">{delayDays} Days</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={delayDays}
              onChange={(e) => setDelayDays(parseInt(e.target.value))}
              className="mt-2 w-full accent-primary" 
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority Level</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-lg p-2 text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option>Standard</option>
              <option>Urgent</option>
              <option>Critical</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Spares Lead Time</label>
            <select className="mt-1 w-full bg-background border border-border rounded-lg p-2 text-sm font-medium focus:outline-none focus:border-primary">
              <option>In Stock (0 Days)</option>
              <option>Local (3 Days)</option>
              <option>Imported (14 Days)</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-muted/30 border border-border rounded-lg text-[10px] text-muted-foreground">
          <p className="font-bold uppercase tracking-wide text-foreground mb-1">Model Basis</p>
          <p>Weibull projection (β={beta}, η={baseEta.toLocaleString()} hrs). Business values use ₦25,000/hr (representative).</p>
        </div>
      </div>

      {/* Impact Output */}
      <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl flex flex-col space-y-6">
        <h2 className="text-lg font-bold border-b border-border pb-4">Strategy Impact Estimation</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Engineering Impact</h3>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-sm font-semibold mb-2">Probability of Failure</p>
              <p className={cn("text-2xl font-bold font-mono", probColor)}>
                {projectedProb.toFixed(1)}%
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Weibull projection at t={Math.round(currentHours + projectedHours).toLocaleString()} hrs
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-sm font-semibold mb-2">Est. Remaining Useful Life</p>
              <span className="text-xl font-bold text-orange-500">{Math.max(0, 30 - delayDays)} Days</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Impact</h3>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-sm font-semibold mb-2">Estimated Downtime</p>
              <span className={cn("text-xl font-bold", downtimeEst > 20 ? "text-destructive" : "text-foreground")}>
                {downtimeEst} Hrs
              </span>
            </div>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-sm font-semibold mb-1">Revenue Exposure</p>
              <span className={cn("text-xl font-bold", emergencyCostM > 30 ? "text-destructive" : "text-foreground")}>
                ₦{emergencyCostM.toFixed(1)}M
              </span>
              <p className="text-[10px] text-muted-foreground mt-1">
                Representative — see model basis
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto p-5 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Strategy Recommendation</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {delayDays === 0
                  ? `Immediate maintenance eliminates the current ${currentP.toFixed(1)}% failure risk at a planned cost of ₦${plannedCost.toFixed(1)}M. This is the recommended path.`
                  : `Delaying ${delayDays} days escalates Weibull-projected failure probability to ${projectedProb.toFixed(1)}%, driving estimated exposure to ₦${emergencyCostM.toFixed(1)}M. ${priority} priority maintenance is advised before this threshold is reached.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
