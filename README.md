# Viruksham Estates — Property Development Portfolio

[Next.js](https://nextjs.org) app router project — Viruksham Estates property development showcase.

## 🏗️ Architecture

- **Next.js 16** (App Router) with React 19
- **Supabase** for database, authentication, and RLS policies
- **TypeScript** with strict typing
- **Tailwind CSS v4** for styling
- Route groups: `(`site`)` for public pages, `admin` for administrative routes

## 🌐 Public Site

### Projects Catalogue

- `/projects` — List all published projects, filtered by Supabase RLS
- `/projects/[slug]` — Individual project detail page
- Both pages work without an authenticated admin session
- Draft/unpublished projects are not exposed to anonymous visitors

### Other Pages

- `/` — Homepage with hero and brand story
- `/about` — About page with values and leadership
- `/journal` — Journal/blog grid
- `/contact` — Enquiry form

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
```

### Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** The `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` must be the `sb_publishable_` key, not the secret or service role key. Secret keys are rejected by the env validation module.

### RLS Security Model

The Supabase RLS policies handle access control at the database level:

- **Anonymous users** can only read projects where `is_published = true`
- **Authenticated users** (admins) have full CRUD access via `public.is_admin()` function
- **Enquiries** can be submitted anonymously with consent validation
- **CRM entities** (customers, sales, etc.) are protected — anon access denied

## 📦 Completed Features — Phase 2B

### Public Project Catalogue (`/projects`)

- Fetches projects from Supabase using browser client
- RLS policy `USING (is_published = true)` filters to published only
- Category and status filtering UI
- Empty state when no projects published

### Public Project Detail (`/projects/[slug]`)

- Fetches single published project by slug
- Returns `notFound()` for missing or unpublished projects
- Works without admin session
- Enquiry form integrated

### Admin Projects CMS

- Full CRUD at `/admin/projects`
- Search and category/status filters with URL persistence
- Duplicate slug validation on create and update
- Admin authorization via `getAdminUser()` from `@/lib/auth/admin`
- Sales history `ON DELETE RESTRICT` prevents project deletion with active sales
- Create, edit, delete with confirmation modals

### API Routes (`/api/admin/projects`)

- GET/POST/PUT/DELETE with full admin auth + Supabase CRUD
- Duplicate slug checking (create and update, excluding current project)
- Proper error handling and validation

### Type & Config Updates

- `types/ui.ts`: added `"destructive"` ButtonVariant
- `next.config.ts`: `partialPrefetching: false` for dynamic route compatibility
- `components/ui/button.tsx`: destructive variant styling

### Database

- Two Anugraham Nagar records preserved:
  - `anugraham-nagar-1`: Published (RESIDENTIAL, LIVE)
  - `anugraham-nagar-2`: Draft (PLOTS, ONGOING)
- RLS policies correctly configured (see `supabase/migrations/20261010000007_rls.sql`)

## 🧪 Tests

Run the foundation test suite:

```bash
npm run test:foundation
```

All 105 tests pass across 9 test suites, including:

- Published vs unpublished content visibility (anon client filtering)
- CRM confidentiality (anon cannot read customers)
- Foreign key RESTRICT on sales → projects
- Role self-elevation prevention
- Audit log immutability
- Duplicate phone/slug constraint enforcement

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/(site)/projects/page.tsx` | Public project catalogue |
| `app/(site)/projects/[slug]/page.tsx` | Public project detail |
| `app/api/admin/projects/route.ts` | Admin API routes |
| `app/admin/projects/page.tsx` | Admin CMS interface |
| `lib/supabase/server.ts` | Supabase SSR client factory |
| `supabase/migrations/20261010000007_rls.sql` | RLS policies |
| `tests/schema-integration.test.mjs` | Integration tests |

## 🚀 Deployment

```bash
npm run build
# Deploy to production
```

Secrets and `.env.local` must remain untracked in `.gitignore` and never committed.

## � remainining Work

- Add integration tests for project CRUD, authorization, slug uniqueness
- Configure production environment variables
- Final documentation polish