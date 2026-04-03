# landing/

Marketing site for OpenMidmarket. Separate Next.js project, independent of `app/`.

## Structure

```
landing/
├── src/app/
│   ├── page.tsx          # Homepage
│   ├── brokers/          # Broker-focused landing page
│   ├── lenders/          # Lender-focused landing page
│   └── owners/           # Owner-focused landing page
├── public/               # Static assets
└── package.json          # Independent dependencies
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase (local)

Local Supabase runs via the [Supabase CLI](https://supabase.com/docs/guides/local-development) and **Docker**. Install [Docker Desktop](https://docs.docker.com/desktop/) (or Docker Engine) so `docker` works on your machine.

```bash
npm run supabase:start
npm run supabase:status
```

- API: `http://127.0.0.1:54321`
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Studio: URL is printed by `supabase status`.

Stop the stack with `npm run supabase:stop`. Rebuild the DB from migrations and `supabase/seed.sql` with `npm run supabase:reset`.

For Next.js env vars, copy `.env.local.example` to `.env.local`. After upgrades or non-default config, run `npm run supabase:status` and align URLs and keys if they differ.

## Notes

- This is an independent Next.js project with its own `.git` history and `node_modules`.
- It shares no code with `app/` — keep it that way.
- Deploy separately from the main app (Vercel project: `openMidmarket-landing`).
