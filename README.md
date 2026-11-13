# WAC App

Next.js 16, TypeScript, Supabase. Mobile first.

## Setup
1. Supabase SQL editor: run `wac_schema_v1.sql`, then `supabase/wac_schema_v1_1_patch.sql`, then `supabase/verify_schema.sql` (all rows must say true).
2. Authentication, URL Configuration: set Site URL to your app URL and add `http://localhost:3000/auth/callback` to Redirect URLs.
3. Storage: create a private bucket `payment-proofs` (access rules come in Phase 2).
4. `cp .env.example .env.local` and fill in the URL and anon key.
5. Run `supabase/first_leadership_user.sql` with fake data, after adding the auth user in the dashboard.
6. `npm install` then `npm run dev`.

## Structure
- `src/proxy.ts` refreshes the session and sends signed out visitors to /login (Next 16 name for middleware).
- `src/lib/auth.ts` has `requireMember`, `requireStaff`, `requireLeadership`.
- `src/app/(app)` holds the signed in shell. Staff only pages call `requireStaff()`.
- Row level security in the database is the real gate. The page checks are only for navigation.
