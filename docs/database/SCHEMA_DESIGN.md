# Viruksham Estates — Database Schema Design

## 1. Overview & Architectural Principles

This document defines the production PostgreSQL database schema for **Viruksham Estates**, supporting the Next.js public web platform, project catalogue, editorial journal, administrator CMS, and internal real estate CRM pipeline.

### Core Design Principles
1. **Source of Truth Alignment:** Aligned directly with TypeScript types (`types/project.ts`, `types/journal.ts`, `types/company.ts`, `types/enquiry.ts`) and Zod validation schemas (`lib/validations/enquiry.ts`).
2. **Strict Identity & Primary Keys:** Standardized on `UUID` (`gen_random_uuid()`) for all primary keys.
3. **Public vs. Admin Access Isolation:** Public site access is strictly limited to published records (`is_published = true` / `published_at <= now()`). Protected CRM entities (`customers`, `site_visits`, `sales`, `followups`, `activity_logs`) are isolated behind Row Level Security (RLS) policies allowing access only to authenticated administrators.
4. **Consent & Privacy Compliance:** Public enquiry submission enforces explicit user consent (`consent = true`). Customer records created from enquiries maintain privacy boundaries and auditable lineage.
5. **No Data Fabrication:** Schema fields permit `NULL` values where business details (pricing, unit breakdowns, exact coordinates) have not yet been supplied by the client.

---

## 2. TypeScript Mismatches & Database Schema Resolution

| Current TypeScript Field (`types/*.ts`) | Proposed Database Representation | Reason for Adjustment |
| :--- | :--- | :--- |
| `Project.category` string union | `project_category` ENUM | Guarantees database-level validation (`RESIDENTIAL`, `PLOTS`, `CONSTRUCTION`, `COMMERCIAL`). |
| `Project.status` string union | `project_status` ENUM | Validates lifecycle states (`LIVE`, `ONGOING`, `COMPLETED`, `UPCOMING`, `SOLD_OUT`). |
| `Project.highlights` / `amenities` (`string[]`) | `TEXT[]` array columns | Native PostgreSQL string arrays integrate directly with TypeScript `string[]`. |
| `Project.coordinates` (`{ lat, lng }`) | `JSONB` or `POINT` | Represented as `JSONB` (`{"lat": number, "lng": number}`) to mirror standard API payload structures without spatial extensions. |
| `JournalPost.author` (`{ name, role }`) | `author_id` (FK to `profiles`) + denormalized `author_name`, `author_role` | Preserves author attributes even if profile records are archived or updated. |
| `Enquiry.consent` (`boolean`) | `BOOLEAN NOT NULL CHECK (consent = true)` | Enforces mandatory legal consent at database level. |

---

## 3. Entity Inventory & Detailed Table Specifications

### 3.1. Authentication & System Administration

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

### 3.2. Real Estate Developments & Construction Offerings

#### Table 2: `projects`
Core catalogue of real estate developments (residential, land plots, commercial) and construction offerings.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `slug`: `TEXT` (NOT NULL, UNIQUE) — URL identifier. Disambiguated by location suffix if display titles duplicate (e.g. `viruksham-gardens-chennai`).
- `title`: `TEXT` (NOT NULL) — Display name.
- `subtitle`: `TEXT` (NULLABLE)
- `category`: `project_category` ENUM (NOT NULL: `'RESIDENTIAL'`, `'PLOTS'`, `'CONSTRUCTION'`, `'COMMERCIAL'`)
- `status`: `project_status` ENUM (NOT NULL: `'LIVE'`, `'ONGOING'`, `'COMPLETED'`, `'UPCOMING'`, `'SOLD_OUT'`)
- `location`: `TEXT` (NOT NULL) — Geographic locality/city.
- `description`: `TEXT` (NOT NULL) — Primary overview description.
- `overview`: `TEXT` (NULLABLE) — Detailed extended narrative.
- `highlights`: `TEXT[]` (NULLABLE) — Key feature points.
- `amenities`: `TEXT[]` (NULLABLE) — Available site amenities.
- `pricing`: `TEXT` (NULLABLE) — Public display pricing text (e.g. "Pricing upon request").
- `availability`: `TEXT` (NULLABLE) — High-level availability summary.
- `coordinates`: `JSONB` (NULLABLE) — Latitude/longitude object `{"lat": 13.0827, "lng": 80.2707}`.
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
Optional unit breakdown and plot inventory within developments.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `project_id`: `UUID` (NOT NULL, REFERENCES `projects(id)` ON DELETE CASCADE)
- `unit_number`: `TEXT` (NOT NULL) — Plot / Villa / Apartment number.
- `unit_type`: `TEXT` (NULLABLE) — e.g. "3BHK Villa", "Corner Plot".
- `size_sqft`: `NUMERIC` (NULLABLE)
- `price`: `NUMERIC` (NULLABLE)
- `status`: `unit_status` ENUM (NOT NULL DEFAULT `'AVAILABLE'`: `'AVAILABLE'`, `'RESERVED'`, `'SOLD'`)
- `metadata`: `JSONB` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

