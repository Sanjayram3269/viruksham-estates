-- =============================================================================
-- Migration 003: Public Content & Development Entities
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 001_enums.sql, 002_profiles_and_auth.sql
-- =============================================================================
-- Tables in this migration:
--   projects, project_media, project_units, construction_services,
--   journal_posts, company_timeline, team_members, testimonials
-- =============================================================================

-- -----------------------------------------------------------------------------
-- projects: Real-estate developments.
-- Separate from construction_services — different lifecycle, status model,
-- unit breakdown, pricing structure, and customer journey.
-- is_published controls public visibility. display_order controls CMS ordering.
-- -----------------------------------------------------------------------------

CREATE TABLE public.projects (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT    NOT NULL UNIQUE,
  title           TEXT    NOT NULL,
  subtitle        TEXT,
  category        public.project_category NOT NULL,
  status          public.project_status   NOT NULL,
  location        TEXT    NOT NULL,
  description     TEXT    NOT NULL,
  overview        TEXT,
  highlights      TEXT[],
  amenities       TEXT[],
  -- pricing and availability are stored as human-readable text to avoid
  -- premature commitment to a price format before Supabase is live.
  -- Structured numeric pricing will be introduced in a future migration.
  pricing         TEXT,
  availability    TEXT,
  -- coordinates as {lat, lng} JSON for future map integration.
  coordinates     JSONB,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- project_media: Images, videos, masterplans, and walkthroughs for a project.
-- Cascade delete: removing a project removes all associated media records.
-- URLs reference Supabase Storage paths or CDN URLs (resolved at read time).
-- -----------------------------------------------------------------------------

CREATE TABLE public.project_media (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID    NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type    public.project_media_type NOT NULL,
  url           TEXT    NOT NULL,
  caption       TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- project_units: Individual plot/apartment/villa units within a project.
-- Cascade delete: removing a project removes all unit records.
-- NOTE: sales.unit_id uses ON DELETE SET NULL to preserve financial history
-- if a unit record is corrected or merged.
-- -----------------------------------------------------------------------------

CREATE TABLE public.project_units (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID    NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_number TEXT    NOT NULL,
  unit_type   TEXT,
  size_sqft   NUMERIC,
  price       NUMERIC,
  status      public.unit_status NOT NULL DEFAULT 'AVAILABLE',
  -- metadata for flexible future fields (floor, facing, corner plot, etc.)
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- construction_services: Custom construction/design/renovation services.
-- Intentionally decoupled from projects:
--   - Different status lifecycle (no LIVE/SOLD_OUT/UPCOMING model)
--   - Different pricing model (cost/sqft text vs unit prices)
--   - No unit breakdown
--   - Different customer journey (RFQ vs purchase funnel)
-- estimated_cost_per_sqft is TEXT to support "Request Quote" display mode.
-- -----------------------------------------------------------------------------

CREATE TABLE public.construction_services (
  id                       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     TEXT    NOT NULL UNIQUE,
  title                    TEXT    NOT NULL,
  service_type             public.construction_service_type NOT NULL,
  description              TEXT    NOT NULL,
  estimated_cost_per_sqft  TEXT,
  typical_timeline         TEXT,
  included_deliverables    TEXT[],
  is_published             BOOLEAN NOT NULL DEFAULT false,
  display_order            INTEGER NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- journal_posts: Editorial/blog content published by admins.
-- author_id FK to profiles: ON DELETE SET NULL — author record may be removed
-- but article content and attribution text (author_name, author_role) persists.
-- published_at is NULL until explicitly scheduled/published.
-- -----------------------------------------------------------------------------

CREATE TABLE public.journal_posts (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT    NOT NULL UNIQUE,
  title           TEXT    NOT NULL,
  excerpt         TEXT    NOT NULL,
  content         TEXT    NOT NULL,
  category        TEXT    NOT NULL,
  published_at    TIMESTAMPTZ,
  -- Denormalized author attribution preserved even if profile is deleted.
  author_id       UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name     TEXT    NOT NULL,
  author_role     TEXT,
  cover_media_url TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- company_timeline: Milestone entries displayed on the About page.
-- is_published defaults to true — timeline items are typically all visible.
-- No FK to profiles; timeline is editorial content, not tied to a single admin.
-- -----------------------------------------------------------------------------

CREATE TABLE public.company_timeline (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  year          TEXT    NOT NULL,
  title         TEXT    NOT NULL,
  description   TEXT    NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- team_members: Leadership / team profiles displayed on the website.
-- Not linked to auth — these are public-facing editorial records.
-- image_url references Supabase Storage or CDN.
-- -----------------------------------------------------------------------------

CREATE TABLE public.team_members (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT    NOT NULL,
  role          TEXT    NOT NULL,
  bio           TEXT,
  image_url     TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- testimonials: Client testimonials curated by admins.
-- is_published defaults to false — explicit opt-in required per testimonial.
-- project_title is a denormalized TEXT (not FK) to survive project archival.
-- -----------------------------------------------------------------------------

CREATE TABLE public.testimonials (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  author        TEXT    NOT NULL,
  role          TEXT,
  quote         TEXT    NOT NULL,
  project_title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
