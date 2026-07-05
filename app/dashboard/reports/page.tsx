'use client';

import { useStore, PLANT_PROFILES } from '@/lib/store';
import { Factory, Activity, Clock, ShieldAlert, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { cn, formatNaira } from '@/lib/utils';
import { calculateBusinessImpact } from '@/lib/engineering/business-impact-engine';
import { generateInsight } from '@/lib/engineering/insight-engine';

export default function ReportsPage() {
  const { selectedPlant, simulationDay, plantState, dtMachines, dtClock } = useStore();
  const plantProfile = PLANT_PROFILES.find(p => p.name === selectedPlant) || PLANT_PROFILES[0];
  
  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const machinesWithImpact = dtMachines.map(m => {
    const strategy = m.failureProb > 70 ? 'Emergency' : m.failureProb > 50 ? 'Corrective' : m.failureProb > 20 ? 'Predictive' : 'Preventive';
    const category = m.name.includes('Kiln') ? 'Kiln' : m.name.includes('Mill') ? 'Mill' : 'Crusher';
    const impact = calculateBusinessImpact(strategy, category);
    const expectedRisk = impact.totalRiskExposure * (m.failureProb / 100);
    return { ...m, expectedRisk, impact, strategy, category };
  });

  const worstMachine = machinesWithImpact.reduce((worst, m) => m.expectedRisk > worst.expectedRisk ? m : worst, machinesWithImpact[0]);
  const strategy = worstMachine.strategy;
  const impact = worstMachine.impact;
  const insight = generateInsight(worstMachine, impact);
  const plannedImpact = calculateBusinessImpact('Preventive', worstMachine.category);

  return (
    <div className="max-w-4xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0">
      
      {/* Non-Print Header Controls */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Executive Reports</h1>
          <p className="text-sm text-muted-foreground">Generate printable, board-ready documentation.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
        >
          Print / Export to PDF
        </button>
      </div>

      {/* --- A4 Print Document Start --- */}
      <div className="bg-card text-foreground p-12 min-h-[1056px] rounded-md print:shadow-none print:rounded-none print:p-8 print:border-none border border-border mx-auto relative overflow-hidden">
        
        {/* Document Header */}
        <div className="border-b-4 border-foreground pb-8 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">Plant Health & Reliability Report</h1>
            <p className="text-lg font-medium text-muted-foreground">{plantProfile.name} • {formattedDate}</p>
          </div>
          <div className="text-right">
            <Factory className="h-12 w-12 text-foreground ml-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CemGuard Decision Support System</p>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-gray-300 pb-2">
            <span className="bg-black text-white px-2 py-0.5 mr-3 text-sm">01</span> Executive Summary
          </h2>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-muted/10 p-4 rounded border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">Production Capacity</span>
              <span className="text-2xl font-mono font-bold text-foreground">{plantProfile.capacity.toLocaleString()}</span> <span className="text-xs text-muted-foreground font-bold">tpd</span>
            </div>
            <div className="bg-muted/10 p-4 rounded border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">Plant State</span>
              <span className="text-lg font-bold text-foreground">{plantState}</span>
            </div>
            <div className="bg-muted/10 p-4 rounded border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">Risk Exposure</span>
              <span className="text-2xl font-bold text-destructive">{insight.severity}</span>
            </div>
            <div className="bg-muted/10 p-4 rounded border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">Maint. Budget</span>
              <span className="text-xl font-mono font-bold text-foreground">{plantProfile.budget}</span>
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed text-sm text-justify">
            This report details the current operational reliability of the {plantProfile.name}. {insight.situation} {insight.observation} If preventative maintenance is not scheduled, the cascading throughput loss will result in severe financial exposure.
          </p>
        </div>

        {/* 2. Equipment Telemetry */}
        <div className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-border pb-2">
            <span className="bg-foreground text-background px-2 py-0.5 mr-3 text-sm">02</span> Live Equipment Telemetry
          </h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Equipment</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Health Index</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Utilization</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Efficiency</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-b border-border">
              {dtMachines.map((m) => (
                <tr key={m.id} className={m.risk === 'Critical' || m.risk === 'High' ? 'bg-destructive/5' : ''}>
                  <td className="p-3 font-bold text-foreground">{m.name}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={cn("font-mono font-bold mr-2", m.health < 50 ? 'text-destructive' : 'text-foreground')}>{m.health}%</span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full", m.health < 50 ? 'bg-destructive' : 'bg-foreground')} style={{ width: `${m.health}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-medium text-foreground/80">{m.utilization}%</td>
                  <td className="p-3 font-mono font-medium text-foreground/80">{m.efficiency}%</td>
                  <td className={cn(
                    "p-3 font-bold text-right uppercase tracking-wider text-xs",
                    m.risk === 'Critical' ? "text-destructive" : m.risk === 'High' ? "text-destructive/80" : m.risk === 'Medium' ? "text-warning" : "text-success"
                  )}>{m.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Strategic Recommendations */}
        <div className="mb-10 page-break-inside-avoid">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-border pb-2">
            <span className="bg-foreground text-background px-2 py-0.5 mr-3 text-sm">03</span> Strategic Maintenance Recommendation
          </h2>
          <div className="border-l-4 border-foreground pl-6 py-2 mb-6">
            <h3 className="text-lg font-bold text-foreground mb-1">Execute <span className="font-mono">{plannedImpact.downtimeHours}</span>-Hour Planned Shutdown</h3>
            <p className="text-foreground/80 text-sm leading-relaxed mb-4">
              {insight.recommendation}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-foreground" />
                <span className="font-semibold text-foreground">Prevents <span className="font-mono">{impact.downtimeHours - plannedImpact.downtimeHours}</span> Hrs Unplanned Downtime</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <TrendingDown className="h-5 w-5 text-foreground" />
                <span className="font-semibold text-foreground">Mitigates <span className="font-mono">{formatNaira(impact.totalRiskExposure)}</span> Revenue Exposure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 border-t border-border pt-4 flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <span>Confidential — Dangote Cement Plc Internal</span>
          <span>Generated by CemGuard DSS</span>
          <span>Page 1 of 1</span>
        </div>

      </div>
    </div>
  );
}
