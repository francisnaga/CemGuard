# The Physics & Simulation Engine

CemGuard is built around a deterministic, tick-based physics simulation engine running entirely in the browser via Zustand.

## Core Concepts

### 1. Weibull Reliability
Component lifespans are modeled using the Weibull distribution. The engine tracks `operatingHours` and calculates a dynamic `effectiveEta` (characteristic life). When the `failureProb` (probability of failure) exceeds a threshold, an event is triggered.

### 2. Wait Penalty (Downtime Logistics)
When a component fails, the total downtime is not just the repair time. It includes a "wait penalty". If spares are not available locally (e.g., 14 days lead time), the system imposes a massive downtime penalty representing the time waiting for parts to arrive, severely impacting the business value. This highlights the ROI of holding critical spares.

### 3. Business Impact
The `business-impact-engine.ts` translates physical downtime into financial exposure. It uses nominal throughputs and clinker margins (e.g., NGN 14,200/ton) to calculate the precise revenue lost per hour of downtime, making the "Cost-of-Failure" highly visible to executives.

### 4. Telemetry
The `telemetry-engine.ts` simulates sensors (vibration, temperature). When components degrade, their telemetry drifts from nominal baselines towards critical thresholds, eventually triggering alerts.
