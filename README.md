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

## Notes

- This is an independent Next.js project with its own `.git` history and `node_modules`.
- It shares no code with `app/` — keep it that way.
- Deploy separately from the main app (Vercel project: `openMidmarket-landing`).
