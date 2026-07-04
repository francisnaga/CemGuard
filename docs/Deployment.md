# Deployment Guide

CemGuard is designed to be deployed on Vercel for the frontend and Supabase for the backend.

## Prerequisites
- Node.js 18+
- pnpm
- A Supabase Project
- A Vercel Account

## Local Development
1. Clone the repository.
2. Run `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and Anon Key.
4. Run `pnpm dev`

## Production Deployment (Vercel)
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in the Vercel dashboard.
4. Deploy. Vercel will automatically run `next build`.
