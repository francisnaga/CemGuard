'use client';

import { useStore } from '@/lib/store';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { calculateBusinessImpact } from '@/lib/engineering/business-impact-engine';
import { generateInsight } from '@/lib/engineering/insight-engine';

import { SectionA_KPIs } from '@/features/dashboard/components/SectionA_KPIs';
import { SectionB_Insight } from '@/features/dashboard/components/SectionB_Insight';
import { SectionC_PlantSVG } from '@/features/dashboard/components/SectionC_PlantSVG';
import { formatNaira } from '@/lib/utils';
import { SectionD_Ranking } from '@/features/dashboard/components/SectionD_Ranking';
import { SectionE_BusinessImpact } from '@/features/dashboard/components/SectionE_BusinessImpact';
import { SectionF_MaintenanceQueue } from '@/features/dashboard/components/SectionF_MaintenanceQueue';
import { SectionG_Trends } from '@/features/dashboard/components/SectionG_Trends';
import { AssetDigitalTwinModal } from '@/features/dashboard/components/AssetDigitalTwinModal';

export default function DashboardPage() {
  const { dtMachines, dtClock, dtHistory, dtTickets, presentationMode, simulationDay, currentView } = useStore();
  const isLive = dtClock > 32;

  // Single Source of Truth: Read from dtMachines and dtHistory
  const fleetHealth = Math.round(dtMachines.reduce((sum, m) => sum + m.health, 0) / dtMachines.length);
  const fleetAvailability = dtMachines.reduce((sum, m) => sum + m.availability, 0) / dtMachines.length;

  const machinesWithImpact = dtMachines.map(m => {
    const strategy = m.failureProb > 70 ? 'Emergency' : m.failureProb > 50 ? 'Corrective' : m.failureProb > 20 ? 'Predictive' : 'Preventive';
    const category = m.name.includes('Kiln') ? 'Kiln' : m.name.includes('Mill') ? 'Mill' : 'Crusher';
    const impact = calculateBusinessImpact(strategy, category);
    const expectedRisk = impact.totalRiskExposure * (m.failureProb / 100);
    return { ...m, expectedRisk, impact, strategy, category };
  });

  const worstMachine = machinesWithImpact.reduce((worst, m) => m.expectedRisk > worst.expectedRisk ? m : worst, machinesWithImpact[0]);
  
  const impact = worstMachine.impact;
  const emergencyImpact = calculateBusinessImpact('Emergency', worstMachine.category);
  const savingsAmount = (emergencyImpact.totalRiskExposure - impact.totalRiskExposure) / 1_000_000;

  const insight = generateInsight(worstMachine, impact);
  const activeAlerts = dtMachines.filter(m => m.vibrationZone === 'C' || m.vibrationZone === 'D').length;

  const prevHistory = dtHistory.length > 1 ? dtHistory[dtHistory.length - 2] : dtHistory[0] || { oee: 95, health: 95, failureProb: 10, time: 0, throughput: 450, machines: [] };
  const currHistory = dtHistory.length > 0 ? dtHistory[dtHistory.length - 1] : { oee: 95, health: 95, failureProb: 10, time: 0, throughput: 450, machines: [] };

  const kpiData = {
    health: fleetHealth,
    healthTrend: currHistory.health - prevHistory.health,
    oee: currHistory.oee,
    oeeTrend: currHistory.oee - prevHistory.oee,
    alerts: activeAlerts,
    alertsTrend: 0, // Removed legacy heuristic
    risk: worstMachine.expectedRisk, // Use true expected risk instead of maximum theoretical exposure
    riskTrend: (currHistory.failureProb - prevHistory.failureProb), // Use true prob delta without multiplier
    availability: fleetAvailability,
    availabilityTrend: 0, // Removed legacy logic
    savings: savingsAmount,
    savingsTrend: 0 // Removed legacy logic
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
          expectedImpact={`Avoids ${formatNaira(impact.totalRiskExposure)} in risk exposure and ${impact.downtimeHours} hours of downtime.`}
          presentationMode={presentationMode}
          severity={insight.severity}
        />

        {/* 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionC_PlantSVG nodes={dtMachines.map(m => ({
              id: m.id,
              name: m.name,
              context: { currentState: m.risk === 'Critical' ? 'Critical' : m.availability === 0 || m.utilization === 0 ? 'Offline' : m.risk === 'Medium' ? 'Minor Wear' : m.risk === 'High' ? 'Severe Wear' : 'Healthy', plantState: 'Normal Production', category: m.name, equipmentId: m.id, installationDate: new Date(), currentDate: new Date(), environment: { ambientTemperature: 38, humidity: 65, dustLevel: 'High' } },
              health: m.health,
              temperature: m.temperatureC,
              isProcessTemp: false,
              riskTier: m.risk
            }))} />
          </div>
          <div className="lg:col-span-1">
            <SectionD_Ranking rankings={dtMachines.map(m => {
              const impact = calculateBusinessImpact(m.failureProb > 50 ? 'Corrective' : 'Predictive', m.name.includes('Kiln') ? 'Kiln' : m.name.includes('Mill') ? 'Mill' : 'Crusher');
              return {
                id: m.id,
                name: m.name,
                health: m.health,
                expectedRisk: impact.totalRiskExposure * (m.failureProb / 100),
                exposureAmount: impact.totalRiskExposure,
                riskTier: m.risk,
                failureMode: m.vibrationZone === 'D' || m.vibrationZone === 'C' 
                  ? `High Vibration (Zone ${m.vibrationZone})` 
                  : m.temperatureC > 85 
                    ? `Overheating (${m.temperatureC.toFixed(1)}degC)`
                    : m.health < 80 
                      ? 'Degraded Health'
                      : 'Normal Operation'
              };
            }).sort((a,b) => b.expectedRisk - a.expectedRisk).slice(0, 5)} />
          </div>
        </div>

        {/* 4 */}
        <SectionE_BusinessImpact impact={impact} />

        {/* 5 */}
        <SectionF_MaintenanceQueue items={[...dtTickets].sort((a, b) => b.createdAt - a.createdAt)} />

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

      <AssetDigitalTwinModal />
    </div>
  );
}
