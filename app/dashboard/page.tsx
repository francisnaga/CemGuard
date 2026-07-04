'use client';

import { useStore } from '@/lib/store';
import { useMemo } from 'react';
import { 
  EQUIPMENT_PROFILES, 
  generateTelemetry, 
  calculateHealthIndex, 
  generateDecision, 
  calculateBusinessImpact, 
  SimulationContext,
  DegradationState
} from '@/lib/engineering';
import { calculateOEE } from '@/lib/engineering/physics-engine';

import { SectionA_KPIs } from '@/features/dashboard/components/SectionA_KPIs';
import { SectionB_Insight } from '@/features/dashboard/components/SectionB_Insight';
import { SectionC_PlantSVG } from '@/features/dashboard/components/SectionC_PlantSVG';
import { SectionD_Ranking } from '@/features/dashboard/components/SectionD_Ranking';
import { SectionE_BusinessImpact } from '@/features/dashboard/components/SectionE_BusinessImpact';
import { SectionF_MaintenanceQueue } from '@/features/dashboard/components/SectionF_MaintenanceQueue';
import { SectionG_Trends } from '@/features/dashboard/components/SectionG_Trends';

export default function DashboardPage() {
  const { simulationDay, plantState, presentationMode } = useStore();

  // 1. DYNAMIC ENGINEERING SIMULATION
  // We simulate what happens to a Crusher over the 30 day period.
  const stateMapping: Record<number, DegradationState> = {
    1: 'Healthy',
    8: 'Minor Wear',
    15: 'Moderate Wear',
    22: 'Severe Wear',
    28: 'Critical',
    29: 'Failure',
    30: 'Healthy' // Recovered
  };

  const getDayState = (day: number) => {
    let s: DegradationState = 'Healthy';
    Object.keys(stateMapping).forEach(d => {
      if (day >= parseInt(d)) s = stateMapping[parseInt(d)];
    });
    return s;
  };

  const currentState = getDayState(simulationDay);
  const profile = EQUIPMENT_PROFILES['Crusher'];

  const context: SimulationContext = {
    equipmentId: 'CRUSH-01',
    category: 'Crusher',
    installationDate: new Date('2020-01-01'),
    // Use a fixed base date rather than Date.now() to avoid SSR hydration mismatches
    currentDate: new Date(new Date('2026-01-01').getTime() + simulationDay * 86400000),
    currentState: currentState,
    plantState: plantState,
    environment: { ambientTemperature: 38, humidity: 65, dustLevel: 'High' }
  };

  const telemetry = generateTelemetry(profile, context);
  const health = calculateHealthIndex(currentState);
  const decision = generateDecision(currentState, profile);
  const impact = calculateBusinessImpact(decision.strategy, context.category);

  // Generate historical trend data up to current day
  const trendData = useMemo(() => {
    const data = [];
    for(let d=1; d<=Math.max(simulationDay, 30); d++) {
      const s = getDayState(d);
      const h = calculateHealthIndex(s);
      const imp = calculateBusinessImpact(generateDecision(s, profile).strategy, 'Crusher');
      data.push({
        day: `D${d}`,
        health: h,
        prob: 100 - h,
        downtime: imp.downtimeHours,
        oee: h > 50 ? 85 : h > 20 ? 60 : 0
      });
    }
    return data;
  }, [simulationDay]);

  // OEE = Availability × Performance × Quality
  // Availability: uptime ratio derived from health state
  // Performance: throughput ratio (simplified from health)
  // Quality: representative constant 0.98 for cement
  const availabilityRatio = health > 20 ? 0.982 : 0.0;
  const performanceRatio  = health > 50 ? 0.87 : health > 20 ? 0.60 : 0.0;
  const computedOEE = calculateOEE(availabilityRatio, performanceRatio);

  const kpiData = {
    health: health,
    healthTrend: health - 90, // vs baseline
    oee: computedOEE,
    alerts: health < 50 ? 3 : 0,
    risk: impact.totalRiskExposure,
    riskTrend: simulationDay > 15 ? 12.5 : -2.1,
    availability: health > 20 ? 98.2 : 0,
    savings: 18.6
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <SectionA_KPIs kpiData={kpiData} presentationMode={presentationMode} />
      
      <SectionB_Insight 
        primaryInsight={`${context.category} 1 has entered ${currentState}.`}
        observation={`Vibration and Temperature sensors indicate abnormal stress under ${plantState} conditions.`}
        recommendedAction={decision.recommendedAction}
        expectedImpact={`Executing this strategy will avoid ₦${(impact.totalRiskExposure / 1000000).toFixed(1)}M in risk exposure and ${impact.downtimeHours} hours of downtime.`}
        presentationMode={presentationMode}
        severity={health < 30 ? 'Critical' : health < 70 ? 'Warning' : 'Healthy'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionC_PlantSVG nodes={[
            { id: '1', name: 'Crusher 1', context, health, temperature: telemetry.temperature || 40 },
            { id: '2', name: 'Raw Mill 1', context: {...context, currentState: 'Healthy'}, health: 95, temperature: 65 },
            { id: '3', name: 'Kiln Line 1', context: {...context, currentState: 'Minor Wear'}, health: 80, temperature: 1400, isProcessTemp: true },
          ]} />
        </div>
        <div className="lg:col-span-1">
          <SectionD_Ranking rankings={[
            { id: '1', name: 'Crusher 1', health, riskValue: impact.totalRiskExposure, failureMode: decision.predictedFailureMode },
            { id: '2', name: 'Kiln Line 1', health: 80, riskValue: 4500000, failureMode: 'Refractory wear' },
            { id: '3', name: 'Raw Mill 1', health: 95, riskValue: 1200000, failureMode: 'Bearing wear' }
          ]} />
        </div>
      </div>

      <SectionE_BusinessImpact impact={impact} />

      <SectionF_MaintenanceQueue items={[
        {
          id: '1',
          equipment: 'Crusher 1',
          priority: decision.priority,
          strategy: decision.strategy,
          failureMode: decision.predictedFailureMode,
          confidence: health < 50 ? 92 : 65,
          deadline: `Day ${simulationDay + 2}`,
          status: 'Pending'
        }
      ]} />

      <SectionG_Trends trendData={trendData.slice(0, simulationDay)} presentationMode={presentationMode} />
    </div>
  );
}
