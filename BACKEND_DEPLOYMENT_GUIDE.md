# Deployment Guide

Step-by-step for **local development** and **Vercel production**, based on `package.json`, `vercel.json`, and `tsconfig.vercel.json`.

---

## Environment variables

Set in `.env` (local) and Vercel Project Settings (production):

| Variable | Required | Purpose |
|----------|----------|---------|
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_USERNAME` | Yes | DB user |
| `DB_PASSWORD` | Yes | DB password |
| `DB_DATABASE` | Yes | Database name |
| `DB_PORT` | Yes | Port (e.g. 5432) |
| `AT_SECRET` | Yes | Access JWT signing |
| `RT_SECRET` | Yes | Refresh JWT signing |
| `PORT` | Local optional | Default 3000 |

Email (nodemailer) — configure per `auth/email/` (not in schema).

**Note:** README may mention `JWT_ACCESS_SECRET`; **code uses `AT_SECRET` and `RT_SECRET`.**

---

## Local development

```bash
npm install          # runs prisma generate
npx prisma generate  # if needed
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`

Entry: `src/main.ts` → `configureApp` → `listen`.

---

## Production build (Vercel)

```bash
npm run vercel-build
```

Equivalent to:

1. `nest build -p tsconfig.vercel.json` — compiles to `dist/`, **excludes `src/main.ts`**.
2. `mkdir public` — satisfies `outputDirectory` in `vercel.json`.

### Why exclude `main.ts`?

Vercel must use **serverless handler**, not a standalone HTTP listener. Including `main.ts` could confuse entrypoints; serverless path is:

```
api/index.ts → dist/src/serverless.js
```

### Why `dist/src/main.js` caused failures (historical)

If deployment ran `node dist/src/main.js` as a serverless function:

- It tries to `listen()` on a port inside a non-long-running lambda.
- Wrong export shape for Vercel (`default handler` expected).
- **Fix:** Only `serverless.ts` default export handles HTTP; `main.ts` is dev-only.

---

## `vercel.json` explained

```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "public",
  "functions": {
    "api/index.ts": {
      "memory": 1024,
      "maxDuration": 30,
      "includeFiles": "{dist/**,generated/**}"
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
}
```

| Field | Meaning |
|-------|---------|
| `buildCommand` | Build Nest + Prisma client into `dist` |
| `outputDirectory` | Static output (minimal `public/`) |
| `functions` | Node 20 function config |
| `includeFiles` | Bundle compiled app + generated Prisma |
| `rewrites` | All routes to one Nest app |

---

## `api/index.ts`

```typescript
import handler from '../dist/src/serverless';
export default handler;
```

Vercel runs this file. **Must deploy after build** so `dist` exists.

---

## `tsconfig.vercel.json`

Extends build config but excludes:

- `src/main.ts`
- `scripts/`, tests, seeds

Ensures serverless bundle is lean and correct entry.

---

## Deploy checklist

- [ ] All env vars set on Vercel
- [ ] PostgreSQL allows Vercel IP / SSL
- [ ] `npm run vercel-build` succeeds locally
- [ ] `generated/prisma` present after install
- [ ] Frontend `VITE_API_URL` points to deployment root
- [ ] Test `GET /health`
- [ ] Test `GET /docs`
- [ ] Test sign-in + authenticated `GET /employees`

---

## Swagger in production

- UI: `https://<your-app>.vercel.app/docs`
- JSON: `https://<your-app>.vercel.app/docs-json`

Do **not** use `/api/docs` — conflicts with Vercel `/api` function routing.

---

## Frontend CORS

Allowed origins (in `app.config.ts`):

- `http://localhost:5173`
- `https://hrdashboardai.netlify.app`

Add new frontends to `ALLOWED_ORIGINS` before deploy.

---

## Post-deploy monitoring

Watch for:

1. Cold start latency
2. Postgres connection count
3. 401 spikes (token TTL / refresh bugs)
4. 500 on Prisma connection errors

See [BACKEND_RUNTIME_ISSUES.md](./BACKEND_RUNTIME_ISSUES.md).

---

## Scripts folder

`scripts/master-seed.ts`, `db_init.ts`, etc. are **not** deployed to Vercel (excluded). Run locally against dev DB only — they consume connections and can cause “too many clients” if run while production is under load on same database.
