import { PlantState, EnvironmentalConditions } from './types';

export interface PlantStressFactors {
  wearMultiplier: number;
  temperatureMultiplier: number;
  powerMultiplier: number;
}

export function getPlantStateMultipliers(
  state: PlantState,
  env: EnvironmentalConditions
): PlantStressFactors {
  let wear = 1.0;
  let temp = 1.0;
  let power = 1.0;

  // Plant State Base Impact
  switch (state) {
    case 'Normal Production':
      break;
    case 'High Production':
      wear = 1.2;
      temp = 1.05;
      power = 1.1;
      break;
    case 'Peak Demand':
      wear = 1.5;
      temp = 1.15;
      power = 1.25;
      break;
    case 'Maintenance Shutdown':
      wear = 0.0;
      temp = 0.5; // Cooling down
      power = 0.1;
      break;
    case 'Emergency Shutdown':
      wear = 0.0;
      temp = 0.8;
      power = 0.0;
      break;
  }

  // Environmental Impact
  if (env.ambientTemperature > 35) {
    temp += (env.ambientTemperature - 35) * 0.01; // E.g., 40C adds 0.05 to temp multiplier
    wear += 0.05;
  }
  
  if (env.dustLevel === 'High') {
    wear += 0.1;
    temp += 0.05;
  } else if (env.dustLevel === 'Severe') {
    wear += 0.25;
    temp += 0.1;
  }

  return {
    wearMultiplier: wear,
    temperatureMultiplier: temp,
    powerMultiplier: power,
  };
}

export function calculateOEE(availability: number, performance: number, quality: number): number {
  return availability * performance * quality;
}
