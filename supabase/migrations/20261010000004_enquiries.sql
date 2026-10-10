-- =============================================================================
-- Migration 004: Enquiries Table
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 001_enums.sql, 003_public_content.sql
-- =============================================================================
-- The enquiries table bridges the public-facing website and the internal CRM.
-- Anonymous visitors can INSERT enquiries (consent required).
-- Admins can read and update enquiry status.
-- Enquiries are never deleted — they become the historical record of interest.
-- =============================================================================

CREATE TABLE public.enquiries (
  id                        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submitter contact details (collected from the public contact form)
  name                      TEXT    NOT NULL,
  email                     TEXT    NOT NULL,
  phone                     TEXT    NOT NULL,
  message                   TEXT    NOT NULL,

  -- Optional context: what the enquiry is about.
  -- project_slug is stored as a denormalized TEXT snapshot at submission time.
  -- project_id and construction_service_id are nullable FKs for CRM linkage.
  project_slug              TEXT,
  project_id                UUID    REFERENCES public.projects(id)              ON DELETE SET NULL,
  construction_service_id   UUID    REFERENCES public.construction_services(id) ON DELETE SET NULL,

  enquiry_type              public.enquiry_type      NOT NULL,
  preferred_contact         public.preferred_contact NOT NULL,

  -- Legal consent: must be explicitly true. Enforced both at DB level (CHECK)
  -- and at RLS INSERT policy (WITH CHECK (consent = true)).
  consent                   BOOLEAN NOT NULL CHECK (consent = true),

  -- CRM status tracking by admins
  status                    public.enquiry_status NOT NULL DEFAULT 'NEW',

  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
  -- No updated_at: status transitions are tracked via activity_logs instead.
);
