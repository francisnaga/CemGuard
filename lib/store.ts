/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { PlantState, QueueItem } from './engineering/types';
import { 
  calculateVibration, 
  calculateBearingTemperature, 
  calculatePower, 
  calculateFailureProbability, 
  calculateHealthIndex, 
  calculateMassFlow,
  calculateWearAccumulation,
  calculateOEE,
  PhysicsParams 
} from './engineering/physics-engine';

// Module-level ref so interval cannot leak across pause/start cycles
let dtIntervalRef: number | null = null;

export interface EventLogItem {
  id: string;
  time: string;
  category: 'Information' | 'Warning' | 'Maintenance' | 'Critical';
  code: string;
  message: string;
}

export interface HistorySnapshot {
  time: number; // dtClock
  throughput: number;
  oee: number;
  health: number;
  failureProb: number;
  machines: { id: string; vibrationRms: number; temperatureC: number; failureProb: number }[];
}


export interface MachineState {
  id: string;
  name: string;
  health: number;
  availability: number;
  utilization: number;
  efficiency: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  power: number;
  
  // Phase 9: Engineering Physics Properties
  operatingHours: number;
  rpm: number;
  torqueNm: number;
  loadFactor: number;
  wearAccumulation: number;
  baseEta: number;
  beta: number;
  
  // Calculated dynamic state
  vibrationRms: number;
  vibrationZone: string;
  temperatureC: number;
  failureProb: number;
  failureProbLower: number;
  failureProbUpper: number;
  throughputCapacity: number; // Max tons per hour
}

export interface PlantProfile {
  id: string;
  name: string;
  capacity: number;
  budget: string;
  energyBaseline: number;
}

export const PLANT_PROFILES: PlantProfile[] = [
  { id: 'obajana', name: 'Obajana Plant', capacity: 13250, budget: 'NGN 850M', energyBaseline: 12.4 },
  { id: 'ibese', name: 'Ibese Plant', capacity: 12000, budget: 'NGN 780M', energyBaseline: 11.2 },
  { id: 'gboko', name: 'Gboko Plant', capacity: 4000, budget: 'NGN 320M', energyBaseline: 4.1 },
  { id: 'okpella', name: 'Okpella Plant', capacity: 3000, budget: 'NGN 210M', energyBaseline: 3.2 },
];

interface DashboardState {
  currentView: 'Executive' | 'Plant Manager' | 'Reliability Engineer' | 'Maintenance Manager';
  isAlertOpen: boolean;
  simulationDay: number;
  plantState: PlantState;
  presentationMode: boolean;
  selectedPlant: string;
  isReplayingIncident: boolean;

  dtClock: number; 
  dtIsRunning: boolean;
  dtThroughputNominal: number;
  dtThroughputCurrent: number;
  dtThroughputEfficiency: number;
  dtEnergyTarget: number;
  dtEnergyCurrent: number;
  dtCO2Target: number;
  dtCO2Current: number;
  dtMachines: MachineState[];
  dtEvents: EventLogItem[];
  dtCrewStatus: {
    name: string;
    status: 'Available' | 'Assigned' | 'Working';
    target: string;
    eta: number;
    priority: string;
  };
  dtBottleneck: { machine: string; reason: string; loss: number } | null;
  dtHistory: HistorySnapshot[];
  dtTickets: import('@/lib/engineering/types').QueueItem[];
  selectedMachineIdForTwin: string | null;

  setCurrentView: (view: 'Executive' | 'Plant Manager' | 'Reliability Engineer' | 'Maintenance Manager') => void;
  loadScenario: (scenario: 'Healthy Plant' | 'Progressive Wear' | 'Imminent Failure' | 'Emergency Shutdown') => void;
  setAlertOpen: (isOpen: boolean) => void;

  setSimulationDay: (day: number) => void;
  setPlantState: (state: PlantState) => void;
  togglePresentationMode: () => void;
  setSelectedPlant: (plant: string) => void;
  startIncidentReplay: () => void;

  dtStart: () => void;
  dtPause: () => void;
  dtReset: () => void;
  dtTick: () => void;
  resolveTicket: (ticketId: string) => void;
  openDigitalTwin: (machineId: string) => void;
  closeDigitalTwin: () => void;
}

