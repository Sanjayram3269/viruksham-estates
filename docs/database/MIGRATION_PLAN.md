# Viruksham Estates — Migration Plan & Rollback Procedures (Hardened Phase 1A)

> **IMPORTANT:** This migration plan and associated SQL DDL files represent **unapproved draft artifacts for review only**. Do NOT execute or apply these migrations to a live Supabase database until Phase 1B approval.

---

## 1. Sequential Migration Dependency Order

```
Step 1: Enums & Extension Types
  └── Step 2: Core Auth & Profiles (`profiles`, `is_admin()`, role triggers)
        └── Step 3: Public Content & Media (`projects`, `project_media`, `project_units`, `construction_services`, `journal_posts`, `company_timeline`, `team_members`, `testimonials`)
              └── Step 4: Enquiry Capture (`enquiries`)
                    └── Step 5: Internal CRM Pipeline (`customers`, `site_visits`, `sales`, `followups`, `activity_logs`)
                          └── Step 6: RLS Policies, Grants & Audit Constraints
```

---

## 2. Execution Phases (`20261010000000_schema_design_draft.sql`)

1. **Enum Definitions:** Define `project_category`, `project_status`, `project_media_type`, `unit_status`, `construction_service_type`, `enquiry_type`, `preferred_contact`, `enquiry_status`, `visit_status`, `sale_stage`, `followup_status`.
2. **Core Profiles & Function Hardening:** Create `profiles`, define non-recursive `is_admin()` helper function with `SET row_security = off`, revoke public execute permissions.
3. **Table & Index Creation:** Create 15 entities with primary/foreign keys, defaults, and performance indexes.
4. **Enable RLS & Apply Policies:** Apply Row Level Security and explicit policy permissions for public reading, enquiry insertion, and admin management across all 15 tables.

---

## 3. Rollback Procedures

```sql
-- Teardown Functions & Triggers
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
DROP TABLE IF EXISTS public.construction_services CASCADE;
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
DROP TYPE IF EXISTS public.construction_service_type CASCADE;
DROP TYPE IF EXISTS public.unit_status CASCADE;
DROP TYPE IF EXISTS public.project_media_type CASCADE;
DROP TYPE IF EXISTS public.project_status CASCADE;
DROP TYPE IF EXISTS public.project_category CASCADE;
```
