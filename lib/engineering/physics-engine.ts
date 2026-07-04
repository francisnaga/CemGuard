/**
 * Engineering Simulation Engine
 * Uses standard mechanical equations and empirical models to simulate plant physics.
 */

export interface PhysicsParams {
  operatingHours: number;
  rpm: number;
  torqueNm: number;
  loadFactor: number; // 0.0 to 1.0
  wearAccumulation: number;
  ambientTempC: number;
  baseEta: number; // Characteristic life (hours)
  beta: number;    // Shape parameter
}

// 1. Archard's Wear Law (Simplified Empirical Model)
// Wear Volume = (K * Load * Distance) / Hardness
// K = 5×10⁻⁵ (dimensionless wear coefficient, empirical for steel-on-steel bearings)
export function calculateWearAccumulation(currentWear: number, loadFactor: number, rpm: number): number {
  const K = 0.00005; // Archard wear coefficient (empirical)
  const slidingDistanceFactor = rpm * 0.25; // 0.25 hours per tick
  const deltaWear = K * loadFactor * slidingDistanceFactor;
  return currentWear + deltaWear;
}

// 2. Vibration Physics (ISO 20816-3)
// V_rms(t) = V_0 + k_w*W + k_l*L
export function calculateVibration(params: PhysicsParams): { rms: number, zone: string } {
  const v0 = 1.2; // Baseline healthy vibration (mm/s)
  const kW = 0.8; // Wear coefficient
  const kL = 0.5; // Load coefficient
  
  const rms = v0 + (kW * params.wearAccumulation) + (kL * params.loadFactor);
  const roundedRms = Number(rms.toFixed(2));

  // ISO 20816-3 Zone boundaries for rigid-foundation large machines (Group 2)
  let zone = 'A';
  if (roundedRms > 2.8) zone = 'B';
  if (roundedRms > 4.5) zone = 'C'; // Restricted operation
  if (roundedRms > 7.1) zone = 'D'; // Damage occurs

  return { rms: roundedRms, zone };
}

// 3. Lumped Thermal Model (Bearing Temperature)
// T = T_ambient + k * Q (Q = friction heat generation)
export function calculateBearingTemperature(params: PhysicsParams, vibrationRms: number): number {
  const frictionBase = 0.05;
  // Wear → clearance → misalignment → friction → temp → wear (feedback loop)
  const dynamicFriction = frictionBase * (1 + (vibrationRms / 2.0)); 
  
  const heatGeneration = dynamicFriction * params.loadFactor * params.rpm;
  const coolingFactor = 0.08; 
  
  const temp = params.ambientTempC + (heatGeneration * coolingFactor);
  return Number(temp.toFixed(1));
}

// 4. Mechanical Shaft Power
// P (kW) = τ·ω = Torque (Nm) × LoadFactor × RPM × (2π/60) / 1000
export function calculatePower(params: PhysicsParams): number {
  if (params.loadFactor === 0) return 0;
  const omega = params.rpm * (2 * Math.PI / 60);
  const powerKw = (params.torqueNm * params.loadFactor * omega) / 1000;
  return Number(powerKw.toFixed(1));
}

// 5. Dynamic Weibull Reliability
// F(t) = 1 - exp(-(t/η_eff)^β)
// η_eff degrades via Arrhenius-inspired exponential stress multipliers:
// η_eff = η₀ / (exp(k_t*(T-T_ref)) × exp(k_v*(V-V_ref)))
export function calculateFailureProbability(
  params: PhysicsParams,
  vibrationRms: number,
  tempC: number
): { prob: number, lowerCI: number, upperCI: number } {
  const tempStress = Math.max(1, Math.exp(0.02 * (tempC - 65))); // T_ref = 65°C
  const vibStress  = Math.max(1, Math.exp(0.3  * (vibrationRms - 2.8))); // V_ref = Zone A/B boundary
  
  const effectiveEta = params.baseEta / (tempStress * vibStress);
  const prob = 1 - Math.exp(-Math.pow(params.operatingHours / effectiveEta, params.beta));
  
  // Stochastic variability band (±8% of computed probability)
  const variance = 0.08 * prob;
  
  return {
    prob:     Number((prob * 100).toFixed(1)),
    lowerCI:  Math.max(0,   Number(((prob - variance) * 100).toFixed(1))),
    upperCI:  Math.min(100, Number(((prob + variance) * 100).toFixed(1)))
  };
}

// 6. Composite Condition Monitoring Model (Health Index)
// HI = 100 − (0.40·V_n + 0.30·T_n + 0.15·L_n + 0.15·A_n)
export function calculateHealthIndex(params: PhysicsParams, vibrationRms: number, tempC: number): number {
  const vn = Math.min(1, vibrationRms / 11.0); 
  const tn = Math.min(1, (tempC - 25) / 85); 
  const overloadFactor = Math.max(0, params.loadFactor - 0.9) * 10; // Penalty for L > 0.9
  const ageFactor = Math.min(1, params.operatingHours / params.baseEta);

  const healthLoss = (0.40 * vn) + (0.30 * tn) + (0.15 * overloadFactor) + (0.15 * ageFactor);
  return Math.max(0, Number((100 - healthLoss * 100).toFixed(1)));
}

// 7. OEE = Availability × Performance × Quality
export function calculateOEE(availability: number, throughputRatio: number, qualityRate: number = 0.98): number {
  // availability: 0-1 (uptime / planned time)
  // throughputRatio: 0-1 (actual throughput / nominal throughput)
  // qualityRate: representative constant (cement quality pass rate, typically 0.97-0.99)
  const oee = availability * throughputRatio * qualityRate * 100;
  return Number(oee.toFixed(1));
}

// 8. Mass Flow Balance (Theory of Constraints)
// Plant throughput = min(capacity × utilization) across the production chain
export function calculateMassFlow(capacities: Record<string, number>, utilizations: Record<string, number>): number {
  const actualFlows = Object.keys(capacities).map(key => capacities[key] * (utilizations[key] / 100));
  return Math.min(...actualFlows);
}

// 9. Project Weibull P(f) forward by N hours
// Used by Strategy Planner to show non-linear failure growth
export function projectFailureProbability(
  currentHours: number,
  additionalHours: number,
  effectiveEta: number,
  beta: number
): number {
  const futureHours = currentHours + additionalHours;
  const prob = 1 - Math.exp(-Math.pow(futureHours / effectiveEta, beta));
  return Number((prob * 100).toFixed(1));
}