const initialMachines: MachineState[] = [
  { 
    id: 'crusher', name: 'Crusher', health: 91, availability: 98, utilization: 85, efficiency: 96, risk: 'Low', power: 835,
    operatingHours: 4200, rpm: 750, torqueNm: 12500, loadFactor: 0.85, wearAccumulation: 0.8, baseEta: 18000, beta: 2.5,
    vibrationRms: 2.2, vibrationZone: 'A', temperatureC: 45.0, failureProb: 4.5, failureProbLower: 4.0, failureProbUpper: 5.0, throughputCapacity: 600
  },
  { 
    id: 'rawmill', name: 'Raw Mill', health: 88, availability: 95, utilization: 82, efficiency: 90, risk: 'Low', power: 1700,
    operatingHours: 6500, rpm: 900, torqueNm: 22000, loadFactor: 0.82, wearAccumulation: 1.1, baseEta: 25000, beta: 2.0,
    vibrationRms: 2.4, vibrationZone: 'A', temperatureC: 52.0, failureProb: 6.5, failureProbLower: 5.9, failureProbUpper: 7.1, throughputCapacity: 500
  },
  { 
    id: 'kiln', name: 'Kiln', health: 95, availability: 99, utilization: 95, efficiency: 92, risk: 'Low', power: 295,
    operatingHours: 8200, rpm: 3.5, torqueNm: 850000, loadFactor: 0.95, wearAccumulation: 0.5, baseEta: 40000, beta: 1.8,
    vibrationRms: 2.0, vibrationZone: 'A', temperatureC: 65.0, failureProb: 4.2, failureProbLower: 3.9, failureProbUpper: 4.5, throughputCapacity: 450
  },
  { 
    id: 'cooler', name: 'Cooler', health: 85, availability: 97, utilization: 90, efficiency: 88, risk: 'Low', power: 56,
    operatingHours: 6000, rpm: 120, torqueNm: 5000, loadFactor: 0.90, wearAccumulation: 0.9, baseEta: 22000, beta: 2.2,
    vibrationRms: 2.3, vibrationZone: 'A', temperatureC: 48.0, failureProb: 5.8, failureProbLower: 5.2, failureProbUpper: 6.4, throughputCapacity: 450
  },
  { 
    id: 'cementmill', name: 'Cement Mill', health: 92, availability: 96, utilization: 88, efficiency: 94, risk: 'Low', power: 1950,
    operatingHours: 4200, rpm: 900, torqueNm: 24000, loadFactor: 0.88, wearAccumulation: 0.6, baseEta: 25000, beta: 2.0,
    vibrationRms: 2.1, vibrationZone: 'A', temperatureC: 46.0, failureProb: 3.8, failureProbLower: 3.4, failureProbUpper: 4.2, throughputCapacity: 520
  },
  { 
    id: 'packing', name: 'Packing', health: 98, availability: 99, utilization: 75, efficiency: 98, risk: 'Low', power: 94,
    operatingHours: 1100, rpm: 1500, torqueNm: 800, loadFactor: 0.75, wearAccumulation: 0.2, baseEta: 30000, beta: 1.5,
    vibrationRms: 1.7, vibrationZone: 'A', temperatureC: 38.0, failureProb: 1.0, failureProbLower: 0.9, failureProbUpper: 1.1, throughputCapacity: 650
  },
];

export const initialTickets: QueueItem[] = [
  {
    id: 'old-1',
    equipment: 'Conveyor B',
    priority: 'Low',
    strategy: 'Preventive',
    failureMode: 'Roller Inspection',
    confidence: 95,
    deadline: 'Past',
    status: 'Ended',
    createdAt: 28, // Sometime before start
    day: 1
  }
];

