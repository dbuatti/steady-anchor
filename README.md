# Momentum

An adaptive habit tracker designed for ADHD and neurodivergent brains. Built with React, Supabase, and shadcn/ui.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Edge Functions)
- **State:** TanStack React Query
- **Routing:** React Router v6
- **Animation:** Framer Motion

## Getting Started

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Run the dev server:

```bash
pnpm dev
```

## Build

```bash
pnpm build    # production build → dist/
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key |

## Database

Migrations are in `supabase/migrations/`. Apply them in order to your Supabase project.
