-- =============================================================================
-- Migration 007: Row Level Security — ENABLE + Policies
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 002_profiles_and_auth.sql (is_admin() must exist),
--             003_public_content.sql, 004_enquiries.sql, 005_crm.sql
-- =============================================================================
-- RLS is enabled on ALL 15 tables. No table is left unprotected.
-- Policy naming: "<Actor> <permission> <table>" for readability.
-- All admin policies use public.is_admin() — SECURITY DEFINER, row_security off,
-- fixed search_path — see migration 002 for the full security rationale.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 0: Table-Level SQL Grants & Revokes
-- Explicitly configure schema table permissions for PostgreSQL roles (anon, authenticated).
-- SQL table grants control table-level operations; RLS policies filter rows.
-- -----------------------------------------------------------------------------

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Public (anon) table privileges — read published content, submit consented enquiries
GRANT SELECT ON public.projects              TO anon;
GRANT SELECT ON public.project_media         TO anon;
GRANT SELECT ON public.project_units         TO anon;
GRANT SELECT ON public.construction_services TO anon;
GRANT SELECT ON public.journal_posts         TO anon;
GRANT SELECT ON public.company_timeline      TO anon;
GRANT SELECT ON public.team_members          TO anon;
GRANT SELECT ON public.testimonials          TO anon;
GRANT INSERT ON public.enquiries             TO anon;

-- Authenticated user table privileges (further restricted row-by-row via RLS policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_units         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.construction_services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_posts         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_timeline      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries             TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers             TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_visits           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales                 TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.followups             TO authenticated;

-- Immutable audit log: authenticated can SELECT and INSERT only (NO UPDATE, NO DELETE)
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;

-- -------------------------
-- Enable RLS on all tables
-- -------------------------

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_units     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_timeline  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs     ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECTION A: Public Read Policies
-- Anon and authenticated users can read only published records.
-- =============================================================================

-- profiles: no public read (admin accounts are internal)
-- (no policy needed — RLS enabled with no SELECT policy = deny all)

CREATE POLICY "Public can read published projects"
  ON public.projects
  FOR SELECT
  USING (is_published = true);

-- project_media: readable only when its parent project is published
CREATE POLICY "Public can read media of published projects"
  ON public.project_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_media.project_id
        AND projects.is_published = true
    )
  );

-- project_units: readable only when parent project is published
CREATE POLICY "Public can read units of published projects"
  ON public.project_units
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_units.project_id
        AND projects.is_published = true
    )
  );

CREATE POLICY "Public can read published construction services"
  ON public.construction_services
  FOR SELECT
  USING (is_published = true);

-- journal_posts: must be published AND have a non-future published_at date
CREATE POLICY "Public can read published journal posts"
  ON public.journal_posts
  FOR SELECT
  USING (is_published = true AND published_at <= now());

CREATE POLICY "Public can read published timeline entries"
  ON public.company_timeline
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published team members"
  ON public.team_members
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published testimonials"
  ON public.testimonials
  FOR SELECT
  USING (is_published = true);

-- =============================================================================
-- SECTION B: Public Write Policies
-- Only enquiries allow anonymous insert. All others are admin-only.
-- =============================================================================

-- enquiries: anonymous visitors may submit an enquiry IF consent is given.
-- The CHECK clause enforces consent = true at RLS level (layer 2).
-- The table-level CHECK constraint enforces it at DB level (layer 1).
CREATE POLICY "Anyone may submit an enquiry with consent"
  ON public.enquiries
  FOR INSERT
  WITH CHECK (consent = true);

-- =============================================================================
-- SECTION C: Administrator Full-Access Policies
-- Admins can read and write all tables via is_admin().
-- =============================================================================

-- profiles: split policies for defence-in-depth (trigger + RLS both enforce role protection)

-- Admins can read all profiles
CREATE POLICY "Admins can select profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins can insert profiles (creation of new admin accounts via service-role provisioning)
CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Profile UPDATE: superadmins only may modify any column; regular admins can update own
-- non-role fields only. role column changes are additionally blocked by the trigger.
-- This RLS layer provides the first line of defence visible to PostgREST.
CREATE POLICY "Admins can update profiles (superadmin required for role changes)"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (
    -- Regular admins can update only their own profile (non-role fields)
    -- Superadmins can update any profile
    EXISTS (
      SELECT 1 FROM public.profiles AS caller
      WHERE caller.id = auth.uid()
        AND (
          caller.role = 'superadmin'
          OR (caller.id = profiles.id)
        )
    )
  );

CREATE POLICY "Admins have full access to projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to project_media"
  ON public.project_media
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to project_units"
  ON public.project_units
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to construction_services"
  ON public.construction_services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to journal_posts"
  ON public.journal_posts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to company_timeline"
  ON public.company_timeline
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to team_members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customers"
  ON public.customers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to site_visits"
  ON public.site_visits
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to sales"
  ON public.sales
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to followups"
  ON public.followups
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SECTION D: Immutable Audit Log Policies
-- activity_logs allows SELECT and INSERT for admins.
-- UPDATE and DELETE are INTENTIONALLY NOT GRANTED — no policy = deny.
-- =============================================================================

CREATE POLICY "Admins can read activity_logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert activity_logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- NOTE: No UPDATE or DELETE policy on activity_logs.
-- With RLS enabled and no permissive policy for those operations,
-- UPDATE and DELETE are denied for all roles including authenticated admins.
-- This makes the audit log append-only at the database layer.
