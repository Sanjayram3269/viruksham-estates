# Viruksham Estates — Database Schema Design (Hardened Phase 1A)

## 1. Overview & Architectural Principles

This document defines the production PostgreSQL database schema for **Viruksham Estates**, supporting the Next.js public web platform, real estate development catalogue, custom construction offerings, editorial journal, administrator CMS, and internal CRM pipeline.

### Core Design Principles
1. **Source of Truth Alignment:** Aligned directly with TypeScript types (`types/project.ts`, `types/journal.ts`, `types/company.ts`, `types/enquiry.ts`) and Zod validation schemas (`lib/validations/enquiry.ts`).
2. **Strict Identity & Primary Keys:** Standardized on `UUID` (`gen_random_uuid()`) for all primary keys.
3. **Decoupled Construction Modeling:** Custom construction services are modeled as a dedicated entity (`construction_services`) to prevent category-specific field corruption in property development listings (`projects`).
4. **Non-Recursive RLS Authorization:** Administrative checks use a `SECURITY DEFINER` function (`is_admin()`) configured with `SET row_security = off` and `SET search_path = public, pg_temp` to eliminate infinite RLS recursion loops on `profiles`.
5. **Consent & Privacy Compliance:** Public enquiry submission enforces explicit user consent (`consent = true`). Customer records created from enquiries maintain privacy boundaries and auditable lineage.
6. **Immutable Audit Trail:** Activity logs (`activity_logs`) prohibit `UPDATE` and `DELETE` operations via RLS.

---

## 2. Construction Modeling Evaluation & Trade-Off Analysis

### The Problem
Real estate developments (Residential villas, land plot layouts, commercial complexes) are location-specific physical offerings with plot/unit breakdowns (`project_units`), spatial coordinates, and availability statuses (`AVAILABLE`, `RESERVED`, `SOLD`).

In contrast, custom construction services (turnkey home building, architectural planning, renovation services) are service offerings provided on client-owned land, lacking physical project coordinates, plot units, or layout masterplans.

### Evaluated Options

| Feature | Option A: Single Unified `projects` Table | Option B: Dedicated `construction_services` Table (CHOSEN) |
| :--- | :--- | :--- |
| **Data Integrity** | Requires extensive `NULL` fields (`location`, `coordinates`, `units`, `masterplan`) for construction items. | Every entity has strict, mandatory fields appropriate to its domain. |
| **Type Safety** | Conflates property statuses (`LIVE`, `SOLD_OUT`) with service statuses (`ACTIVE`, `INACTIVE`). | Independent ENUMs (`project_status` vs `service_status`). |
| **Enquiry Mapping** | Enquiries reference `project_slug` even for general construction inquiries. | Enquiries cleanly reference `project_id` OR `construction_service_id`. |
| **Trade-Off** | Fewer database tables. | Requires an additional table and optional foreign key on `enquiries`. |

**Decision:** Option B is implemented. `construction_services` handles turnkey building and architectural offerings independently, while `projects` represents real estate land and development layouts.

---

## 3. TypeScript Mismatches & Database Schema Resolution

| Current TypeScript Field (`types/*.ts`) | Proposed Database Representation | Reason for Adjustment |
| :--- | :--- | :--- |
| `Project.category` string union | `project_category` ENUM | Guarantees database-level validation (`RESIDENTIAL`, `PLOTS`, `CONSTRUCTION`, `COMMERCIAL`). |
| `Project.status` string union | `project_status` ENUM | Validates lifecycle states (`LIVE`, `ONGOING`, `COMPLETED`, `UPCOMING`, `SOLD_OUT`). |
| `Project.highlights` / `amenities` (`string[]`) | `TEXT[]` array columns | Native PostgreSQL string arrays integrate directly with TypeScript `string[]`. |
| `Project.coordinates` (`{ lat, lng }`) | `JSONB` (`{"lat": number, "lng": number}`) | Mirrors standard API payload structures cleanly. |
| `Enquiry.consent` (`boolean`) | `BOOLEAN NOT NULL CHECK (consent = true)` | Enforces mandatory legal consent at database level. |

---

## 4. Entity Inventory & Detailed Table Specifications (15 Entities)

### 4.1. Authentication & System Administration

