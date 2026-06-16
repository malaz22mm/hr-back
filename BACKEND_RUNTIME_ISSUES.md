# Runtime Problems & Solutions

Honest catalog of issues observed or implied by this codebase — for viva and ops discussions.

---

## P2037 / Too many database connections

| | |
|--|--|
| **Symptom** | Intermittent 500s, Prisma connection errors, Postgres logs “too many clients” |
| **Cause** | Many Vercel instances × connections per instance; dev scripts + production sharing DB |
| **Runtime** | Fails under load, fine locally |
| **Production impact** | Outages during traffic spikes |
| **Mitigation in repo** | `globalForPrisma` + `pg` pool `max: 1` |
| **Real fix** | PgBouncer / Prisma Accelerate / limit concurrency |

---

## Serverless cold starts

| | |
|--|--|
| **Symptom** | First request 3–15s, logs “Cold start” |
| **Cause** | Nest full bootstrap + Swagger + `$connect` |
| **Runtime** | Every new isolate |
| **Impact** | Poor first paint on dashboard |
| **Mitigations** | Keep-warm cron, edge caching static, reduce bootstrap work |

---

## Prisma pooling on serverless

| | |
|--|--|
| **Symptom** | Connections not released when isolate frozen |
| **Cause** | `$disconnect` may not run; pool holds slot until kill |
| **Solution** | External pooler; don’t rely on per-request disconnect |

---

## Connection leaks (development)

| | |
|--|--|
| **Symptom** | Local works hours then fails |
| **Cause** | Multiple `npm run start:dev` restarts, seeds, Prisma Studio open |
| **Fix** | Restart Postgres, close tools, one dev process |

---

## CORS issues

| | |
|--|--|
| **Symptom** | Browser blocks response, “CORS error” in console |
| **Cause** | Frontend origin not in `ALLOWED_ORIGINS` |
| **Runtime** | Preflight OPTIONS fails or no `Access-Control-Allow-Origin` |
| **Fix** | Add origin to `app.config.ts` set |
| **Note** | Postman/curl unaffected (no CORS) |

---

## OPTIONS preflight

| | |
|--|--|
| **Symptom** | POST with Authorization fails from browser |
| **Cause** | Missing OPTIONS or wrong allowed headers/methods |
| **Fix** | Already includes PATCH, Authorization headers in config |
| **Teaching** | Preflight does not send JWT; must not require auth on OPTIONS |

---

## Swagger mismatches (historical)

| Issue | Status |
|-------|--------|
| `/api/docs` vs `/docs` | Fixed — unified `configureApp` |
| Employee delete as UUID | Fixed — `ParseIntPipe` |
| Undocumented attendance/vacation bodies | Fixed — DTOs added |
| Stats example wrong shape | Fixed — `EmployeeStatsGroupDto` |

**Regenerate:** run bootstrap to refresh `swagger-spec.json`.

---

## DTO mismatches

| Issue | Detail |
|-------|--------|
| camelCase query vs snake_case DB | By design — service maps |
| Filters for non-existent columns | DTO accepts; Prisma ignores unknown fields in where if typo — **workload bug** uses wrong key `overload_pressure_index` |
| `sortBy` invalid field | Prisma throws → 500 |

---

## Refresh token issues

| Symptom | Cause |
|---------|--------|
| 403 on refresh | Logged out, expired RT, or wrong secret |
| 403 after refresh | Old RT reused (rotation invalidates) |
| 401 on API | Access expired, refresh not called |
| Using access token on `/auth/refresh` | Wrong token type for RT guard |

---

## Employee delete was broken (fixed)

`ParseUUIDPipe` on integer IDs → always 400. Now `ParseIntPipe`.

---

## Vacation date validation

`start < now` uses full timestamp — edge case: same-day morning request may fail depending on timezone.

---

## Email / OTP delivery

If `EmailService` misconfigured → 500 on sign-in for unverified users when sending code.

---

## Build / deploy failures

| Symptom | Cause |
|---------|--------|
| Cannot find module `generated/prisma` | `prisma generate` not run |
| Handler import error | `dist` not built before deploy |
| Wrong entry on Vercel | Using `main.js` instead of `serverless` export |

---

## Diagnostic checklist

1. Check Vercel function logs for `[Serverless]` lines.
2. Check Postgres connection count (`pg_stat_activity`).
3. Verify env: `AT_SECRET`, `RT_SECRET`, `DB_*`.
4. Test `/health` (no auth).
5. Test `/docs-json` for OpenAPI.
6. Reproduce with curl without CORS before blaming frontend.

See [BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md).
