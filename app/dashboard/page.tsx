'use client';

import { useStore } from '@/lib/store';
import { useMemo } from 'react';
import { calculateBusinessImpact } from '@/lib/engineering/business-impact-engine';
import { generateInsight } from '@/lib/engineering/insight-engine';

import { SectionA_KPIs } from '@/features/dashboard/components/SectionA_KPIs';
import { SectionB_Insight } from '@/features/dashboard/components/SectionB_Insight';
import { SectionC_PlantSVG } from '@/features/dashboard/components/SectionC_PlantSVG';
import { SectionD_Ranking } from '@/features/dashboard/components/SectionD_Ranking';
import { SectionE_BusinessImpact } from '@/features/dashboard/components/SectionE_BusinessImpact';
import { SectionF_MaintenanceQueue } from '@/features/dashboard/components/SectionF_MaintenanceQueue';
import { SectionG_Trends } from '@/features/dashboard/components/SectionG_Trends';

export default function DashboardPage() {
  const { dtMachines, dtClock, dtHistory, presentationMode, simulationDay, currentView } = useStore();
  const isLive = dtClock > 32;

  // Single Source of Truth: Read from dtMachines
  const fleetHealth = Math.round(dtMachines.reduce((sum, m) => sum + m.health, 0) / dtMachines.length);
  const worstMachine = dtMachines.reduce((worst, m) => m.failureProb > worst.failureProb ? m : worst);
  
  // Calculate impact for worst machine
  const strategy = worstMachine.failureProb > 70 ? 'Emergency' : worstMachine.failureProb > 50 ? 'Corrective' : worstMachine.failureProb > 20 ? 'Predictive' : 'Preventive';
  const impact = calculateBusinessImpact(strategy, worstMachine.name.includes('Kiln') ? 'Kiln' : 'Crusher');

  const insight = generateInsight(worstMachine, impact);

  const kpiData = {
    health: fleetHealth,
    healthTrend: fleetHealth - 90,
    oee: dtHistory.length > 0 ? dtHistory[dtHistory.length - 1].oee : 95,
    alerts: dtMachines.filter(m => m.vibrationZone === 'C' || m.vibrationZone === 'D').length,
    risk: impact.totalRiskExposure,
    riskTrend: worstMachine.failureProb > 40 ? 12.5 : -2.1,
    availability: fleetHealth > 20 ? 98.2 : 0,
    savings: 18.6
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <SectionA_KPIs kpiData={kpiData} presentationMode={presentationMode} />
      
      <SectionB_Insight 
        primaryInsight={insight.situation}
        observation={insight.observation}
        recommendedAction={insight.recommendation}
        expectedImpact={`Avoids ₦${(impact.totalRiskExposure / 1000000).toFixed(1)}M in risk exposure and ${impact.downtimeHours} hours of downtime.`}
        presentationMode={presentationMode}
        severity={insight.severity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* We map dtMachines to the SVG nodes so they update live */}
          <SectionC_PlantSVG nodes={dtMachines.map(m => ({
            id: m.id,
            name: m.name,
            context: { currentState: m.risk, plantState: 'Normal Production', category: m.name, equipmentId: m.id, installationDate: new Date(), currentDate: new Date(), environment: { ambientTemperature: 38, humidity: 65, dustLevel: 'High' } },
            health: m.health,
            temperature: m.temperatureC,
            isProcessTemp: m.id === 'kiln'
          }))} />
        </div>
        <div className="lg:col-span-1">
          <SectionD_Ranking rankings={dtMachines.map(m => ({
            id: m.id,
            name: m.name,
            health: m.health,
            riskValue: calculateBusinessImpact(m.failureProb > 50 ? 'Corrective' : 'Predictive', m.name.includes('Kiln') ? 'Kiln' : 'Crusher').totalRiskExposure,
            failureMode: 'Bearing wear'
          })).sort((a,b) => b.riskValue - a.riskValue).slice(0, 5)} />
        </div>
      </div>

      {currentView === 'Executive' && <SectionE_BusinessImpact impact={impact} />}

      {(currentView === 'Maintenance Manager' || currentView === 'Reliability Engineer') && (
        <SectionF_MaintenanceQueue items={dtMachines
          .filter(m => m.failureProb > 20)
          .sort((a, b) => b.failureProb - a.failureProb)
          .map(m => ({
            id: m.id,
            equipment: m.name,
            priority: m.risk,
            strategy: m.failureProb > 70 ? 'Emergency' : 'Predictive',
            failureMode: 'Bearing degradation',
            confidence: 95,
            deadline: `Immediate`,
            status: 'Pending'
          }))
        } />
      )}

      <SectionG_Trends 
        trendData={dtHistory.map(h => ({
          day: `${Math.floor(h.time * 15 / 60)}:${(h.time * 15 % 60).toString().padStart(2, '0')}`,
          health: h.health,
          prob: h.failureProb,
          downtime: calculateBusinessImpact(h.failureProb > 50 ? 'Corrective' : 'Predictive', 'Crusher').downtimeHours,
          oee: h.oee
        }))} 
        presentationMode={presentationMode} 
      />
    </div>
  );
}
