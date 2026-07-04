# CemGuard

**Intelligent Reliability Decision Support Platform for Cement Manufacturing**

## Project Vision & Problem Statement
Dangote Cement operates critical equipment (Crushers, Kilns, Mills, Conveyors). Unexpected failures result in lost production, higher maintenance costs, and safety risks. 
CemGuard's mission is to create a modern industrial platform that enables maintenance engineers and plant managers to monitor equipment health, analyze reliability trends, simulate maintenance decisions, and understand business impact using engineering-based simulated telemetry.

## Objectives
- Predict equipment failures using rigorous engineering calculations (Palmgren-Miner, Weibull Reliability).
- Provide an enterprise-grade dark-themed dashboard inspired by Palantir and Honeywell Forge.
- Replace manual reactive maintenance with proactive simulation.

## Architecture

We are utilizing a **100% Next.js Full-Stack Architecture**.

### Why Next.js Full Stack?
A single monolith reduces operational complexity, aligns frontend and backend deployments, and enables seamless typing between client and server via TypeScript.

### Why Server Actions?
Server Actions co-locate business logic tightly with the frontend forms, drastically reducing boilerplate API layers while maintaining security boundaries.

### Why Supabase & PostgreSQL?
Supabase provides an open-source Firebase alternative with the robust relational power of PostgreSQL, built-in Auth, and Row Level Security, perfect for enterprise data.

### Why Vercel?
Vercel offers zero-configuration edge deployments optimized specifically for Next.js, handling scaling and global distribution automatically.

### Trade-offs, Scalability & Security
- **Trade-offs**: A monolith couples the frontend and backend, which can slow down build times as the project grows compared to microservices.
- **Scalability**: Next.js deployed on Vercel scales limitlessly on the frontend. Supabase handles database scaling via connection pooling.
- **Security**: Supabase Auth combined with Next.js Middleware ensures robust route protection.

## Technology Stack
- Next.js 15 (App Router, Server Actions)
- TypeScript, TailwindCSS, shadcn/ui
- TanStack Query & Table, Recharts, Framer Motion
- Supabase (PostgreSQL, Auth, Storage)
- pnpm, ESLint, Prettier, Husky

## Folder Structure
```
CemGuard/
├── actions/           # Next.js Server Actions
├── app/               # Next.js App Router (Pages & Layouts)
├── components/        # Reusable UI components
├── docs/              # Engineering documentation
├── features/          # Domain-specific modules
├── hooks/             # Custom React hooks
├── lib/               # Third-party configurations
├── public/            # Static assets
├── services/          # External integrations
├── styles/            # Global CSS
├── supabase/          # Supabase configuration
├── types/             # Global TypeScript definitions
└── utils/             # Helper functions
```

## Development Workflow
1. Create a feature branch.
2. Develop using standard Next.js conventions (`pnpm dev`).
3. Commit using Conventional Commits (enforced by Husky).
4. Create a Pull Request for review.

## Installation & Deployment
```bash
# Install dependencies
pnpm install

# Setup env variables (see .env.example)
cp .env.example .env.local

# Run development server
pnpm dev
```
Deployment is handled automatically via Vercel GitHub integration.

## License
Proprietary - Dangote Cement Plc Proof of Concept.
