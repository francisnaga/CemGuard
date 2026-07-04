// Degradation States
export type DegradationState = 
  | 'New'
  | 'Healthy'
  | 'Minor Wear'
  | 'Moderate Wear'
  | 'Severe Wear'
  | 'Critical'
  | 'Failure';

// Global Plant States
export type PlantState = 
  | 'Normal Production'
  | 'High Production'
  | 'Peak Demand'
  | 'Maintenance Shutdown'
  | 'Emergency Shutdown';

// Maintenance Strategies (RCM)
export type MaintenanceStrategy = 
  | 'Corrective'
  | 'Preventive'
  | 'Predictive'
  | 'Condition-Based'
  | 'Emergency';

// Environmental Conditions
export interface EnvironmentalConditions {
  ambientTemperature: number; // in Celsius
  humidity: number; // Percentage
  dustLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
}

// Failure Modes
export type FailureMode = 
  // Crusher
  | 'Bearing wear'
  | 'Rotor imbalance'
  | 'Motor overload'
  // Kiln
  | 'Refractory damage'
  | 'Bearing overheating'
  | 'Gear misalignment'
  // Compressor/Packer
  | 'Air leakage'
  | 'Oil contamination'
  | 'Valve failure'
  // Generic
  | 'Unknown';

// Sensor Profiles
export interface SensorThresholds {
  min: number;
  max: number;
  unit: string;
}

// Equipment Profile Configuration
export interface EquipmentProfile {
  category: string;
  expectedLifeSpanYears: number; // Used for Equipment Age model
  baseFailureRate: number; // Base rate for Weibull calculation
  sensors: {
    temperature?: SensorThresholds;
    vibration?: SensorThresholds;
    power?: SensorThresholds;
    current?: SensorThresholds;
  };
  possibleFailureModes: FailureMode[];
}

// Simulation Input Model
export interface SimulationContext {
  equipmentId: string;
  category: string;
  installationDate: Date;
  currentDate: Date;
  currentState: DegradationState;
  plantState: PlantState;
  environment: EnvironmentalConditions;
}

// Result of Business Impact Calculation
export interface BusinessImpact {
  downtimeHours: number;
  productionLossValue: number; // e.g. tons lost * value
  revenueLoss: number; // in Naira (₦) or USD
  co2ImpactTons: number; // Emissions from restart/inefficiency
  repairCost: number;
  totalRiskExposure: number;
}
