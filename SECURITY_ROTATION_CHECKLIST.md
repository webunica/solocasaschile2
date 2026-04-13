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
- [ ] Secret scan passes:
  - `npm run secrets:scan`
- [ ] Security regression checks pass:
  - `npm run security:check`

## Leads RLS migration validation (P0-05)

Pending operational step for hardened leads flow:

- [ ] Apply migration in Supabase:
  - `supabase/migrations/20260413_harden_leads_insert_rls.sql`
- [ ] Confirm old policy `public_insert_leads` no longer exists.
- [ ] Confirm new policy `authenticated_insert_leads` exists.
- [ ] Submit a real lead from staging UI and verify insert succeeds via backend endpoint only.
