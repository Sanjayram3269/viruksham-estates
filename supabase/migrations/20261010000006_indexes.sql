-- =============================================================================
-- Migration 006: Performance Indexes
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 003_public_content.sql, 004_enquiries.sql, 005_crm.sql
-- =============================================================================
-- Slug uniqueness indexes are declared here for clarity but the UNIQUE
-- constraint on each table already creates a backing index automatically.
-- Additional composite indexes optimize the most common query patterns.
-- =============================================================================

-- Projects: slug lookup (covered by UNIQUE, explicit for documentation)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug
  ON public.projects(slug);

-- Projects: public catalogue filter — category, status, published, ordering
CREATE INDEX idx_projects_public_filter
  ON public.projects(category, status, is_published, display_order);

-- Construction services: slug + public listing
CREATE UNIQUE INDEX IF NOT EXISTS idx_construction_services_slug
  ON public.construction_services(slug);

CREATE INDEX idx_construction_services_public
  ON public.construction_services(is_published, display_order);

-- Journal posts: slug + published timeline (DESC for latest-first listing)
CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_posts_slug
  ON public.journal_posts(slug);

CREATE INDEX idx_journal_posts_published
  ON public.journal_posts(is_published, published_at DESC);

-- Project media: ordered gallery retrieval per project
CREATE INDEX idx_project_media_project
  ON public.project_media(project_id, display_order);

-- Customers: phone (covered by UNIQUE), email secondary lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone
  ON public.customers(phone);

CREATE INDEX idx_customers_email
  ON public.customers(email);

-- Enquiries: CRM inbox view — ordered by creation date within status bucket
CREATE INDEX idx_enquiries_status_date
  ON public.enquiries(status, created_at DESC);

-- Site visits: scheduled calendar view
CREATE INDEX idx_site_visits_scheduled
  ON public.site_visits(scheduled_at, status);

-- Sales pipeline: assignee workload view
CREATE INDEX idx_sales_pipeline
  ON public.sales(stage, assigned_to);

-- Followups: overdue/upcoming task list per assignee
CREATE INDEX idx_followups_due
  ON public.followups(assigned_to, status, due_date);