#### Table 1: `profiles`
Represents administrative users linked directly to Supabase Auth (`auth.users`).
- `id`: `UUID` (PRIMARY KEY, REFERENCES `auth.users(id)` ON DELETE CASCADE)
- `email`: `TEXT` (NOT NULL, UNIQUE)
- `full_name`: `TEXT` (NOT NULL)
- `role`: `TEXT` (NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')))
- `avatar_url`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

---

### 4.2. Real Estate Developments & Construction Offerings

#### Table 2: `projects`
Real estate developments, plot layouts, residential communities, and commercial projects.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `slug`: `TEXT` (NOT NULL, UNIQUE) — URL identifier. Disambiguated by locality suffix if titles duplicate (e.g. `anugraham-nagar-chennai` vs `anugraham-nagar-madurai`).
- `title`: `TEXT` (NOT NULL)
- `subtitle`: `TEXT` (NULLABLE)
- `category`: `project_category` ENUM (NOT NULL: `'RESIDENTIAL'`, `'PLOTS'`, `'CONSTRUCTION'`, `'COMMERCIAL'`)
- `status`: `project_status` ENUM (NOT NULL: `'LIVE'`, `'ONGOING'`, `'COMPLETED'`, `'UPCOMING'`, `'SOLD_OUT'`)
- `location`: `TEXT` (NOT NULL)
- `description`: `TEXT` (NOT NULL)
- `overview`: `TEXT` (NULLABLE)
- `highlights`: `TEXT[]` (NULLABLE)
- `amenities`: `TEXT[]` (NULLABLE)
- `pricing`: `TEXT` (NULLABLE) — Display pricing text (e.g. "Pricing upon request").
- `availability`: `TEXT` (NULLABLE)
- `coordinates`: `JSONB` (NULLABLE) — `{"lat": 13.0827, "lng": 80.2707}`
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `false`)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 3: `project_media`
Media assets (covers, galleries, masterplans, virtual walkthroughs) attached to projects.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `project_id`: `UUID` (NOT NULL, REFERENCES `projects(id)` ON DELETE CASCADE)
- `media_type`: `project_media_type` ENUM (NOT NULL: `'cover'`, `'gallery'`, `'masterplan'`, `'walkthrough'`)
- `url`: `TEXT` (NOT NULL)
- `caption`: `TEXT` (NULLABLE)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 4: `project_units`
Plot and unit inventory within developments.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `project_id`: `UUID` (NOT NULL, REFERENCES `projects(id)` ON DELETE CASCADE)
- `unit_number`: `TEXT` (NOT NULL) — Plot / Villa number.
- `unit_type`: `TEXT` (NULLABLE) — e.g. "Corner Plot", "3BHK Villa".
- `size_sqft`: `NUMERIC` (NULLABLE)
- `price`: `NUMERIC` (NULLABLE)
- `status`: `unit_status` ENUM (NOT NULL DEFAULT `'AVAILABLE'`: `'AVAILABLE'`, `'RESERVED'`, `'SOLD'`)
- `metadata`: `JSONB` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 5: `construction_services` (Dedicated Construction Entity)
Custom turnkey building and architectural construction service offerings.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `slug`: `TEXT` (NOT NULL, UNIQUE)
- `title`: `TEXT` (NOT NULL) — e.g. "Turnkey Villa Construction", "Architectural Blueprinting"
- `service_type`: `construction_service_type` ENUM (NOT NULL: `'TURNKEY_CONSTRUCTION'`, `'ARCHITECTURAL_DESIGN'`, `'INTERIOR_BUILD'`, `'RENOVATION'`)
- `description`: `TEXT` (NOT NULL)
- `estimated_cost_per_sqft`: `TEXT` (NULLABLE) — e.g. "₹2,200 - ₹2,800 / sq.ft."
- `typical_timeline`: `TEXT` (NULLABLE) — e.g. "6 to 9 Months"
- `included_deliverables`: `TEXT[]` (NULLABLE) — Deliverables array.
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `false`)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

---

### 4.3. Editorial Journal & Marketing Content

#### Table 6: `journal_posts`
Editorial articles and market insights.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `slug`: `TEXT` (NOT NULL, UNIQUE)
- `title`: `TEXT` (NOT NULL)
- `excerpt`: `TEXT` (NOT NULL)
- `content`: `TEXT` (NOT NULL)
- `category`: `TEXT` (NOT NULL)
- `published_at`: `TIMESTAMPTZ` (NULLABLE)
- `author_id`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `author_name`: `TEXT` (NOT NULL)
- `author_role`: `TEXT` (NULLABLE)
- `cover_media_url`: `TEXT` (NULLABLE)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `false`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 7: `company_timeline`
Verified company history milestones.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `year`: `TEXT` (NOT NULL)
- `title`: `TEXT` (NOT NULL)
- `description`: `TEXT` (NOT NULL)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `true`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 8: `team_members`
Approved leadership team profiles.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `name`: `TEXT` (NOT NULL)
- `role`: `TEXT` (NOT NULL)
- `bio`: `TEXT` (NULLABLE)
- `image_url`: `TEXT` (NULLABLE)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `true`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 9: `testimonials`
Consented customer reviews.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `author`: `TEXT` (NOT NULL)
- `role`: `TEXT` (NULLABLE)
- `quote`: `TEXT` (NOT NULL)
- `project_title`: `TEXT` (NULLABLE)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `false`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

