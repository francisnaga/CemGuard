import { EquipmentProfile, SimulationContext, DegradationState } from './types';
import { getPlantStateMultipliers } from './plant-state-engine';

export interface GeneratedTelemetry {
  temperature?: number;
  vibration?: number;
  power?: number;
  current?: number;
}

const DEGRADATION_IMPACT: Record<DegradationState, { valueMultiplier: number, noiseFactor: number }> = {
  'New': { valueMultiplier: 1.0, noiseFactor: 0.01 },
  'Healthy': { valueMultiplier: 1.05, noiseFactor: 0.02 },
  'Minor Wear': { valueMultiplier: 1.15, noiseFactor: 0.05 },
  'Moderate Wear': { valueMultiplier: 1.35, noiseFactor: 0.1 },
  'Severe Wear': { valueMultiplier: 1.6, noiseFactor: 0.15 },
  'Critical': { valueMultiplier: 1.9, noiseFactor: 0.25 },
  'Failure': { valueMultiplier: 0.0, noiseFactor: 0.0 } // 0 when failed
};

export function generateTelemetry(
  profile: EquipmentProfile,
  context: SimulationContext
): GeneratedTelemetry {
  const result: GeneratedTelemetry = {};
  
  const plantStress = getPlantStateMultipliers(context.plantState, context.environment);
  const degradation = DEGRADATION_IMPACT[context.currentState];

  // Equipment Age Model
  const ageInMs = context.currentDate.getTime() - context.installationDate.getTime();
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  // As it approaches its expected life span, values naturally increase (up to +20% base shift)
  const ageMultiplier = 1.0 + (Math.min(ageInYears / profile.expectedLifeSpanYears, 1.5) * 0.2);

  const calculateSensorValue = (min: number, max: number, typeMultiplier: number) => {
    if (context.currentState === 'Failure' || context.plantState === 'Emergency Shutdown') return 0;
    
    // Base normal value is mid-point of profile + some randomness
    const range = max - min;
    const baseValue = min + (range * 0.3); // Sitting at 30% of healthy range normally

    // Apply multipliers: age, degradation severity, plant stress
    const targetValue = baseValue * ageMultiplier * degradation.valueMultiplier * typeMultiplier;

    // Add noise to make charts look real
    // Use the context's currentDate's time for deterministic noise instead of Math.random()
    // This prevents SSR hydration mismatches while still providing variation when time changes in the simulator
    const timeMs = context.currentDate.getTime();
    const pseudoRandom = ((timeMs * 9301 + 49297) % 233280) / 233280; 
    const noise = targetValue * degradation.noiseFactor * (pseudoRandom * 2 - 1);
    
    return Number((targetValue + noise).toFixed(2));
  };

  if (profile.sensors.temperature) {
    result.temperature = calculateSensorValue(
      profile.sensors.temperature.min, 
      profile.sensors.temperature.max, 
      plantStress.temperatureMultiplier
    );
  }
  
  if (profile.sensors.vibration) {
    result.vibration = calculateSensorValue(
      profile.sensors.vibration.min, 
      profile.sensors.vibration.max, 
      plantStress.wearMultiplier // Vibration highly correlated to wear
    );
  }

  if (profile.sensors.power) {
    result.power = calculateSensorValue(
      profile.sensors.power.min, 
      profile.sensors.power.max, 
      plantStress.powerMultiplier
    );
  }

  if (profile.sensors.current) {
    result.current = calculateSensorValue(
      profile.sensors.current.min, 
      profile.sensors.current.max, 
      plantStress.powerMultiplier
    );
  }

  return result;
}
