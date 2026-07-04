# Database Schema & Security

CemGuard uses Supabase (PostgreSQL) for authentication and data storage.

## Roles & Authentication
We use Supabase Auth for managing user sessions. Users can be categorized into typical plant roles (Executive, Plant Manager, Reliability Engineer, Maintenance Manager), though currently this role is selected directly in the dashboard UI for demonstration purposes.

## Security (Row Level Security - RLS)
The database uses Supabase RLS to enforce security at the database layer.
- `SELECT` is allowed for authenticated users.
- `INSERT` / `UPDATE` is allowed for authenticated users to manage incidents and metrics.
- `DELETE` is heavily restricted or denied to prevent accidental data loss in the prototype.

## Seed Data
The application is pre-seeded with sample machinery metrics, alerts, and historical incidents (in `scripts/seed-admin.ts`) to provide a rich demonstration of the platform's predictive capabilities upon first login.