export const useStore = create<DashboardState>((set, get) => {
  // Generate synthetic warm-up history for the last 30 ticks
  const warmupHistory: HistorySnapshot[] = [];
  for (let i = 0; i < 30; i++) {
    // Generate deterministic baseline history based on initial state
    const t = 2 + i;
    const sineVariation = Math.sin(t * 0.5) * 2; // Deterministic small fluctuation
    warmupHistory.push({
      time: t,
      throughput: 440 + sineVariation * 3, // ~434 to 446
      oee: 92 + sineVariation, // ~90 to 94
      health: 93 - (30 - i) * 0.05,
      failureProb: 8 + (30 - i) * 0.1
    });
  }

  return {
  currentView: 'Executive',
  isAlertOpen: false,
  simulationDay: 1,
  plantState: 'Normal Production',
  presentationMode: false,
  selectedPlant: 'Obajana Plant',
  isReplayingIncident: false,

  dtClock: 32, // Start at 08:00 (32 * 15m)
  dtIsRunning: false,
  dtThroughputNominal: 450, 
  dtThroughputCurrent: 427,
  dtThroughputEfficiency: 95,
  dtEnergyTarget: 4.1,
  dtEnergyCurrent: 4.2,
  dtCO2Target: 810,
  dtCO2Current: 815,
  dtMachines: initialMachines,
  dtEvents: [
    { id: '1', time: '08:00', category: 'Information', code: 'OPS-087', message: 'Production day started. Baseline calculations initialized.' }
  ],
  dtCrewStatus: {
    name: 'Crew Alpha',
    status: 'Available',
    target: 'None',
    eta: 0,
    priority: 'None'
  },
  dtBottleneck: null,
  dtHistory: warmupHistory,
  dtTickets: initialTickets,

  setCurrentView: (view) => set({ currentView: view }),
  loadScenario: (scenario) => {
    const newMachines = JSON.parse(JSON.stringify(initialMachines));
    const crusher = newMachines.find((m: any) => m.id === 'crusher');
    const newEvents = [...get().dtEvents];
    let newClock = get().dtClock;
    const newCrew = { name: 'Crew Alpha', status: 'Available', target: 'None', eta: 0, priority: 'None' } as any;
    let newBottleneck = null;

    if (scenario === 'Healthy Plant') {
      newClock = 32;
    } else if (scenario === 'Progressive Wear') {
      newClock = 45;
      crusher.wearAccumulation += 3.5;
      crusher.operatingHours += 2500;
      newEvents.unshift({ id: Math.random().toString(36).substring(2, 11), time: '11:15', category: 'Warning', code: 'WEAR-022', message: 'Crusher showing progressive wear patterns.' });
    } else if (scenario === 'Imminent Failure') {
      newClock = 50;
      crusher.wearAccumulation += 5.5;
      crusher.operatingHours += 4000;
      newEvents.unshift({ id: Math.random().toString(36).substring(2, 11), time: '12:30', category: 'Critical', code: 'VIB-101', message: 'Crusher RMS Vibration rapidly increasing.' });
    } else if (scenario === 'Emergency Shutdown') {
      newClock = 52;
      crusher.wearAccumulation += 8.0;
      crusher.availability = 0;
      crusher.utilization = 0;
      crusher.loadFactor = 0;
      newBottleneck = { machine: 'Crusher', reason: 'Bearing failure & Emergency Shutdown', loss: 100 };
      newEvents.unshift({ id: Math.random().toString(36).substring(2, 11), time: '13:00', category: 'Critical', code: 'INC-014', message: 'Emergency shutdown initiated. Bearing failure predicted.' });
    }

    set({ 
      dtClock: newClock,
      dtMachines: newMachines,
      dtEvents: newEvents,
      dtCrewStatus: newCrew,
      dtBottleneck: newBottleneck,
      dtTickets: initialTickets
    });
  },
  resolveTicket: (ticketId) => {
    set((state) => {
      const newTickets = state.dtTickets.map(t => 
        t.id === ticketId ? { ...t, status: 'Ended' as const } : t
      );
      
      const ticket = state.dtTickets.find(t => t.id === ticketId);
      if (!ticket) return { dtTickets: newTickets };

      const newMachines = state.dtMachines.map(m => {
        if (m.name === ticket.equipment) {
          // Reset machine to healthy baseline
          return {
            ...m,
            health: 95,
            vibrationRms: 2.0,
            vibrationZone: 'A',
            temperatureC: 45.0,
            failureProb: 5.0,
            wearAccumulation: 0.1,
            availability: 98,
            utilization: 90,
            loadFactor: 0.85
          };
        }
        return m;
      });

      return {
        dtTickets: newTickets,
        dtMachines: newMachines
      };
    });
  },
  openDigitalTwin: (machineId) => set({ selectedMachineIdForTwin: machineId }),
  closeDigitalTwin: () => set({ selectedMachineIdForTwin: null }),
  setAlertOpen: (isOpen) => set({ isAlertOpen: isOpen }),
  setSimulationDay: (day) => set({ simulationDay: day }),
  setPlantState: (state) => set({ plantState: state }),
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),
  setSelectedPlant: (plant) => set({ selectedPlant: plant }),

  startIncidentReplay: () => {
    if (get().isReplayingIncident) return;
    set({ isReplayingIncident: true, simulationDay: 1, plantState: 'Normal Production' });

    let currentDay = 1;
    const interval = setInterval(() => {
      currentDay += 1;
      if (currentDay > 30) {
        clearInterval(interval);
        set({ isReplayingIncident: false });
        return;
      }
      let newState: PlantState = 'Normal Production';
      if (currentDay >= 8 && currentDay < 15) newState = 'High Production';
      if (currentDay >= 15 && currentDay < 22) newState = 'Peak Demand';
      if (currentDay >= 22 && currentDay < 28) newState = 'Peak Demand';
      if (currentDay >= 28 && currentDay <= 29) newState = 'Emergency Shutdown';
      if (currentDay === 30) newState = 'Normal Production';
      set({ simulationDay: currentDay, plantState: newState });
    }, 1500);
  },

  dtStart: () => {
    if (get().dtIsRunning || dtIntervalRef !== null) return;
    set({ dtIsRunning: true });
    dtIntervalRef = window.setInterval(() => { get().dtTick(); }, 1000);
  },

  dtPause: () => {
    if (dtIntervalRef !== null) { window.clearInterval(dtIntervalRef); dtIntervalRef = null; }
    set({ dtIsRunning: false });
  },

  dtReset: () => {
    if (dtIntervalRef !== null) { window.clearInterval(dtIntervalRef); dtIntervalRef = null; }
    set({
      dtIsRunning: false,
      dtClock: 32,
      dtMachines: JSON.parse(JSON.stringify(initialMachines)), 
      dtThroughputCurrent: 427,
      dtThroughputEfficiency: 95,
      dtEnergyCurrent: 4.2,
      dtCO2Current: 815,
      dtEvents: [{ id: '1', time: '08:00', category: 'Information', code: 'OPS-087', message: 'Simulation reset. Baseline calculations initialized.' }],
      dtCrewStatus: { name: 'Crew Alpha', status: 'Available', target: 'None', eta: 0, priority: 'None' },
      dtBottleneck: null,
      dtHistory: warmupHistory,
      dtTickets: initialTickets
    });
  },

  dtTick: () => {
    const { dtClock, dtMachines, dtEvents, dtCrewStatus, dtHistory } = get();
    // Increment clock (simulating 15-minute intervals per tick)
    const newClock = dtClock + 1;
    
    const hours = Math.floor(newClock * 15 / 60).toString().padStart(2, '0');
    const mins = ((newClock * 15) % 60).toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    const newEvents = [...dtEvents];
    let newCrew = { ...dtCrewStatus };
    
    // 1. Process individual machines via Physics Engine
    const updatedMachines = dtMachines.map(m => {
      const machine = { ...m };
      
      const generateTicket = () => {
        if (machine.failureProb > 20) {
          const existingTicket = get().dtTickets.find(t => t.equipment === machine.name && (t.status === 'Pending' || t.status === 'Scheduled' || t.status === 'In Progress'));
          if (!existingTicket) {
            const newTicket: import('@/lib/engineering/types').QueueItem = {
              id: `tkt-${Math.random().toString(36).substring(2, 8)}`,
              equipment: machine.name,
              priority: machine.risk,
              strategy: machine.failureProb > 70 ? 'Emergency' : machine.failureProb > 50 ? 'Corrective' : 'Predictive',
              failureMode: machine.vibrationZone === 'D' || machine.vibrationZone === 'C' 
                ? `High Vibration (Zone ${machine.vibrationZone})` 
                : machine.temperatureC > 85 
                  ? `Overheating (${machine.temperatureC.toFixed(1)}degC)`
                  : 'Degraded Health',
              confidence: Math.max(10, Math.round(100 - (machine.failureProbUpper - machine.failureProbLower))),
              deadline: machine.failureProb > 80 ? `Immediate` : `Within ${Math.max(1, Math.round((80 - machine.failureProb) / 2))} Days`,
              status: 'Pending',
              createdAt: dtClock,
              day: get().simulationDay
            };
            // Schedule state update to add ticket
            setTimeout(() => {
              set((state) => ({ dtTickets: [...state.dtTickets, newTicket] }));
            }, 0);
          } else {
              // update existing ticket priority if it worsens
              if (machine.risk === 'Critical' && existingTicket.priority !== 'Critical') {
                  setTimeout(() => {
                      set((state) => ({
                          dtTickets: state.dtTickets.map(t => t.id === existingTicket.id ? { ...t, priority: 'Critical', strategy: 'Emergency', deadline: 'Immediate' } : t)
                      }));
                  }, 0);
              }
          }
        }
      };

      // If machine is offline due to failure, freeze its state so it doesn't "heal" itself
      if (machine.availability === 0) {
        machine.failureProb = 100;
        machine.failureProbLower = 100;
        machine.failureProbUpper = 100;
        machine.health = 0;
        machine.risk = 'Critical';
        machine.vibrationZone = 'D';
        generateTicket();
        return machine;
      }
      
      // Advance operating hours (0.25 hrs per tick)
      if (machine.utilization > 0) {
        machine.operatingHours += 0.25;
        // Archard's Wear Law
        machine.wearAccumulation = calculateWearAccumulation(machine.wearAccumulation, machine.loadFactor, machine.rpm);
      }


      const params: import('@/lib/engineering/physics-engine').PhysicsParams = {
        operatingHours: machine.operatingHours,
        rpm: machine.rpm,
        torqueNm: machine.torqueNm,
        loadFactor: machine.loadFactor,
        wearAccumulation: machine.wearAccumulation,
        ambientTempC: 35.0,
        baseEta: machine.baseEta,
        beta: machine.beta
      };

      // Calculate Electrical Power
      machine.power = calculatePower(params);

      // Vibration
      const vibResult = calculateVibration(params);
      machine.vibrationRms = vibResult.rms;
      
      if (vibResult.zone !== machine.vibrationZone && vibResult.zone === 'C') {
        newEvents.unshift({ 
          id: Math.random().toString(36).substring(2, 11), time: timeStr, category: 'Warning', code: 'VIB-101', 
          message: `${machine.name} RMS Vibration reached ${vibResult.rms} mm/s (ISO 20816 Zone C)` 
        });
      }
      if (vibResult.zone !== machine.vibrationZone && vibResult.zone === 'D') {
        newEvents.unshift({ 
          id: Math.random().toString(36).substring(2, 11), time: timeStr, category: 'Critical', code: 'VIB-999', 
          message: `${machine.name} RMS Vibration reached ${vibResult.rms} mm/s (ISO 20816 Zone D)` 
        });
      }
      machine.vibrationZone = vibResult.zone;

      // Temperature
      machine.temperatureC = calculateBearingTemperature(params, machine.vibrationRms);
      
      if (machine.temperatureC > 85 && m.temperatureC <= 85) {
        newEvents.unshift({ id: Math.random().toString(36).substring(2, 11), time: timeStr, category: 'Warning', code: 'TMP-045', message: `${machine.name} Bearing Temperature exceeded 85degC.` });
      }

      // Weibull
      const probResult = calculateFailureProbability(params, machine.vibrationRms, machine.temperatureC);
      machine.failureProb = probResult.prob;
      machine.failureProbLower = probResult.lowerCI;
      machine.failureProbUpper = probResult.upperCI;

      if (machine.failureProb > 60) machine.risk = 'Critical';
      else if (machine.failureProb > 40) machine.risk = 'High';
      else if (machine.failureProb > 20) machine.risk = 'Medium';
      else machine.risk = 'Low';

      // Composite Health
      machine.health = calculateHealthIndex(params, machine.vibrationRms, machine.temperatureC);

      generateTicket();

      return machine;
    });

    // 2. Cascading Plant Physics & Logic
    const crusher = updatedMachines.find(m => m.id === 'crusher')!;
    const rawmill = updatedMachines.find(m => m.id === 'rawmill')!;
    const kiln = updatedMachines.find(m => m.id === 'kiln')!;
    let newBottleneck = null;

    if (crusher.failureProb > 65 && newCrew.status === 'Available') {
      newEvents.unshift({ 
        id: Math.random().toString(36).substring(2, 11), time: timeStr, category: 'Maintenance', code: 'MAINT-011', 
        message: `Predictive maintenance recommended for Crusher. P(f) = ${crusher.failureProb}%.` 
      });
      newCrew = { name: 'Crew Alpha', status: 'Assigned', target: 'Crusher', eta: 38, priority: 'Critical' };
    }

    if (crusher.failureProb > 90 && crusher.utilization > 0) {
      crusher.availability = 0;
      crusher.utilization = 0;
      crusher.loadFactor = 0;
      crusher.power = 0;
      crusher.torqueNm = 0;
      
      newEvents.unshift({ 
        id: Math.random().toString(36).substring(2, 11), time: timeStr, category: 'Critical', code: 'INC-014', 
        message: `Emergency shutdown initiated. Imminent bearing failure predicted.` 
      });

      newBottleneck = { machine: 'Crusher', reason: 'Bearing failure & Emergency Shutdown', loss: 100 };
    }

    const capacities = {
      crusher: updatedMachines.find(m => m.id === 'crusher')!.throughputCapacity,
      rawmill: updatedMachines.find(m => m.id === 'rawmill')!.throughputCapacity,
      kiln: updatedMachines.find(m => m.id === 'kiln')!.throughputCapacity,
    };
    const utilizations = {
      crusher: updatedMachines.find(m => m.id === 'crusher')!.utilization,
      rawmill: updatedMachines.find(m => m.id === 'rawmill')!.utilization,
      kiln: updatedMachines.find(m => m.id === 'kiln')!.utilization,
    };

    if (crusher.utilization === 0) {
      rawmill.utilization = Math.max(0, rawmill.utilization - 20); 
      kiln.utilization = Math.max(50, kiln.utilization - 10); 
    } else {
      if (rawmill.utilization < 90) rawmill.utilization = Math.min(90, rawmill.utilization + 10);
      if (kiln.utilization < 90) kiln.utilization = Math.min(90, kiln.utilization + 5);
    }

    utilizations.rawmill = rawmill.utilization;
    utilizations.kiln = kiln.utilization;

    const newThroughput = Math.round(calculateMassFlow(capacities, utilizations));
    const throughputRatio = newThroughput / 450; // 450 t/h nominal
    const availabilityRatio = crusher.utilization > 0 ? 0.98 : 0.0;
    const newOEE = calculateOEE(availabilityRatio, Math.min(1, throughputRatio));
    const newEff = Math.round((newThroughput / capacities.kiln) * 100);

    let newEnergy = 4.2;
    let newCO2 = 815;
    if (crusher.utilization === 0) {
      newEnergy = 4.9; 
      newCO2 = 860;
    }

    const currentFleetHealth = Math.round(updatedMachines.reduce((s, m) => s + m.health, 0) / updatedMachines.length);
    const highestFailureProb = Math.max(...updatedMachines.map(m => m.failureProb));

    const newSnapshot: HistorySnapshot = {
      time: newClock,
      throughput: newThroughput,
      oee: newOEE,
      health: currentFleetHealth,
      failureProb: highestFailureProb,
      machines: updatedMachines.map(m => ({
        id: m.id,
        vibrationRms: m.vibrationRms,
        temperatureC: m.temperatureC,
        failureProb: m.failureProb
      }))
    };

    const newHistory = [...dtHistory, newSnapshot];
    if (newHistory.length > 50) newHistory.shift();

    set({
      dtClock: newClock,
      dtMachines: updatedMachines,
      dtEvents: newEvents.slice(0, 50),
      dtCrewStatus: newCrew,
      dtBottleneck: newBottleneck,
      dtThroughputCurrent: newThroughput,
      dtThroughputEfficiency: newEff,
      dtEnergyCurrent: newEnergy,
      dtCO2Current: newCO2,
      dtHistory: newHistory
    });
  }

};
});
