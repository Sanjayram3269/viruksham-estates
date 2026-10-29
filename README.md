# Viruksham Estates

A refined real-estate portfolio and private administration workspace built with Next.js App Router, React, Tailwind CSS v4, and Supabase.

## Public experience

- / — editorial hero, brand story, portfolio preview, principles and contact CTA.
- /projects — searchable published project catalogue with category/status filters.
- /projects/[slug] — dedicated project details, highlights, amenities, media gallery placeholders and contextual enquiry form.
- /about — company philosophy and story.
- /journal — editorial landing for articles and insights.
- /contact — enquiry form connected to the enquiries API.

## Admin experience

- /admin/login — private administrator sign-in.
- /admin/dashboard — live database counts, latest enquiries and quick actions.
- /admin/projects — search, publication filter, edit, preview and guarded delete for projects.
- /admin/projects/new and /admin/projects/[id]/edit — project create/update forms.
- /admin/enquiries — protected enquiries inbox with search, status filtering and persisted status changes.

Admin pages and API endpoints use the existing server-side administrator authorization. Enquiry status updates also attempt to append an event to the immutable activity_logs table.

## Design direction

The refreshed direction uses a warm architectural palette, forest-green / clay accents, editorial serif typography, responsive navigation, layered project cards, modest hover depth, reduced-motion support, and illustrated architectural placeholders.

**Placeholder imagery is illustrative only.** Replace it with Viruksham Estates' own approved photography, plans, and renders before launch. Do not present the illustrations as completed real projects. No unverified project statistics or phone numbers are fabricated.

The component patterns are original implementations inspired by contemporary editorial real-estate design and animation conventions; no extra 3D runtime was added. Existing Framer Motion and Lucide dependencies are reused.

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test:foundation
```

Copy the required Supabase URL and publishable key into an ignored local .env.local. Never commit credentials or put service-role keys in client-side code.

## Database

The ordered Supabase migrations live in supabase/migrations. Apply them with the Supabase CLI using the intended linked project and review the migration plan before applying schema or permission changes. Provision administrators through the checked-in safe provisioning snippet; there is no public admin sign-up.

## Verification notes

The premium refresh has been committed to branch feat/premium-estate-experience for review. A local npm run lint, npm run build, and relevant API/foundation tests still need to be run against this branch before merge. Some database integration tests require their local Supabase test environment.

## Production checklist

- Replace all media illustrations with approved original project assets.
- Confirm project descriptions, prices, availability, company contact details, and office information with the business.
- Verify project create/edit/publish and public catalogue visibility against Supabase.
- Submit a test enquiry and confirm it appears in the admin inbox and status changes are audited.
- Review the full RLS/security posture and configure production environment variables.
- Upgrade Next.js and eslint-config-next to a supported patched release and regenerate package-lock.json using npm before production deployment.
