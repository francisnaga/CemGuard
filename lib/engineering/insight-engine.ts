import { 
  SimulationContext, 
  BusinessImpact 
} from './types';
import { MaintenanceDecision } from './decision-engine';

export function generateExecutiveInsight(
  context: SimulationContext,
  decision: MaintenanceDecision,
  impact: BusinessImpact,
  healthIndex: number
): string {
  
  const { currentState, plantState, category, equipmentId } = context;
  const { priority, predictedFailureMode, recommendedAction, strategy } = decision;

  // Format currency
  const formatCurrency = (val: number) => `₦${(val / 1000000).toFixed(1)}M`;

  if (currentState === 'Healthy' || currentState === 'New') {
    return `${category} (${equipmentId.substring(0,6)}) is operating optimally under ${plantState} conditions. Health index is strong at ${healthIndex}%. No immediate executive action required; continue ${strategy.toLowerCase()} maintenance schedules.`;
  }

  if (currentState === 'Critical' || currentState === 'Failure') {
    return `CRITICAL ALERT: ${category} (${equipmentId.substring(0,6)}) has reached a ${currentState.toLowerCase()} state due to ${predictedFailureMode.toLowerCase()}. Operating under ${plantState} conditions exacerbated the degradation. Immediate ${strategy.toLowerCase()} action is required. Estimated downtime is ${impact.downtimeHours} hours, resulting in a projected revenue loss of ${formatCurrency(impact.revenueLoss)} and an environmental impact of ${impact.co2ImpactTons} tons of CO2.`;
  }

  // Moderate to Severe Wear
  return `Over the simulated operating period, ${category} (${equipmentId.substring(0,6)}) has shown accelerated degradation, currently at ${healthIndex}% health (${currentState}). Operating under ${plantState} conditions has increased wear rates. The current trend indicates a ${priority.toLowerCase()} probability of ${predictedFailureMode.toLowerCase()}. Scheduling ${strategy.toLowerCase()} maintenance is recommended. Executing this proactively can reduce unplanned downtime and avoid up to ${formatCurrency(impact.totalRiskExposure)} in risk exposure.`;
}
