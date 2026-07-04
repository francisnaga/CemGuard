import { DegradationState, MaintenanceStrategy, FailureMode, EquipmentProfile } from './types';

export interface MaintenanceDecision {
  strategy: MaintenanceStrategy;
  recommendedAction: string;
  predictedFailureMode: FailureMode;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export function generateDecision(
  state: DegradationState,
  profile: EquipmentProfile
): MaintenanceDecision {
  
  // Predict the most likely failure mode deterministically to avoid SSR hydration mismatches
  // (In a real ML system, this would be based on which specific sensor is spiking)
  const seed = state.length + profile.category.length;
  const modeIndex = seed % Math.max(1, profile.possibleFailureModes.length);
  const predictedFailureMode = profile.possibleFailureModes[modeIndex] || 'Unknown';

  let strategy: MaintenanceStrategy = 'Preventive';
  let recommendedAction = 'Schedule routine inspection';
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';

  switch (state) {
    case 'New':
    case 'Healthy':
      strategy = 'Preventive';
      recommendedAction = 'Continue normal operation and scheduled lubrication.';
      priority = 'Low';
      break;
    case 'Minor Wear':
      strategy = 'Condition-Based';
      recommendedAction = `Monitor vibration trends. Potential early signs of ${predictedFailureMode.toLowerCase()}.`;
      priority = 'Low';
      break;
    case 'Moderate Wear':
      strategy = 'Predictive';
      recommendedAction = `Schedule ${predictedFailureMode.toLowerCase()} inspection during next planned downtime.`;
      priority = 'Medium';
      break;
    case 'Severe Wear':
      strategy = 'Predictive';
      recommendedAction = `Prepare replacement parts for ${predictedFailureMode.toLowerCase()}. High risk of accelerated degradation.`;
      priority = 'High';
      break;
    case 'Critical':
      strategy = 'Corrective'; // Should fix before it breaks, but it's critical
      recommendedAction = `Immediate shutdown recommended. Imminent ${predictedFailureMode.toLowerCase()} failure.`;
      priority = 'Critical';
      break;
    case 'Failure':
      strategy = 'Emergency';
      recommendedAction = `Execute emergency ${predictedFailureMode.toLowerCase()} repair procedures.`;
      priority = 'Critical';
      break;
  }

  return {
    strategy,
    recommendedAction,
    predictedFailureMode,
    priority
  };
}
