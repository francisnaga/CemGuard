'use client';

import { useStore, PLANT_PROFILES } from '@/lib/store';
import { Factory, Activity, Clock, ShieldAlert, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateBusinessImpact } from '@/lib/engineering/business-impact-engine';
import { generateInsight } from '@/lib/engineering/insight-engine';

export default function ReportsPage() {
  const { selectedPlant, simulationDay, plantState, dtMachines, dtClock } = useStore();
  const plantProfile = PLANT_PROFILES.find(p => p.name === selectedPlant) || PLANT_PROFILES[0];
  
  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const worstMachine = dtMachines.reduce((worst, m) => m.failureProb > worst.failureProb ? m : worst, dtMachines[0]);
  const strategy = worstMachine.failureProb > 70 ? 'Emergency' : worstMachine.failureProb > 50 ? 'Corrective' : worstMachine.failureProb > 20 ? 'Predictive' : 'Preventive';
  const impact = calculateBusinessImpact(strategy, worstMachine.name.includes('Kiln') ? 'Kiln' : 'Crusher');
  const insight = generateInsight(worstMachine, impact);
  const plannedImpact = calculateBusinessImpact('Preventive', worstMachine.name.includes('Kiln') ? 'Kiln' : 'Crusher');

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
      <div className="bg-white text-black p-12 min-h-[1056px] shadow-2xl rounded-xl print:shadow-none print:rounded-none print:p-8 print:border-none border border-border mx-auto relative overflow-hidden">
        
        {/* Document Header */}
        <div className="border-b-4 border-black pb-8 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">Plant Health & Reliability Report</h1>
            <p className="text-lg font-medium text-gray-600">{plantProfile.name} • {formattedDate}</p>
          </div>
          <div className="text-right">
            <Factory className="h-12 w-12 text-black ml-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">CemGuard Decision Support System</p>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-gray-300 pb-2">
            <span className="bg-black text-white px-2 py-0.5 mr-3 text-sm">01</span> Executive Summary
          </h2>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1">Production Capacity</span>
              <span className="text-2xl font-bold text-black">{plantProfile.capacity.toLocaleString()}</span> <span className="text-xs text-gray-600 font-bold">tpd</span>
            </div>
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1">Plant State</span>
              <span className="text-lg font-bold text-black">{plantState}</span>
            </div>
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1">Risk Exposure</span>
              <span className="text-2xl font-bold text-red-600">{insight.severity}</span>
            </div>
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1">Maint. Budget</span>
              <span className="text-xl font-bold text-black">{plantProfile.budget}</span>
            </div>
          </div>
          <p className="text-gray-800 leading-relaxed text-sm text-justify">
            This report details the current operational reliability of the {plantProfile.name}. {insight.situation} {insight.observation} If preventative maintenance is not scheduled, the cascading throughput loss will result in severe financial exposure.
          </p>
        </div>

        {/* 2. Equipment Telemetry */}
        <div className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-gray-300 pb-2">
            <span className="bg-black text-white px-2 py-0.5 mr-3 text-sm">02</span> Live Equipment Telemetry
          </h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Equipment</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Health Index</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Utilization</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Efficiency</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-b border-gray-300">
              {dtMachines.map((m) => (
                <tr key={m.id} className={m.risk === 'Critical' || m.risk === 'High' ? 'bg-red-50' : ''}>
                  <td className="p-3 font-bold text-black">{m.name}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={cn("font-bold mr-2", m.health < 50 ? 'text-red-600' : 'text-gray-900')}>{m.health}%</span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={cn("h-full", m.health < 50 ? 'bg-red-600' : 'bg-black')} style={{ width: `${m.health}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-gray-800">{m.utilization}%</td>
                  <td className="p-3 font-medium text-gray-800">{m.efficiency}%</td>
                  <td className={cn(
                    "p-3 font-bold text-right uppercase tracking-wider text-xs",
                    m.risk === 'Critical' ? "text-red-700" : m.risk === 'High' ? "text-red-500" : m.risk === 'Medium' ? "text-yellow-600" : "text-green-700"
                  )}>{m.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Strategic Recommendations */}
        <div className="mb-10 page-break-inside-avoid">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center border-b border-gray-300 pb-2">
            <span className="bg-black text-white px-2 py-0.5 mr-3 text-sm">03</span> Strategic Maintenance Recommendation
          </h2>
          <div className="border-l-4 border-black pl-6 py-2 mb-6">
            <h3 className="text-lg font-bold text-black mb-1">Execute {plannedImpact.downtimeHours}-Hour Planned Shutdown</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {insight.recommendation}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-black" />
                <span className="font-semibold text-gray-900">Prevents {impact.downtimeHours - plannedImpact.downtimeHours} Hrs Unplanned Downtime</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <TrendingDown className="h-5 w-5 text-black" />
                <span className="font-semibold text-gray-900">Mitigates ₦{(impact.totalRiskExposure / 1000000).toFixed(1)}M Revenue Exposure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 border-t border-gray-300 pt-4 flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <span>Confidential — Dangote Cement Plc Internal</span>
          <span>Generated by CemGuard DSS</span>
          <span>Page 1 of 1</span>
        </div>

      </div>
    </div>
  );
}
