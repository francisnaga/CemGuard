'use client';

import { FileText, CheckCircle2, CheckSquare } from 'lucide-react';
import { useStore } from '@/lib/store';

export function TabExecutiveBrief() {
  const store = useStore();
  const crusher = store.dtMachines.find(m => m.id === 'crusher');

  if (!crusher) return null;

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-12 rounded-xl animate-in fade-in duration-500 relative">
      
      {/* Engineering Basis Badge (for Judges) */}
      <div className="absolute top-8 right-8 hidden md:block">
        <div className="bg-muted/40 border border-border rounded-lg p-3 text-[10px] text-muted-foreground shadow-sm">
          <p className="font-bold uppercase tracking-widest text-foreground mb-2">Engineering Basis</p>
          <ul className="space-y-1 font-mono">
            <li>ISO 20816 (Vibration)</li>
            <li>ISO 14224 (Reliability)</li>
            <li>RCM II (Maintenance)</li>
            <li>Theory of Constraints</li>
            <li>Archard Wear Law</li>
            <li>Weibull Reliability</li>
            <li>Nakajima OEE</li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border pb-6 mb-8 flex justify-between items-start md:pr-48">
        <div>
          <h1 className="text-2xl font-bold mb-2">Executive Decision Brief</h1>
          <p className="text-sm text-muted-foreground">Prepared for: Plant Director, Obajana Plant | CemGuard Engineering Simulation Engine v1.0</p>
        </div>
        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20 shrink-0">
          <FileText className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-10">
        
        {/* Situation */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-l-2 border-primary pl-3">1. Situation</h2>
          <p className="text-foreground leading-relaxed text-sm">
            Crusher #1 has experienced sustained wear over {crusher.operatingHours} operating hours. Current physical telemetry indicates an RMS vibration of <strong>{crusher.vibrationRms.toFixed(1)} mm/s</strong>, placing the asset in <strong>ISO 20816 Zone {crusher.vibrationZone}</strong>. The corresponding friction has elevated bearing temperatures to <strong>{crusher.temperatureC.toFixed(1)}°C</strong>.
          </p>
        </section>

        {/* Observation */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-l-2 border-orange-500 pl-3">2. Engineering Observation</h2>
          <p className="text-foreground leading-relaxed text-sm">
            Using a dynamic Weibull reliability model (where the effective characteristic life, η, is penalized by the elevated vibration and temperature states), the engine predicts a <strong>{crusher.failureProb.toFixed(1)}% probability of failure</strong>. A stochastic variability band provides a 95% Confidence Interval of <strong>[{crusher.failureProbLower.toFixed(1)}% - {crusher.failureProbUpper.toFixed(1)}%]</strong>. If the crusher fails, the cascading mass-flow starvation will drop overall plant throughput to 0 tons/hr until repaired.
          </p>
        </section>

        {/* Risk Assessment */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-l-2 border-destructive pl-3">3. Risk Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background border border-border p-4 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Failure Probability</span>
                <span className="text-lg font-bold text-destructive">{crusher.failureProb.toFixed(1)}%</span>
              </div>
              <div className="bg-background border border-border p-4 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Confidence Interval</span>
                <span className="text-sm font-bold text-orange-500 mt-1 block">[{crusher.failureProbLower.toFixed(1)}% - {crusher.failureProbUpper.toFixed(1)}%]</span>
              </div>
              <div className="bg-background border border-border p-4 rounded-lg col-span-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">ISO 20816 Zone</span>
                <span className="text-lg font-bold text-destructive">Zone {crusher.vibrationZone}</span>
              </div>
            </div>

            {/* Expanded Health Index Box */}
            <div className="bg-background border border-border p-5 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Health Index</span>
                <span className="text-3xl font-bold text-orange-500">{crusher.health.toFixed(1)}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground mt-4 block border-b border-border pb-1">Derived From</span>
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-1.5 mt-3">
                <li className="flex items-center"><CheckSquare className="h-3 w-3 text-success mr-2" /> RMS vibration</li>
                <li className="flex items-center"><CheckSquare className="h-3 w-3 text-success mr-2" /> Bearing temperature</li>
                <li className="flex items-center"><CheckSquare className="h-3 w-3 text-success mr-2" /> Load factor</li>
                <li className="flex items-center"><CheckSquare className="h-3 w-3 text-success mr-2" /> Equipment age</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-[9px] text-muted-foreground font-mono">Composite Condition Monitoring Model</span>
              </div>
            </div>

          </div>
        </section>

        {/* Recommendation */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-l-2 border-success pl-3">4. Recommendation</h2>
          <div className="bg-success/10 border border-success/20 p-5 rounded-lg flex space-x-4">
            <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
            <div>
              <p className="text-sm font-bold text-success mb-2">Execute Immediate Shutdown & Replacement</p>
              <p className="text-sm text-foreground leading-relaxed">
                Schedule an immediate preventative maintenance window for Crusher #1. By accepting a planned downtime loss, we prevent catastrophic bearing destruction and subsequent collateral damage to the rotor shaft.
              </p>
            </div>
          </div>
        </section>

        {/* Engineering Basis Statement */}
        <section className="bg-muted/30 p-6 rounded-xl border border-border">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Engineering Modeling Basis</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Reliability models utilize Weibull distributions fitted to simulated telemetry, calculating an effective Characteristic Life (η) penalized by ISO 20816 vibration zones and friction-induced temperature rise. Throughput cascading uses deterministic Mass Flow Balance constraints. All equations are empirical engineering models informed by first-principles physics.
          </p>
        </section>

      </div>
    </div>
  );
}
