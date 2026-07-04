import { DegradationState, MaintenanceStrategy } from './types';

// Map Degradation States to a Health Index (0-100)
const HEALTH_MAP: Record<DegradationState, number> = {
  'New': 100,
  'Healthy': 95,
  'Minor Wear': 80,
  'Moderate Wear': 60,
  'Severe Wear': 40,
  'Critical': 20,
  'Failure': 0
};

export function calculateHealthIndex(state: DegradationState): number {
  return HEALTH_MAP[state];
}

// Estimates Remaining Useful Life (in hours) before Failure state
export function calculateRUL(healthIndex: number, ageInYears: number, expectedLifeSpan: number): number {
  if (healthIndex === 0) return 0;
  
  // Base RUL derived from remaining lifespan
  const remainingLifeYears = Math.max(0, expectedLifeSpan - ageInYears);
  const baseRulHours = remainingLifeYears * 365 * 24;

  // Modulate by current health
  // E.g. at 20% health, you only have 5% of your remaining life expectancy before immediate failure
  const healthFactor = Math.pow(healthIndex / 100, 2); 
  
  return Math.round(baseRulHours * healthFactor);
}

// Calculate Weibull probability of failure
export function calculateWeibullProbability(ageInHours: number, eta: number, beta: number): number {
  // P(t) = 1 - e^(-(t/eta)^beta)
  // eta = scale parameter (characteristic life)
  // beta = shape parameter (failure rate behavior: >1 indicates wear-out)
  const prob = 1 - Math.exp(-Math.pow(ageInHours / eta, beta));
  return Number((prob * 100).toFixed(2));
}

// Engine 3b: Maintenance Effectiveness
// Simulates what happens to Health when a specific strategy is applied
export function applyMaintenanceEffectiveness(
  strategy: MaintenanceStrategy, 
  currentState: DegradationState
): DegradationState {
  switch(strategy) {
    case 'Corrective': // Fix when broken, usually doesn't restore to New
    case 'Emergency':
      return 'Minor Wear'; // Doesn't perfectly fix everything
    case 'Predictive': 
    case 'Preventive':
      return 'Healthy'; // Better restoration
    case 'Condition-Based':
      return 'New'; // Assumes targeted perfect replacement
    default:
      return currentState;
  }
}
