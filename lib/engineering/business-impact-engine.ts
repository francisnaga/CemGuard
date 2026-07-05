import { BusinessImpact, MaintenanceStrategy } from './types';

// Cost assumptions (representative, documented)
// Cement production: ~450 t/h, wholesale price ~NGN 5,500/ton → NGN 2,475,000/hr ≈ NGN 2.5M/hr
// Source: Representative industry benchmark (calibrate with actual historian data)
const HOURLY_PRODUCTION_VALUE = 2_500_000; // NGN /hr
const CO2_EMISSION_PER_RESTART = 15;        // tons CO₂ per cold restart
const REPAIR_BASE_COST = 5_000_000;         // NGN  base parts + labour for standard repair

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

  // Impact varies heavily by strategy (RCM principle)
  switch (strategy) {
    case 'Preventive':
      downtimeHours = 2 + waitPenaltyHours; // Quick scheduled inspection
      repairCostMultiplier = 1.0;
      co2ImpactTons = 0; // No cold restart needed
      break;
    case 'Condition-Based':
      downtimeHours = 4 + waitPenaltyHours;
      repairCostMultiplier = 1.2;
      co2ImpactTons = 2;
      break;
    case 'Predictive':
      downtimeHours = 8 + waitPenaltyHours; // Planned targeted repair
      repairCostMultiplier = 1.5;
      co2ImpactTons = 5;
      break;
    case 'Corrective':
      downtimeHours = 24 + waitPenaltyHours; // Unplanned, waiting for parts
      repairCostMultiplier = 3.0; // Overtime, expedited shipping
      co2ImpactTons = 10;
      break;
    case 'Emergency':
      downtimeHours = 72 + waitPenaltyHours; // Catastrophic failure + waiting for parts
      repairCostMultiplier = 10.0; // Massive collateral damage
      co2ImpactTons = 15; // Full cold restart

      break;
  }

  // Multiply by equipment criticality (Kiln takes longer than Conveyor)
  let categoryMultiplier = 1.0;
  if (equipmentCategory === 'Kiln') categoryMultiplier = 5.0;
  if (equipmentCategory === 'Mill') categoryMultiplier = 3.0;

  downtimeHours *= categoryMultiplier;
  const repairCost = REPAIR_BASE_COST * repairCostMultiplier * categoryMultiplier;
  const productionLossValue = downtimeHours * HOURLY_PRODUCTION_VALUE;
  
  // Priority 1 Fix: Waterfall components must sum exactly to total.
  const revenueLoss = productionLossValue + repairCost;
  const totalRiskExposure = revenueLoss; 

  return {
    downtimeHours,
    productionLossValue,
    revenueLoss,
    co2ImpactTons: co2ImpactTons * categoryMultiplier,
    repairCost,
    totalRiskExposure
  };
}
