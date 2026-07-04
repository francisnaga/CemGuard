import { 
  EQUIPMENT_PROFILES, 
  generateTelemetry, 
  calculateHealthIndex, 
  generateDecision, 
  calculateBusinessImpact, 
  generateExecutiveInsight,
  SimulationContext
} from './lib/engineering';

const profile = EQUIPMENT_PROFILES['Crusher'];

const context: SimulationContext = {
  equipmentId: 'CRUSH-001',
  category: 'Crusher',
  installationDate: new Date('2015-01-01'),
  currentDate: new Date('2026-07-04'),
  currentState: 'Severe Wear',
  plantState: 'Peak Demand',
  environment: {
    ambientTemperature: 42,
    humidity: 80,
    dustLevel: 'High'
  }
};

console.log("=== CEMGUARD SIMULATOR TEST ===");
console.log(`Equipment: ${context.category} (${context.equipmentId})`);
console.log(`State: ${context.currentState} | Plant: ${context.plantState}`);

// 1 & 2. Telemetry Generation (Engine 1 & 2)
const telemetry = generateTelemetry(profile, context);
console.log("\n[Engine 2] Generated Telemetry:", telemetry);

// 3. Reliability Metrics (Engine 3)
const health = calculateHealthIndex(context.currentState);
console.log(`\n[Engine 3] Health Index: ${health}%`);

// 4. Maintenance Decision (Engine 4)
const decision = generateDecision(context.currentState, profile);
console.log("\n[Engine 4] Decision:", decision);

// 5. Business Impact (Engine 5)
const impact = calculateBusinessImpact(decision.strategy, context.category);
console.log("\n[Engine 5] Business Impact:", impact);

// 6. Insight Generation (Engine 6)
const insight = generateExecutiveInsight(context, decision, impact, health);
console.log("\n[Engine 6] Executive Insight:");
console.log(insight);
