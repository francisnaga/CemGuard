import { BusinessImpact, MaintenanceStrategy } from './types';

// Cost assumptions (realistic Dangote benchmark)
// Cement production: ~450 t/h. 1 ton = 20 bags. Wholesale price ~NGN 6,000/bag -> NGN 120,000/ton.
// 450 t/h * 120,000 = NGN 54,000,000/hr
const HOURLY_PRODUCTION_VALUE = 54_000_000; // NGN /hr
const CO2_EMISSION_PER_RESTART = 15;        // tons CO₂ per cold restart
const REPAIR_BASE_COST = 5_000_000;         // NGN  base parts + labour for standard repair

export function determineMaintenanceStrategy(failureProb: number, delayDays: number = 0): MaintenanceStrategy {
  if (delayDays === 0 && failureProb < 60) return 'Preventive';
  if (failureProb >= 80) return 'Emergency';
  if (failureProb >= 50) return 'Corrective';
  if (failureProb >= 25) return 'Predictive';
  return 'Condition-Based';
}

export function calculateBusinessImpact(
  strategy: MaintenanceStrategy,
  equipmentCategory: string,
  sparesLeadTimeDays: number = 0,
  plannedDelayDays: number = 0
): BusinessImpact {
  
  let downtimeHours = 0;
  let repairCostMultiplier = 1.0;
  let co2ImpactTons = 0;

  const waitPenaltyDays = Math.max(0, sparesLeadTimeDays - plannedDelayDays);
  const waitPenaltyHours = waitPenaltyDays * 24;

  // Continuous degradation penalty: Operating a degraded machine causes secondary damage.
  // We model a 15% repair cost penalty and 10% downtime penalty for every 30 days of delay.
  const delayPenaltyCost = 1.0 + (plannedDelayDays / 30) * 0.15;
  const delayPenaltyTime = 1.0 + (plannedDelayDays / 30) * 0.10;

  // Impact varies heavily by strategy (RCM principle)
  switch (strategy) {
    case 'Preventive':
      downtimeHours = 2; // Strictly 2 hours. You don't take the machine offline while waiting for spares in a preventive scenario.
      repairCostMultiplier = 1.0 * delayPenaltyCost;
      co2ImpactTons = 0; 
      break;
    case 'Condition-Based':
      downtimeHours = 4 + waitPenaltyHours;
      repairCostMultiplier = 1.2 * delayPenaltyCost;
      co2ImpactTons = 2;
      break;
    case 'Predictive':
      downtimeHours = 8 + waitPenaltyHours; 
      repairCostMultiplier = 1.5 * delayPenaltyCost;
      co2ImpactTons = 5;
      break;
    case 'Corrective':
      downtimeHours = 24 + waitPenaltyHours; 
      repairCostMultiplier = 3.0 * delayPenaltyCost; 
      co2ImpactTons = 10;
      break;
    case 'Emergency':
      downtimeHours = 72 + waitPenaltyHours; 
      repairCostMultiplier = 10.0 * delayPenaltyCost; 
      co2ImpactTons = 15; 
      break;
  }

  downtimeHours = Number((downtimeHours).toFixed(1));
  const repairCost = REPAIR_BASE_COST * repairCostMultiplier;
  const productionLossValue = downtimeHours * HOURLY_PRODUCTION_VALUE;
  
  // Priority 1 Fix: Waterfall components must sum exactly to total.
  const revenueLoss = productionLossValue + repairCost;
  const totalRiskExposure = revenueLoss; 

  return {
    downtimeHours,
    productionLossValue,
    revenueLoss,
    co2ImpactTons: Number((downtimeHours * 450 * 0.815).toFixed(1)),
    repairCost,
    totalRiskExposure
  };
}
