import { MachineState } from '../store';
import { BusinessImpact } from './types';

export interface Insight {
  situation: string;
  observation: string;
  recommendation: string;
  severity: 'Healthy' | 'Warning' | 'Critical';
}

export function generateInsight(
  machine: MachineState,
  impact: BusinessImpact
): Insight {
  const { vibrationZone: zone, health, failureProb: pf, name } = machine;
  const formatCurrency = (val: number) => `NGN ${(val / 1000000).toFixed(1)}M`;

  // Priority 2 - Rule-Based Severity Bands (Cascading logic to prevent gaps)
  if (pf >= 70 || zone === 'D') {
    return {
      situation: `${name} requires emergency intervention.`,
      observation: `Weibull P(f) = ${pf.toFixed(1)}%. ISO Zone ${zone}. Temperature ${machine.temperatureC.toFixed(1)}degC.`,
      recommendation: `Execute immediate shutdown. Dispatch maintenance crew immediately. Estimated avoided loss: ${formatCurrency(impact.totalRiskExposure)}.`,
      severity: 'Critical'
    };
  }

  if (pf >= 50 || health < 60) {
    return {
      situation: `${name} degradation is accelerating rapidly.`,
      observation: `Failure probability reached ${pf.toFixed(1)}%. Vibration in Zone ${zone}. Health Index ${health.toFixed(1)}.`,
      recommendation: `Schedule planned shutdown and replacement within 24 hours. Pre-stage spares to avoid ${formatCurrency(impact.totalRiskExposure)} exposure.`,
      severity: 'Critical'
    };
  }

  if (pf >= 15 || zone === 'C' || zone === 'B' || health < 75) {
    return {
      situation: `${name} requires monitoring (Zone ${zone}).`,
      observation: `RMS velocity ${machine.vibrationRms.toFixed(1)} mm/s. Bearing temp ${machine.temperatureC.toFixed(1)}degC. P(f) = ${pf.toFixed(1)}%.`,
      recommendation: `Schedule inspection within 48 hours; pre-stage spares if trend continues.`,
      severity: 'Warning'
    };
  }

  // Default / Healthy Fallback (Zone A + Health > 85 + Pf < 20)
  return {
    situation: `Plant operating normally.`,
    observation: `No anomalies detected across monitored assets. Highest P(f) is ${pf.toFixed(1)}%.`,
    recommendation: `Continue routine monitoring and scheduled lubrication. Next scheduled inspection: 7 days.`,
    severity: 'Healthy'
  };
}
