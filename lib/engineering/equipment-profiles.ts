import { EquipmentProfile } from './types';
import { EQUIPMENT_CATEGORIES } from '../constants';

export const EQUIPMENT_PROFILES: Record<string, EquipmentProfile> = {
  [EQUIPMENT_CATEGORIES.CRUSHER]: {
    category: EQUIPMENT_CATEGORIES.CRUSHER,
    expectedLifeSpanYears: 15,
    baseFailureRate: 0.005,
    sensors: {
      temperature: { min: 60, max: 85, unit: 'degC' },
      vibration: { min: 1, max: 4, unit: 'mm/s' },
      power: { min: 75, max: 90, unit: '%' }
    },
    possibleFailureModes: ['Bearing wear', 'Rotor imbalance', 'Motor overload']
  },
  
  [EQUIPMENT_CATEGORIES.KILN]: {
    category: EQUIPMENT_CATEGORIES.KILN,
    expectedLifeSpanYears: 25,
    baseFailureRate: 0.003,
    sensors: {
      temperature: { min: 250, max: 1400, unit: 'degC' },
      current: { min: 450, max: 800, unit: 'A' },
      power: { min: 80, max: 95, unit: '%' }
    },
    possibleFailureModes: ['Refractory damage', 'Bearing overheating', 'Gear misalignment']
  },
  
  [EQUIPMENT_CATEGORIES.MILL]: {
    category: EQUIPMENT_CATEGORIES.MILL,
    expectedLifeSpanYears: 20,
    baseFailureRate: 0.004,
    sensors: {
      temperature: { min: 70, max: 110, unit: 'degC' },
      vibration: { min: 2, max: 6, unit: 'mm/s' },
      power: { min: 85, max: 100, unit: '%' }
    },
    possibleFailureModes: ['Bearing wear', 'Gear misalignment', 'Motor overload']
  },

  [EQUIPMENT_CATEGORIES.CONVEYOR]: {
    category: EQUIPMENT_CATEGORIES.CONVEYOR,
    expectedLifeSpanYears: 10,
    baseFailureRate: 0.008,
    sensors: {
      vibration: { min: 0.5, max: 2.5, unit: 'mm/s' },
      current: { min: 50, max: 150, unit: 'A' },
    },
    possibleFailureModes: ['Bearing wear', 'Motor overload']
  },

  [EQUIPMENT_CATEGORIES.PACKER]: {
    category: EQUIPMENT_CATEGORIES.PACKER,
    expectedLifeSpanYears: 12,
    baseFailureRate: 0.006,
    sensors: {
      temperature: { min: 40, max: 65, unit: 'degC' },
      power: { min: 60, max: 80, unit: '%' }
    },
    possibleFailureModes: ['Air leakage', 'Valve failure']
  }
};