---

### 3.3. Editorial Journal & Marketing Content

#### Table 5: `journal_posts`
Editorial articles and industry insights.
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

#### Table 6: `company_timeline`
Verified company history milestones.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `year`: `TEXT` (NOT NULL)
- `title`: `TEXT` (NOT NULL)
- `description`: `TEXT` (NOT NULL)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `true`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 7: `team_members`
Approved leadership team profiles.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `name`: `TEXT` (NOT NULL)
- `role`: `TEXT` (NOT NULL)
- `bio`: `TEXT` (NULLABLE)
- `image_url`: `TEXT` (NULLABLE)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `true`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 8: `testimonials`
Consented customer testimonials.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `author`: `TEXT` (NOT NULL)
- `role`: `TEXT` (NULLABLE)
- `quote`: `TEXT` (NOT NULL)
- `project_title`: `TEXT` (NULLABLE)
- `display_order`: `INTEGER` (NOT NULL DEFAULT `0`)
- `is_published`: `BOOLEAN` (NOT NULL DEFAULT `false`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

---

### 3.4. Enquiry Pipeline & Internal CRM

#### Table 9: `enquiries`
Submissions captured from public website forms.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `name`: `TEXT` (NOT NULL)
- `email`: `TEXT` (NOT NULL)
- `phone`: `TEXT` (NOT NULL)
- `message`: `TEXT` (NOT NULL)
- `project_slug`: `TEXT` (NULLABLE)
- `project_id`: `UUID` (NULLABLE, REFERENCES `projects(id)` ON DELETE SET NULL)
- `enquiry_type`: `enquiry_type` ENUM (NOT NULL: `'GENERAL'`, `'PROJECT'`, `'SITE_VISIT'`, `'PARTNERSHIP'`)
- `preferred_contact`: `preferred_contact` ENUM (NOT NULL: `'PHONE'`, `'EMAIL'`, `'WHATSAPP'`)
- `consent`: `BOOLEAN` (NOT NULL CHECK (consent = true))
- `status`: `enquiry_status` ENUM (NOT NULL DEFAULT `'NEW'`: `'NEW'`, `'IN_REVIEW'`, `'CONTACTED'`, `'CONVERTED'`, `'ARCHIVED'`)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 10: `customers`
CRM client registry created from converted enquiries or direct administrative entry.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `full_name`: `TEXT` (NOT NULL)
- `email`: `TEXT` (NULLABLE)
- `phone`: `TEXT` (NOT NULL)
- `notes`: `TEXT` (NULLABLE)
- `source_enquiry_id`: `UUID` (NULLABLE, REFERENCES `enquiries(id)` ON DELETE SET NULL)
- `created_by`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 11: `site_visits`
Scheduled property site visits and outcome tracking.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `customer_id`: `UUID` (NOT NULL, REFERENCES `customers(id)` ON DELETE CASCADE)
- `project_id`: `UUID` (NULLABLE, REFERENCES `projects(id)` ON DELETE SET NULL)
- `scheduled_at`: `TIMESTAMPTZ` (NOT NULL)
- `assigned_to`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `status`: `visit_status` ENUM (NOT NULL DEFAULT `'SCHEDULED'`: `'SCHEDULED'`, `'COMPLETED'`, `'CANCELLED'`, `'NO_SHOW'`)
- `feedback`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 12: `sales`
Real estate booking and sales pipeline opportunities.
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

#### Table 13: `followups`
Administrative follow-up tasks assigned to CRM managers.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `customer_id`: `UUID` (NOT NULL, REFERENCES `customers(id)` ON DELETE CASCADE)
- `assigned_to`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `title`: `TEXT` (NOT NULL)
- `due_date`: `TIMESTAMPTZ` (NOT NULL)
- `status`: `followup_status` ENUM (NOT NULL DEFAULT `'PENDING'`: `'PENDING'`, `'COMPLETED'`, `'OVERDUE'`)
- `notes`: `TEXT` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
- `updated_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)

#### Table 14: `activity_logs`
Audit log recording administrative changes across CRM entities.
- `id`: `UUID` (PRIMARY KEY DEFAULT `gen_random_uuid()`)
- `actor_id`: `UUID` (NULLABLE, REFERENCES `profiles(id)` ON DELETE SET NULL)
- `action`: `TEXT` (NOT NULL) — e.g., `'CREATE_CUSTOMER'`, `'UPDATE_SALE_STAGE'`
- `target_table`: `TEXT` (NOT NULL)
- `target_id`: `UUID` (NULLABLE)
- `metadata`: `JSONB` (NULLABLE)
- `created_at`: `TIMESTAMPTZ` (NOT NULL DEFAULT `now()`)
