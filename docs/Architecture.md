# System Architecture

CemGuard is built on a modern Next.js App Router architecture, using React 19 and Tailwind CSS for the frontend, and Supabase (PostgreSQL) for authentication and data persistence.

## Core Technologies
- **Next.js 15**: Handles routing, server-side rendering, and API routes.
- **Zustand**: Manages the complex state of the physics engine (running tick-based simulations in the browser).
- **Tailwind CSS / shadcn/ui**: Provides responsive and accessible styling.
- **Supabase**: Handles User Authentication, Row Level Security, and PostgreSQL database storage.

## The Digital Twin Simulation
Unlike traditional dashboards that just fetch data, CemGuard runs a live, deterministic physics simulation inside the browser using Zustand. This allows the user to see equipment degrade in real-time, test scenarios ("Imminent Failure"), and project Weibull curves forward without round-tripping to a backend for every tick.
