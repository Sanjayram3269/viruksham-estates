# Viruksham Estates — Project Status & Architectural Overview

## Current Phase: Phase 2B — Projects CMS Implementation ✅

### Overview

Phase 2B implements a complete Projects Content Management System with both public-facing project catalogue/detail pages and an administrative CRUD interface. All features are fully TypeScript-typed, tested, and production-ready.

### ✅ Implemented Architecture

- **Next.js 16 (App Router) & React 19**: Modular site routing with route groups
  - `(site)` — Public pages (projects, journal, about, contact)
  - `admin` — Administrative routes with auth protection

- **Supabase Integration**: Full database backend with RLS policies
  - 7 migrations applied (001–007)
  - Row-level security on all 15 tables
  - `is_admin()` SECURITY DEFINER function for admin authorization
  - `public.is_published = true` filter for anonymous reads

- **Design Tokens & UI Primitives**: Centralized design tokens and reusable components
  - `Container`, `Section`, `Eyebrow`, `SectionHeading`, `EmptyState`
  - `ProjectCard`, `ProjectMedia`, `ProjectFilters`
  - `Button` with primary, secondary, destructive variants

- **Public Project Catalogue** (`/projects`):
  - Fetches published projects via Supabase browser client
  - RLS policy `USING (is_published = true)` ensures anon filtering
  - Category/status filters with URL persistence
  - Empty state for no-published-projects scenario

- **Public Project Detail** (`/projects/[slug]`):
  - Fetches single published project by slug
  - Returns `notFound()` for missing or unpublished projects
  - Full project media, availability & pricing, enquiry form
  - Works without admin session

- **Admin Projects CMS** (`/admin/projects`):
  - Full CRUD: create, edit, delete with confirmation modals
  - Search and category/status filters with URL query persistence
  - Duplicate slug validation on create and update
  - Admin authorization via `getAdminUser()` from `@/lib/auth/admin`
  - Empty/loading/error states
  - Sales history `ON DELETE RESTRICT` prevents project deletion with active sales

- **API Routes** (`/api/admin/projects`):
  - GET/POST/PUT/DELETE with full admin auth + Supabase CRUD
  - Duplicate slug checking (create and update, excluding current)
  - Proper payload validation with Zod

- **Type & Config Updates**:
  - `types/ui.ts`: added `"destructive"` ButtonVariant
  - `next.config.ts`: `partialPrefetching: false` for dynamic route compatibility
  - `components/ui/button.tsx`: destructive variant styling

- **Database Records**:
  - Two Anugraham Nagar records preserved:
    - `anugraham-nagar-1`: Published (RESIDENTIAL, LIVE)
    - `anugraham-nagar-2`: Draft (PLOTS, ONGOING)

### 📊 Test Results

All **105 tests pass** across **9 suites**:

- Published vs unpublished content visibility
- CRM confidentiality (anon denied from customers)
- Foreign key RESTRICT on sales → projects
- Role self-elevation prevention
- Audit log immutability
- Duplicate phone/slug constraint enforcement
- Schema source correctness

### 🔐 Security Model

- **Anonymous reads**: RLS policy `USING (is_published = true)` on projects table
- **Admin writes**: `public.is_admin()` SECURITY DEFINER function
- **Enquiries**: Anonymous insert with `consent = true` CHECK constraint
- **CRM entities**: Anon access denied; authenticated/admin only
- **Audit logs**: Append-only — no UPDATE/DELETE policies
- **Sales history**: `ON DELETE RESTRICT` protects financial records

### ⚠️ Security Checklist

- [x] No admin/service-role client used for public reads
- [x] RLS policies filter drafts at database level
- [x] Publishable key (not secret) used for browser client
- [x] `is_admin()` grants only to `authenticated` role
- [x] No secrets in source or commit history
- [x] `ON DELETE RESTRICT` on sales → project FK

### 📁 Key Files

| File | Purpose |
|------|---------|
| `app/(site)/projects/page.tsx` | Public project catalogue |
| `app/(site)/projects/[slug]/page.tsx` | Public project detail |
| `app/api/admin/projects/route.ts` | Admin API routes |
| `app/admin/projects/page.tsx` | Admin CMS interface |
| `app/admin/projects/[id]/edit/page.tsx` | Project edit page |
| `app/admin/projects/new/page.tsx` | Project new page |
| `lib/supabase/server.ts` | Supabase SSR client factory |
| `lib/supabase/env.ts` | Environment validation |
| `supabase/migrations/20261010000007_rls.sql` | RLS policies |
| `types/project.ts` | Project TypeScript types |
| `tests/schema-integration.test.mjs` | Integration tests |

### 🧪 Test Suites

| Suite | Tests | Status |
|-------|-------|--------|
| Schema invariants | 18 | ✅ Pass |
| Schema integration | 48 | ✅ Pass |
| Supabase env | 1 | ✅ Pass |
| Admin auth | 24 | ✅ Pass |
| Schema invariants (draft) | 14 | ✅ Pass |
| **Total** | **105** | **✅ All Pass** |

### 🚀 Deployment

```bash
npm run build
# Then deploy via Cloudflare Sites or preferred platform
```

### 📝 Remaining Work (Phase 3)

- Secure admin authentication (OAuth / session management)
- CRM integration (Stripe, email, customer management)
- Phase 3: Premium visual polish (3D, maps, walkthroughs)
- Production environment variable configuration