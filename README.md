<div align="center">
  <h1>🏭 CemGuard</h1>
  <p><strong>Predictive Maintenance & Reliability Early-Warning System</strong></p>
  <p><em>Built for continuous-process manufacturing and heavy industry.</em></p>
</div>

<br />

## 📌 Executive Summary
In heavy process industries like cement manufacturing, unplanned equipment failures across critical paths (Crushers, Raw Mills, Kilns, Cement Mills) severely degrade Overall Equipment Effectiveness (OEE), reduce throughput, and trigger cascading production losses. 

**CemGuard** is a high-fidelity Reliability Early-Warning System designed to bridge the gap between mechanical engineering and executive financial oversight. It replaces reactive maintenance with a real-time, physics-based simulation that quantifies machine health, visualizes degradation, and calculates direct business risk exposure in real time.

---

## 🚀 Key Features

### 1. Physics-Engine Driven Digital Twins
Instead of static dashboards, CemGuard features fully interactive, code-generated 3D SVG digital twins.
- **Live Telemetry Binding:** Mechanical animations (rotor RPM, grinding table spin rates) and thermal properties (kiln burner flares) are mathematically bound to live sensor data.
- **Dynamic Physics States:** If a machine's utilization drops to 0%, the internal gears physically halt. If a vibration RMS hits a critical threshold, the entire 3D structural housing vibrates on-screen.

### 2. Cascading Plant-Wide Dynamics
Manufacturing lines operate in series. CemGuard's state engine natively understands continuous process bottlenecks:
- **Upstream Starvation:** If the Raw Mill shuts down, the Kiln gradually throttles back.
- **Downstream Bottlenecks:** If the Packing plant goes offline, the Cement Mill reduces load factor to prevent silo overflow.

### 3. Weibull Failure Probability & Business Risk Matrix
CemGuard abandons generic "Red/Yellow/Green" status lights in favor of rigorous statistical mechanics and financial modeling:
- **Weibull Distribution Analysis:** Calculates the exact, real-time cumulative distribution function $F(t)$ for probability of catastrophic failure based on operational hours and wear accumulation.
- **Escalation Cost Multipliers:** Quantifies the financial penalty of deferred maintenance using the `1.0× / 3.0× / 10.0×` model:
  - **1.0× (Preventive):** Planned outage on your terms.
  - **3.0× (Corrective):** Deferred maintenance resulting in unscheduled downtime.
  - **10.0× (Catastrophic):** Run-to-failure resulting in secondary equipment destruction (e.g., kiln refractory collapse).

---

## 💻 Tech Stack
- **Framework:** Next.js (React)
- **Styling & UI:** Tailwind CSS, `shadcn/ui`, Lucide Icons
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
   
   *Note: To fully experience the physics engine, interact with the "Scenario Control" dropdown in the top right corner to simulate "Progressive Wear", "Imminent Failure", and "Emergency Shutdowns" across the plant.*

---

## 🔒 Security & Privacy Notice
*This is a frontend demonstration prototype built to showcase complex UI physics and statistical state management. The current repository does not include real backend industrial SCADA/PLC integrations and relies on an internal simulation loop.*
