# Viruksham Estates — Migration Plan & Rollback Procedures

> **IMPORTANT:** This migration plan and associated SQL DDL files represent **unapproved draft artifacts for review only**. Do NOT execute or apply these migrations to a live Supabase database until Phase 1B approval.

---

## 1. Migration Sequence & Dependency Ordering

Migrations must be executed in exact sequential order to respect database dependency graphs and foreign key constraints:

```
Step 1: Enums & Extension Types
  └── Step 2: Core Auth & Profiles (`profiles`, `is_admin()`)
        └── Step 3: Public Content & Media (`projects`, `project_media`, `project_units`, `journal_posts`, `company_timeline`, `team_members`, `testimonials`)
              └── Step 4: Enquiry Capture (`enquiries`)
                    └── Step 5: Internal CRM Pipeline (`customers`, `site_visits`, `sales`, `followups`, `activity_logs`)
                          └── Step 6: RLS Policies & Triggers
```

---

## 2. Detailed Execution Phases

### Phase A: Schema Creation (`20261010000000_schema_design_draft.sql`)
1. **Enum Definitions:** Define `project_category`, `project_status`, `project_media_type`, `unit_status`, `enquiry_type`, `preferred_contact`, `enquiry_status`, `visit_status`, `sale_stage`, `followup_status`.
2. **Table Creation:** Create 14 entities with explicit primary/foreign keys and defaults.
3. **Index Creation:** Apply performance indexes for slugs, public catalogue filtering, enquiry statuses, and CRM pipelines.
4. **Helper Functions & Triggers:** Create `is_admin()` and automatic `updated_at` timestamp trigger.
5. **Enable RLS:** Enable Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) across all 14 tables.
6. **Policy Definition:** Apply RLS policies for public reads, enquiry inserts, and admin full access.

---

## 3. Rollback & Disaster Recovery Procedures

If a migration fails or requires reversal prior to production cutover:

### Automated Rollback Strategy:
1. Every table creation and policy assignment is idempotent (`IF EXISTS` checks where supported).
2. Rollback script target sequence:
   ```sql
   -- Teardown RLS & Policies
   DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

   -- Drop CRM & Enquiry Tables
   DROP TABLE IF EXISTS public.activity_logs CASCADE;
   DROP TABLE IF EXISTS public.followups CASCADE;
   DROP TABLE IF EXISTS public.sales CASCADE;
   DROP TABLE IF EXISTS public.site_visits CASCADE;
   DROP TABLE IF EXISTS public.customers CASCADE;
   DROP TABLE IF EXISTS public.enquiries CASCADE;

   -- Drop Public Content Tables
   DROP TABLE IF EXISTS public.testimonials CASCADE;
   DROP TABLE IF EXISTS public.team_members CASCADE;
   DROP TABLE IF EXISTS public.company_timeline CASCADE;
   DROP TABLE IF EXISTS public.journal_posts CASCADE;
   DROP TABLE IF EXISTS public.project_units CASCADE;
   DROP TABLE IF EXISTS public.project_media CASCADE;
   DROP TABLE IF EXISTS public.projects CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;

   -- Drop Custom ENUM Types
   DROP TYPE IF EXISTS public.followup_status CASCADE;
   DROP TYPE IF EXISTS public.sale_stage CASCADE;
   DROP TYPE IF EXISTS public.visit_status CASCADE;
   DROP TYPE IF EXISTS public.enquiry_status CASCADE;
   DROP TYPE IF EXISTS public.preferred_contact CASCADE;
   DROP TYPE IF EXISTS public.enquiry_type CASCADE;
   DROP TYPE IF EXISTS public.unit_status CASCADE;
   DROP TYPE IF EXISTS public.project_media_type CASCADE;
   DROP TYPE IF EXISTS public.project_status CASCADE;
   DROP TYPE IF EXISTS public.project_category CASCADE;
   ```

---

## 4. Verification Checklist Before Execution

- [ ] All 14 entities present in migration SQL.
- [ ] RLS explicitly enabled on every table.
- [ ] No recursive `SELECT` in `profiles` RLS policy.
- [ ] `consent = true` constraint verified on `enquiries`.
- [ ] Local schema invariant tests pass (`npm run test:foundation`).
