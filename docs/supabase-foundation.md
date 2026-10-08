# Supabase foundation — checkpoint 15A–15B

Status: draft. Client utilities and configuration checks are prepared. Dependency
installation, the lockfile update, a live project connection, lint and build must
be completed before merging. The existing public website remains unchanged.

## Create or confirm the project

Use the Supabase dashboard at https://supabase.com/dashboard. If an existing
Viruksham project exists, confirm it rather than creating a duplicate. Otherwise,
create a project in the appropriate owner organization and select an available
India region. Keep its database password in your password manager.

Do not create application tables yet. Schema design and RLS are the next reviewed
checkpoint. No demo projects, articles, customers or testimonials are needed.

The ChatGPT workspace currently disables the Supabase connection. Dashboard setup
can be performed manually, or the workspace administrator can enable the plugin.
Never paste database passwords, access tokens or secret keys into chat.

## Install dependencies and configure locally

The existing dependency installation was blocked by npm registry HTTP 403 in the
coding environment. Dependency versions and a new lockfile have deliberately not
been fabricated. Run this in the existing repository on a machine with npm access:

```powershell
npm install @supabase/supabase-js @supabase/ssr server-only
Copy-Item .env.example .env.local
```

Only copy the environment template if `.env.local` does not already exist; merge
the two variable names into an existing local file instead of overwriting it.

`@supabase/supabase-js` is the official SDK; `@supabase/ssr` supplies cookie-aware
browser/server clients; `server-only` prevents importing server utilities into a
client bundle. Commit the resulting package.json and package-lock.json together
on this feature branch after verification.

Open the project's Connect dialog and put its Project URL and publishable key
into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

This foundation accepts modern `sb_publishable_` keys, not legacy JWT keys.
Neither factory reads a secret or service-role key. Publishable keys identify the
application; they do not grant an admin role. Database grants and RLS still need
to be designed and verified before data is exposed.

Public variables are included at Next.js build time. Configure the same variable
names in the deployment environment before a build; never commit `.env.local`.

## Verify

The dependency-free foundation test and connection check use Node's TypeScript
stripping support. Run these scripts with Node.js 22.18+ or 24.

```powershell
npm run test:foundation
npm run check:supabase
npm run lint
npm run build
git status
```

The connection check only reads Auth settings. A successful result establishes
endpoint reachability and key acceptance, not schema correctness or authorization.
Browser-review the existing public routes after a successful build.

## Integration boundaries

- `lib/supabase/client.ts`: browser client, created on demand.
- `lib/supabase/server.ts`: request-scoped server client using Next.js cookies.
- `lib/supabase/env.ts`: lazy configuration validation; errors omit input values.
- Existing public pages still use the intentionally empty arrays in `lib/content.ts`.
- Admin pages remain placeholders. These helpers do not implement login or access control.

Before enabling authentication, add a Next.js 16 session-refresh proxy, verified
server-side identity checks, and database-backed role authorization. Preserve
refreshed cookies on the response; do not cache authenticated responses or share
cookie-backed clients between requests. Server Components cannot persist refreshed
cookies, which is why the server helper alone is not sufficient for authentication.

Generate actual database TypeScript types after reviewed migrations exist; do not
invent a `Database` type or application tables for this checkpoint.

Next: schema design and review, migrations and RLS, then authentication and admin.

## References

- https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
- https://supabase.com/docs/guides/getting-started/api-keys
