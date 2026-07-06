<div align="center">
  <h1>🏭 CemGuard</h1>
  <p><strong>Predictive Maintenance & Reliability Decision Support Platform</strong></p>
  <p><em>Built for continuous-process manufacturing and heavy industry.</em></p>
</div>

<br />

## 📌 Executive Summary
In heavy process industries like cement manufacturing, unplanned equipment failures across critical paths (Crushers, Raw Mills, Kilns, Cement Mills) severely degrade Overall Equipment Effectiveness (OEE), reduce throughput, and trigger cascading production losses. 

**CemGuard** is a high-fidelity Reliability Early-Warning System designed to bridge the gap between the shop floor and the C-suite. It replaces reactive maintenance with a real-time, physics-based simulation that quantifies mechanical health, visualizes degradation, and calculates direct business risk exposure in real time—empowering engineers to make proactive, ROI-driven decisions.

---

## 🚀 Core Platform Features

### 1. Zero Time-to-Value & Persona-Driven UI
CemGuard eliminates traditional enterprise software friction. The dashboard dynamically shapes itself based on the user's role:
- **Executives** see aggregate financial risk and top-level OEE metrics.
- **Reliability Engineers** see high-fidelity Digital Twins and real-time vibration/temperature telemetry.
- **Plant Managers** see the active maintenance queue and plant-wide throughput constraints.

### 2. Physics-Engine Driven Digital Twins
Instead of static dashboards, CemGuard features fully interactive, code-generated 3D SVG digital twins.
- **Live Telemetry Binding:** Mechanical animations (rotor RPM, grinding table spin rates) are mathematically bound to live sensor data.
- **Dynamic Physics States:** If a machine's utilization drops to 0%, the internal gears physically halt. If a vibration RMS hits a critical threshold, the entire 3D structural housing vibrates on-screen.

### 3. Cascading Plant-Wide Dynamics (Theory of Constraints)
Manufacturing lines operate in series. CemGuard's state engine natively understands continuous process bottlenecks:
- **Constraint Modeling:** Global plant throughput is dynamically constrained by the weakest link (`Math.min()` of all asset availabilities). If the Crusher hits 0% availability, the entire downstream line starves instantly, dropping OEE correctly.
- **Actionable Maintenance Loop:** Resolving an issue in the Maintenance Queue resets the root-cause machine's mechanical state back to baseline, which automatically re-calculates the global mass flow and restores plant throughput on the next clock tick.

### 4. Financial Risk Translation Engine
CemGuard abandons generic "Red/Yellow/Green" status lights in favor of rigorous statistical mechanics and financial modeling:
- **Weibull Distribution Analysis:** Calculates the exact, real-time probability of failure $P(f)$ based on operational hours and ISO 10816 vibration parameters.
- **Realistic Economic Benchmarking:** Maps mechanical risk directly to lost revenue. Assumes a realistic 450 t/h output at ₦120,000/ton, calculating exact downtime exposure at **₦54,000,000 per hour** to justify predictive maintenance costs to executives.

---

## 🔮 Enterprise Roadmap (Phase 2 & Beyond)

CemGuard is designed to scale from a predictive dashboard into an autonomous industrial platform. Our future roadmap includes:

1. **ERP & Supply Chain Integration (SAP/Maximo):** Dynamically cross-referencing $P(f)$ with live warehouse inventory and shipping lead times to automatically recommend expediting spare parts via air freight based on daily financial risk.
2. **Prescriptive AI Workflows:** Moving beyond alerts. The system will auto-draft work orders, attach 3D mechanical schematics, and push dispatch notifications directly to the mobile devices of certified technicians.
3. **High-Frequency Edge AI:** Deploying lightweight AI models on the PLC edge to calculate Fast Fourier Transforms (FFT) locally, isolating specific bearing defect frequencies before sending summary telemetry to the cloud.
4. **Stoichiometric Physics & Silo Buffers:** Upgrading the 1:1 mass flow model to include limestone/clinker silos and true thermodynamic mass-loss equations for calcination.

---

## 💻 Tech Stack
- **Framework:** Next.js (React) 
- **State Management:** Zustand (Deterministic 1000ms physics game loop)
- **Styling & UI:** Tailwind CSS (Default Light Mode), `shadcn/ui`, Lucide Icons
- **Data Visualization:** Recharts (Area & Line charts for telemetry trends)
- **Animation Engine:** Pure CSS & SVG `<defs>` (Linear/Radial Gradients, DropShadows)

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (v18.0.0 or higher) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/francisnaga/CemGuard.git
   cd CemGuard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the Dashboard:**
   Open your browser and navigate to `http://localhost:3000`. 
   
   *Note: To fully experience the physics engine, interact with the "Scenario Control" dropdown in the top right corner to simulate "Imminent Failure" and "Emergency Shutdowns" across the plant.*

---

## 🔒 Security & Privacy Notice
*This is a frontend demonstration prototype built to showcase complex UI physics and statistical state management. The current repository does not include real backend industrial SCADA/PLC integrations and relies on an internal deterministic simulation loop.*
