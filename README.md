<p align="center">
  <img src="public/cemguard-mark.svg" alt="CemGuard Brand Mark" width="100" height="100" />
</p>

<h1 align="center">CemGuard</h1>

<p align="center">
  <strong>Predictive maintenance and industrial reliability decision support platform featuring physics-based digital twins and Weibull failure modeling.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Framework-Next.js%2015-black?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://recharts.org/"><img src="https://img.shields.io/badge/Telemetry-Recharts-22C55E?logo=recharts&logoColor=white" alt="Recharts" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
</p>

---

## Overview

CemGuard is a predictive maintenance and reliability decision-support platform engineered for heavy continuous-process operations (cement manufacturing, marine propulsion plants, refinery grinding mills). In high-throughput industrial plants, unanticipated machine downtime costs upwards of ₦54,000,000 per hour.

CemGuard mathematically binds live sensor telemetry (bearing temperature, tri-axial vibration, motor current draw, rotational torque) to physics-based digital twins and Weibull failure probability distributions, translating raw mechanical metrics into executive risk exposure.

---

## Core Capabilities

- **Interactive Plant Digital Twins**: Vector-rendered SVG schematic digital twins with live thermodynamic and mechanical heatmaps.
- **Weibull Failure Distribution Modeling**: Real-time reliability calculations calculating mean time between failures (MTBF) and time-to-criticality.
- **Executive Risk Translation**: Converts asset health indices into dynamic financial metrics quantifying active revenue risk exposure.
- **Maintenance Strategy Planner**: Prioritized maintenance backlog ranked by economic impact and component lead time.
- **Physics Engine Simulator**: Interactive sandbox enabling plant engineers to model throughput adjustments, lubrication degradation, and emergency shutdowns.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State Management | Zustand |
| Visualization | Recharts / SVG Digital Twins |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/francisnaga/CemGuard.git
   cd CemGuard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

---

## Author

Francis Naga ([Portfolio](https://francisnaga.site) / [GitHub](https://github.com/francisnaga))

---

## License

MIT License. See [LICENSE](LICENSE) for details.
