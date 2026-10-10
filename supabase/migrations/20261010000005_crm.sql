-- =============================================================================
-- Migration 005: Internal CRM Entities
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 001_enums.sql, 002_profiles_and_auth.sql,
--             003_public_content.sql, 004_enquiries.sql
-- =============================================================================
-- CRM tables: customers, site_visits, sales, followups, activity_logs.
-- ALL CRM data is admin-only. No public read or write access.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- customers: Qualified leads and existing buyers tracked by admins.
-- phone is UNIQUE (normalized before insert) — primary deduplication key.
-- source_enquiry_id: ON DELETE SET NULL — customer record is preserved
-- even if the originating enquiry is purged or anonymized.
-- created_by: admin who created the customer record (not the customer's auth).
-- -----------------------------------------------------------------------------

CREATE TABLE public.customers (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT    NOT NULL,
  email             TEXT,
  -- Phone is the canonical deduplication key for customers.
  -- Callers must normalize the number (strip spaces/dashes, add country code)
  -- before inserting. The UNIQUE constraint enforces no duplicates.
  phone             TEXT    NOT NULL UNIQUE,
  notes             TEXT,
  source_enquiry_id UUID    REFERENCES public.enquiries(id) ON DELETE SET NULL,
  created_by        UUID    REFERENCES public.profiles(id)  ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- site_visits: Scheduled and completed property site visits.
-- customer_id: ON DELETE CASCADE — visit records belong to the customer.
-- project_id: ON DELETE SET NULL — visit record persists if project archived.
-- assigned_to: ON DELETE SET NULL — visit record persists if admin leaves.
-- -----------------------------------------------------------------------------

CREATE TABLE public.site_visits (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID    NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  project_id    UUID    REFERENCES public.projects(id)  ON DELETE SET NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  assigned_to   UUID    REFERENCES public.profiles(id)  ON DELETE SET NULL,
  status        public.visit_status NOT NULL DEFAULT 'SCHEDULED',
  feedback      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- sales: Sales pipeline entries per customer and project.
-- customer_id ON DELETE RESTRICT — cannot delete a customer with sales history.
-- project_id  ON DELETE RESTRICT — cannot delete a project with sales history.
-- unit_id     ON DELETE SET NULL — unit record may be corrected/merged without
--             destroying the financial record.
-- assigned_to ON DELETE SET NULL — sale record preserved if admin leaves.
-- -----------------------------------------------------------------------------

CREATE TABLE public.sales (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID    NOT NULL REFERENCES public.customers(id)     ON DELETE RESTRICT,
  project_id    UUID    NOT NULL REFERENCES public.projects(id)      ON DELETE RESTRICT,
  unit_id       UUID    REFERENCES public.project_units(id)          ON DELETE SET NULL,
  stage         public.sale_stage NOT NULL DEFAULT 'LEAD',
  agreed_price  NUMERIC,
  booking_date  TIMESTAMPTZ,
  assigned_to   UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- followups: Task-like follow-up reminders assigned to admins for customers.
-- customer_id: ON DELETE CASCADE — followups belong to the customer lifecycle.
-- assigned_to: ON DELETE SET NULL — followup persists if admin leaves.
-- -----------------------------------------------------------------------------

CREATE TABLE public.followups (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID    NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  assigned_to   UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  title         TEXT    NOT NULL,
  due_date      TIMESTAMPTZ NOT NULL,
  status        public.followup_status NOT NULL DEFAULT 'PENDING',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- activity_logs: Append-only audit trail of admin actions.
-- actor_id: ON DELETE SET NULL — log entry is preserved even if admin deleted.
-- target_table + target_id: identifies the affected row.
-- metadata: arbitrary JSONB payload (before/after values, context).
-- IMMUTABLE: RLS restricts to SELECT + INSERT only. No UPDATE or DELETE.
-- -----------------------------------------------------------------------------

CREATE TABLE public.activity_logs (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  action        TEXT    NOT NULL,
  target_table  TEXT    NOT NULL,
  target_id     UUID,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  -- No updated_at by design — this table is append-only.
);
