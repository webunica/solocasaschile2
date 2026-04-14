# Security Rotation Checklist

Date: 2026-04-13  
Branch policy: work only on `staging`

## Incident summary

- A plain-text credential file was detected in repository history: `Contraseña VPS.txt`.
- History was rewritten in a mirror repository and force-pushed to remote branches:
1. `main`
2. `staging`

## Git cleanup evidence

1. Historical purge executed with `git filter-branch` in mirror.
2. `refs/original/*` removed in mirror.
3. `reflog expire` + `git gc --prune=now --aggressive` executed.
4. Force-push completed to GitHub:
   - `main`: forced update
   - `staging`: forced update

## Credential rotation status (external systems)

These rotations must be completed in provider dashboards:

- [ ] VPS credential rotated and old password revoked.
- [ ] Supabase keys rotated where applicable.
- [ ] `SERPAPI_KEY` rotated.
- [ ] `FLOW_API_KEY` rotated.
- [ ] `FLOW_SECRET_KEY` rotated.
- [ ] `RESEND_API_KEY` rotated.
- [ ] `OPENAI_API_KEY` rotated.
- [ ] `CRON_SECRET` rotated.

## P0-01 execution order

Use this order to reduce blast radius and keep the app testable after each step.

1. **VPS password**
   - Rotate password or SSH credential in the VPS provider panel.
   - Revoke the old credential.
   - Verify SSH/admin access with the new credential outside the repository.

2. **Supabase**
   - Rotate service role key first if it was ever exposed.
   - Rotate anon/publishable key if policy requires full project key rotation.
   - Update Vercel staging/production and local `.env.local`.
   - Verify auth, dashboard, leads endpoint and sitemap database reads.

3. **Flow payments**
   - Rotate `FLOW_API_KEY`.
   - Rotate `FLOW_SECRET_KEY`.
   - Update staging first, then production.
   - Verify checkout creation and confirm webhook/return flow.

4. **Messaging and content APIs**
   - Rotate `RESEND_API_KEY`.
   - Rotate `OPENAI_API_KEY`.
   - Rotate `SERPAPI_KEY`.
   - Verify email sending, cron blog generation and supplier/admin checks.

5. **Internal app secret**
   - Rotate `CRON_SECRET`.
   - Update the scheduled job header to `Authorization: Bearer <new value>`.
   - Verify unauthenticated cron returns `401` and authorized cron still runs.

## P0-01 validation matrix

| System | Required env vars | Verification |
|---|---|---|
| Supabase public reads | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `/catalogo`, `/constructoras`, `/sitemap.xml` load data |
| Supabase privileged writes | `SUPABASE_SERVICE_ROLE_KEY` | public lead endpoint inserts via server-side API |
| Flow | `FLOW_API_KEY`, `FLOW_SECRET_KEY` | checkout creates payment and confirm route validates signature |
| Resend | `RESEND_API_KEY` | lead notification email sends or fails with sanitized logging |
| OpenAI | `OPENAI_API_KEY` | blog cron reaches generation path when authorized |
| SerpApi | `SERPAPI_KEY` or `SERPAPI_API_KEY` | admin supplier/region sync check succeeds |
| Cron | `CRON_SECRET` | cron rejects bad token and accepts new token |

## P0-01 done criteria

1. Every old credential is revoked at provider level.
2. Vercel staging and production env vars are updated.
3. Local `.env.local` is updated only on developer machines and never committed.
4. `npm run secrets:scan` passes.
5. `npm run security:check` passes.
6. `npm run test` passes.
7. A staging smoke test confirms leads, catalog, dashboard auth and cron auth.

## Rotation execution log

Use this table during execution to avoid missing systems:

| Secret | Provider | Rotated by | Date (YYYY-MM-DD) | Old revoked | Notes |
|---|---|---|---|---|---|
| VPS password | VPS panel |  |  | [ ] |  |
| Supabase anon/service | Supabase |  |  | [ ] |  |
| SERPAPI_KEY | SerpApi |  |  | [ ] |  |
| FLOW_API_KEY | Flow |  |  | [ ] |  |
| FLOW_SECRET_KEY | Flow |  |  | [ ] |  |
| RESEND_API_KEY | Resend |  |  | [ ] |  |
| OPENAI_API_KEY | OpenAI |  |  | [ ] |  |
| CRON_SECRET | Vercel env |  |  | [ ] |  |

## Environment sync checklist

After each rotation, update all runtime environments before testing:

1. Vercel `staging` env vars.
2. Vercel `production` env vars.
3. Supabase secrets (if applicable).
4. Local `.env.local` for safe testing (never commit real values).

## Post-rotation verification

- [ ] Production app validated after key rotation.
- [ ] Staging app validated after key rotation.
- [x] Secret scan passes locally:
  - `npm run secrets:scan`
- [x] Security regression checks pass locally:
  - `npm run security:check`
- [ ] GitHub workflow `Security - Secret Scan` passes on `staging`.

## Leads RLS migration validation (P0-05)

Pending operational step for hardened leads flow:

- [ ] Apply migration in Supabase:
  - `supabase/migrations/20260413_harden_leads_insert_rls.sql`
- [ ] Confirm old policy `public_insert_leads` no longer exists.
- [ ] Confirm new policy `authenticated_insert_leads` exists.
- [ ] Submit a real lead from staging UI and verify insert succeeds via backend endpoint only.