---

### 4.4. Enquiry Pipeline & Internal CRM

#### Table 10: `enquiries`
Form submissions captured from public pages.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `name`: `TEXT` (NOT NULL)
- `email`: `TEXT` (NOT NULL)
- `phone`: `TEXT` (NOT NULL)
- `message`: `TEXT` (NOT NULL)
- `project_slug`: `TEXT` (NULLABLE)
- `project_id`: `UUID` (NULLABLE, REFERENCES `projects(id)` ON DELETE SET NULL)
- `construction_service_id`: `UUID` (NULLABLE, REFERENCES `construction_services(id)` ON DELETE SET NULL)
- `enquiry_type`: `enquiry_type` ENUM (NOT NULL: `'GENERAL'`, `'PROJECT'`, `'SITE_VISIT'`, `'PARTNERSHIP'`)
- `preferred_contact`: `preferred_contact` ENUM (NOT NULL: `'PHONE'`, `'EMAIL'`, `'WHATSAPP'`)
- `consent`: `BOOLEAN` (NOT NULL CHECK (consent = true))
- `status`: `enquiry_status` ENUM (NOT NULL DEFAULT `'NEW'`: `'NEW'`, `'IN_REVIEW'`, `'CONTACTED'`, `'CONVERTED'`, `'ARCHIVED'`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 11: `customers`
CRM client registry. Unique phone numbers prevent accidental duplicate entries during enquiry conversion.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `full_name`: `TEXT` (NOT NULL)
- `email`: `TEXT` (NULLABLE)
- `phone`: `TEXT` (NOT NULL, UNIQUE)
- `notes`: `TEXT` (NULLABLE)
- `source_enquiry_id`: `UUID` (NULLABLE, REFERENCES `enquiries(id)` ON DELETE SET NULL)
- `created_by`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 12: `site_visits`
Scheduled property site visits.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `customer_id`: `UUID` (NOT NULL, REFERENCES `customers(id)` ON DELETE CASCADE)
- `project_id`: `UUID` (NULLABLE, REFERENCES `projects(id)` ON DELETE SET NULL)
- `scheduled_at`: `TIMESTAMPTZ` (NOT NULL)
- `assigned_to`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `status`: `visit_status` ENUM (NOT NULL DEFAULT `'SCHEDULED'`: `'SCHEDULED'`, `'COMPLETED'`, `'CANCELLED'`, `'NO_SHOW'`)
- `feedback`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 13: `sales`
Sales opportunities and unit bookings.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `customer_id`: `UUID` (NOT NULL, REFERENCES `customers(id)` ON DELETE RESTRICT)
- `project_id`: `UUID` (NOT NULL, REFERENCES `projects(id)` ON DELETE RESTRICT)
- `unit_id`: `UUID` (NULLABLE, REFERENCES `project_units(id)` ON DELETE SET NULL)
- `stage`: `sale_stage` ENUM (NOT NULL DEFAULT `'LEAD'`: `'LEAD'`, `'NEGOTIATION'`, `'BOOKED'`, `'CLOSED_WON'`, `'CLOSED_LOST'`)
- `agreed_price`: `NUMERIC` (NULLABLE)
- `booking_date`: `TIMESTAMPTZ` (NULLABLE)
- `assigned_to`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `notes`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 14: `followups`
Administrative task tracking.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `customer_id`: `UUID` (NOT NULL, REFERENCES `customers(id)` ON DELETE CASCADE)
- `assigned_to`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `title`: `TEXT` (NOT NULL)
- `due_date`: `TIMESTAMPTZ` (NOT NULL)
- `status`: `followup_status` ENUM (NOT NULL DEFAULT `'PENDING'`: `'PENDING'`, `'COMPLETED'`, `'OVERDUE'`)
- `notes`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 15: `activity_logs`
Immutable administrative audit log.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `actor_id`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `action`: `TEXT` (NOT NULL)
- `target_table`: `TEXT` (NOT NULL)
- `target_id`: `UUID` (NULLABLE)
- `metadata`: `JSONB` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
