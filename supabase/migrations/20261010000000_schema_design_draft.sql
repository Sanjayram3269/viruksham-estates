-- =============================================================================
-- Viruksham Estates — Database Schema Design (Phase 1A Hardened Draft)
-- UNAPPROVED DRAFT MIGRATION ARTIFACT FOR REVIEW ONLY. DO NOT APPLY TO LIVE DB.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Custom ENUM Types
-- -----------------------------------------------------------------------------

CREATE TYPE public.project_category AS ENUM (
  'RESIDENTIAL',
  'PLOTS',
  'CONSTRUCTION',
  'COMMERCIAL'
);

CREATE TYPE public.project_status AS ENUM (
  'LIVE',
  'ONGOING',
  'COMPLETED',
  'UPCOMING',
  'SOLD_OUT'
);

CREATE TYPE public.project_media_type AS ENUM (
  'cover',
  'gallery',
  'masterplan',
  'walkthrough'
);

CREATE TYPE public.unit_status AS ENUM (
  'AVAILABLE',
  'RESERVED',
  'SOLD'
);

CREATE TYPE public.construction_service_type AS ENUM (
  'TURNKEY_CONSTRUCTION',
  'ARCHITECTURAL_DESIGN',
  'INTERIOR_BUILD',
  'RENOVATION'
);

CREATE TYPE public.enquiry_type AS ENUM (
  'GENERAL',
  'PROJECT',
  'SITE_VISIT',
  'PARTNERSHIP'
);

CREATE TYPE public.preferred_contact AS ENUM (
  'PHONE',
  'EMAIL',
  'WHATSAPP'
);

CREATE TYPE public.enquiry_status AS ENUM (
  'NEW',
  'IN_REVIEW',
  'CONTACTED',
  'CONVERTED',
  'ARCHIVED'
);

CREATE TYPE public.visit_status AS ENUM (
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
);

CREATE TYPE public.sale_stage AS ENUM (
  'LEAD',
  'NEGOTIATION',
  'BOOKED',
  'CLOSED_WON',
  'CLOSED_LOST'
);

CREATE TYPE public.followup_status AS ENUM (
  'PENDING',
  'COMPLETED',
  'OVERDUE'
);

-- -----------------------------------------------------------------------------
-- 2. Core Auth & System Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hardened Non-Recursive Admin Check Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. Public Content & Development Entities
-- -----------------------------------------------------------------------------

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  category public.project_category NOT NULL,
  status public.project_status NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT,
  highlights TEXT[],
  amenities TEXT[],
  pricing TEXT,
  availability TEXT,
  coordinates JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type public.project_media_type NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  unit_type TEXT,
  size_sqft NUMERIC,
  price NUMERIC,
  status public.unit_status NOT NULL DEFAULT 'AVAILABLE',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.construction_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  service_type public.construction_service_type NOT NULL,
  description TEXT NOT NULL,
  estimated_cost_per_sqft TEXT,
  typical_timeline TEXT,
  included_deliverables TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.journal_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  cover_media_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  project_title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 4. Enquiry & Internal CRM Entities
-- -----------------------------------------------------------------------------

CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  project_slug TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  construction_service_id UUID REFERENCES public.construction_services(id) ON DELETE SET NULL,
  enquiry_type public.enquiry_type NOT NULL,
  preferred_contact public.preferred_contact NOT NULL,
  consent BOOLEAN NOT NULL CHECK (consent = true),
  status public.enquiry_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  notes TEXT,
  source_enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.visit_status NOT NULL DEFAULT 'SCHEDULED',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
  unit_id UUID REFERENCES public.project_units(id) ON DELETE SET NULL,
  stage public.sale_stage NOT NULL DEFAULT 'LEAD',
  agreed_price NUMERIC,
  booking_date TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status public.followup_status NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. Indexes
-- -----------------------------------------------------------------------------

CREATE UNIQUE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_public_filter ON public.projects(category, status, is_published, display_order);

CREATE UNIQUE INDEX idx_construction_services_slug ON public.construction_services(slug);
CREATE INDEX idx_construction_services_public ON public.construction_services(is_published, display_order);

CREATE UNIQUE INDEX idx_journal_posts_slug ON public.journal_posts(slug);
CREATE INDEX idx_journal_posts_published ON public.journal_posts(is_published, published_at DESC);

CREATE INDEX idx_project_media_project ON public.project_media(project_id, display_order);

CREATE UNIQUE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_email ON public.customers(email);

CREATE INDEX idx_enquiries_status_date ON public.enquiries(status, created_at DESC);
CREATE INDEX idx_site_visits_scheduled ON public.site_visits(scheduled_at, status);
CREATE INDEX idx_sales_pipeline ON public.sales(stage, assigned_to);
CREATE INDEX idx_followups_due ON public.followups(assigned_to, status, due_date);

-- -----------------------------------------------------------------------------
-- 6. Row Level Security (RLS) & Policies
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public projects are readable by everyone"
  ON public.projects FOR SELECT USING (is_published = true);

CREATE POLICY "Public project media readable by everyone"
  ON public.project_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_media.project_id AND projects.is_published = true)
  );

CREATE POLICY "Public project units readable by everyone"
  ON public.project_units FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_units.project_id AND projects.is_published = true)
  );

CREATE POLICY "Public construction services readable by everyone"
  ON public.construction_services FOR SELECT USING (is_published = true);

CREATE POLICY "Published journal posts readable by everyone"
  ON public.journal_posts FOR SELECT USING (is_published = true AND published_at <= now());

CREATE POLICY "Published timeline readable by everyone"
  ON public.company_timeline FOR SELECT USING (is_published = true);

CREATE POLICY "Published team members readable by everyone"
  ON public.team_members FOR SELECT USING (is_published = true);

CREATE POLICY "Published testimonials readable by everyone"
  ON public.testimonials FOR SELECT USING (is_published = true);

-- Public Enquiry Submission
CREATE POLICY "Anyone can submit an enquiry with consent"
  ON public.enquiries FOR INSERT WITH CHECK (consent = true);

-- Administrator Access Policies
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access project_media" ON public.project_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access project_units" ON public.project_units FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access construction_services" ON public.construction_services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access journal_posts" ON public.journal_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access company_timeline" ON public.company_timeline FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access team_members" ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access enquiries" ON public.enquiries FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access customers" ON public.customers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access site_visits" ON public.site_visits FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access sales" ON public.sales FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access followups" ON public.followups FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Immutable Audit Log Policies (Read and Insert only; NO UPDATE OR DELETE)
CREATE POLICY "Admins read activity_logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert activity_logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
