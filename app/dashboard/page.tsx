'use client';

import { useStore } from '@/lib/store';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
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

  // Single Source of Truth: Read from dtMachines and dtHistory
  const fleetHealth = Math.round(dtMachines.reduce((sum, m) => sum + m.health, 0) / dtMachines.length);
  const fleetAvailability = dtMachines.reduce((sum, m) => sum + m.availability, 0) / dtMachines.length;
  const worstMachine = dtMachines.reduce((worst, m) => m.failureProb > worst.failureProb ? m : worst);
  
  // Calculate impact for worst machine
  const strategy = worstMachine.failureProb > 70 ? 'Emergency' : worstMachine.failureProb > 50 ? 'Corrective' : worstMachine.failureProb > 20 ? 'Predictive' : 'Preventive';
  const category = worstMachine.name.includes('Kiln') ? 'Kiln' : worstMachine.name.includes('Mill') ? 'Mill' : 'Crusher';
  const impact = calculateBusinessImpact(strategy, category);
  const emergencyImpact = calculateBusinessImpact('Emergency', category);
  const savingsAmount = (emergencyImpact.totalRiskExposure - impact.totalRiskExposure) / 1_000_000;

  const insight = generateInsight(worstMachine, impact);
  const activeAlerts = dtMachines.filter(m => m.vibrationZone === 'C' || m.vibrationZone === 'D').length;

  const prevHistory = dtHistory.length > 1 ? dtHistory[dtHistory.length - 2] : dtHistory[0] || { oee: 95, health: 95, failureProb: 10 };
  const currHistory = dtHistory.length > 0 ? dtHistory[dtHistory.length - 1] : { oee: 95, health: 95, failureProb: 10 };

  const kpiData = {
    health: fleetHealth,
    healthTrend: fleetHealth - prevHistory.health,
    oee: currHistory.oee,
    oeeTrend: currHistory.oee - prevHistory.oee,
    alerts: activeAlerts,
    alertsTrend: activeAlerts > 0 ? 1 : 0, // simple heuristic
    risk: impact.totalRiskExposure,
    riskTrend: (currHistory.failureProb - prevHistory.failureProb) * 2, // simple proxy for risk growth
    availability: fleetAvailability,
    availabilityTrend: fleetAvailability > 90 ? 0.1 : -1.2,
    savings: savingsAmount,
    savingsTrend: savingsAmount > 0 ? 2.5 : 0
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* --- Section Reordering based on currentView --- */}
      <div className={cn(
        "flex flex-col gap-6",
        // For engineering views, promote Plant, Maintenance, Trends. Demote KPIs, Insight, Business.
        (currentView === 'Maintenance Manager' || currentView === 'Reliability Engineer') ? "[&>*:nth-child(1)]:order-4 [&>*:nth-child(2)]:order-5 [&>*:nth-child(3)]:order-1 [&>*:nth-child(4)]:order-6 [&>*:nth-child(5)]:order-2 [&>*:nth-child(6)]:order-3" : ""
      )}>
        {/* 1 */}
        <SectionA_KPIs kpiData={kpiData} presentationMode={presentationMode} />
        
        {/* 2 */}
        <SectionB_Insight 
          primaryInsight={insight.situation}
          observation={insight.observation}
          recommendedAction={insight.recommendation}
          expectedImpact={`Avoids ₦${(impact.totalRiskExposure / 1000000).toFixed(1)}M in risk exposure and ${impact.downtimeHours} hours of downtime.`}
          presentationMode={presentationMode}
          severity={insight.severity}
        />

        {/* 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionC_PlantSVG nodes={dtMachines.map(m => ({
              id: m.id,
              name: m.name,
              context: { currentState: m.risk === 'Low' ? 'Healthy' : m.risk === 'Medium' ? 'Minor Wear' : m.risk === 'High' ? 'Severe Wear' : 'Critical', plantState: 'Normal Production', category: m.name, equipmentId: m.id, installationDate: new Date(), currentDate: new Date(), environment: { ambientTemperature: 38, humidity: 65, dustLevel: 'High' } },
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
              riskValue: calculateBusinessImpact(m.failureProb > 50 ? 'Corrective' : 'Predictive', m.name.includes('Kiln') ? 'Kiln' : m.name.includes('Mill') ? 'Mill' : 'Crusher').totalRiskExposure,
              failureMode: `High Vibration (Zone ${m.vibrationZone})`
            })).sort((a,b) => b.riskValue - a.riskValue).slice(0, 5)} />
          </div>
        </div>

        {/* 4 */}
        <SectionE_BusinessImpact impact={impact} />

        {/* 5 */}
        <SectionF_MaintenanceQueue items={dtMachines
          .filter(m => m.failureProb > 20)
          .sort((a, b) => b.failureProb - a.failureProb)
          .map(m => ({
            id: m.id,
            equipment: m.name,
            priority: m.risk,
            strategy: m.failureProb > 70 ? 'Emergency' : 'Predictive',
            failureMode: `High Temp (${m.temperatureC.toFixed(0)}°C) / Zone ${m.vibrationZone}`,
            confidence: Math.round(m.failureProb + 10 > 100 ? 99 : m.failureProb + 10),
            deadline: m.failureProb > 80 ? `Immediate` : `Within ${Math.max(1, 14 - Math.floor(m.failureProb / 10))} Days`,
            status: 'Pending'
          }))
        } />

        {/* 6 */}
        <SectionG_Trends 
          trendData={dtHistory.map(h => ({
            day: `${Math.floor(h.time * 15 / 60)}:${(h.time * 15 % 60).toString().padStart(2, '0')}`,
            health: h.health,
            prob: h.failureProb,
            downtime: calculateBusinessImpact(h.failureProb > 50 ? 'Corrective' : 'Predictive', worstMachine.name.includes('Kiln') ? 'Kiln' : worstMachine.name.includes('Mill') ? 'Mill' : 'Crusher').downtimeHours,
            oee: h.oee
          }))} 
          presentationMode={presentationMode} 
        />
      </div>
    </div>
  );
}
