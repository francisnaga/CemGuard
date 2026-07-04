import { calculateWeibullFailureProb } from '../lib/engineering/physics-engine';
import { calculateCostOfFailure } from '../lib/engineering/business-impact-engine';
import { EQUIPMENT_PROFILES } from '../lib/engineering/equipment-profiles';

describe('Physics Engine', () => {
  it('calculates Weibull failure probability correctly', () => {
    // For a brand new machine, probability should be very low
    const p1 = calculateWeibullFailureProb(100, 50000, 1.5);
    expect(p1).toBeGreaterThan(0);
    expect(p1).toBeLessThan(0.01); // Less than 1%

    // Near the ETA (characteristic life), it should be around 63.2%
    const p2 = calculateWeibullFailureProb(50000, 50000, 1.5);
    expect(p2).toBeGreaterThan(0.60);
    expect(p2).toBeLessThan(0.65);
  });
});

describe('Business Impact Engine', () => {
  it('calculates cost of failure', () => {
    const cost = calculateCostOfFailure({
      componentName: 'Main Crusher',
      downtimeHours: 24,
      partsCost: 10_000_000,
      laborCost: 2_000_000,
      isPlanned: false,
    });
    
    // NGN 2.5M/hr * 24h = NGN 60M production loss + 12M repair = 72M total
    expect(cost.totalRiskExposure).toBeGreaterThan(70_000_000);
    expect(cost.isPlanned).toBe(false);
  });

  it('calculates wait penalty correctly for unplanned outages', () => {
    const cost1 = calculateCostOfFailure({
      componentName: 'Main Crusher',
      downtimeHours: 24,
      partsCost: 10_000_000,
      laborCost: 2_000_000,
      isPlanned: false,
      delayDays: 0,
      leadTimeDays: 14 // 14 days waiting for parts
    });

    const waitHours = 14 * 24;
    expect(cost1.downtimeHours).toBe(24 + waitHours);
  });
});
