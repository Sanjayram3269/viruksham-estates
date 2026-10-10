-- =============================================================================
-- Migration 001: Custom ENUM Types
-- Viruksham Estates — Phase 1B Schema Implementation
-- Branch: feat/phase-1b-schema-implementation
-- Must run BEFORE all other migrations.
-- =============================================================================

-- Project domain ENUMs
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

-- Construction services ENUMs
CREATE TYPE public.construction_service_type AS ENUM (
  'TURNKEY_CONSTRUCTION',
  'ARCHITECTURAL_DESIGN',
  'INTERIOR_BUILD',
  'RENOVATION'
);

-- Enquiry ENUMs
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

-- CRM ENUMs
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
