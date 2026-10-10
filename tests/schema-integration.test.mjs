/**
 * Viruksham Estates — Phase 1B Schema Integration Tests
 * ======================================================
 * File: tests/schema-integration.test.mjs
 * Runner: Node.js built-in test runner
 * Command: node --experimental-strip-types --test tests/schema-integration.test.mjs
 *
 * TEST MODE LEGEND:
 * [SOURCE CHECK]   — Reads migration SQL files from disk. No DB required.
 *                    These tests run in any environment.
 * [REQUIRES DB]    — Requires a running Supabase local instance.
 *                    Run: supabase start
 *                    Then set TEST_DB_URL in environment.
 *                    BLOCKER: Supabase CLI is NOT installed on this machine.
 *                    These tests are defined but clearly skip with explanation.
 *
 * SUPABASE CLI STATUS:
 * `supabase --version` returns CommandNotFoundException on this machine.
 * Runtime RLS and is_admin() validation cannot be performed locally until
 * the CLI is installed. See docs/database/MIGRATION_PLAN.md for install steps.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MIGRATIONS_DIR = join(ROOT, 'supabase', 'migrations');

/** Helper: read a migration file and return its content as a string. */
function readMigration(filename) {
  const filePath = join(MIGRATIONS_DIR, filename);
  assert.ok(existsSync(filePath), `Migration file must exist: ${filename}`);
  return readFileSync(filePath, 'utf-8');
}

// ---------------------------------------------------------------------------
// EXPECTED MIGRATION FILES — enforce naming convention and ordering
// ---------------------------------------------------------------------------

const EXPECTED_MIGRATIONS = [
  '20261010000000_schema_design_draft.sql', // design artifact (not applied)
  '20261010000001_enums.sql',
  '20261010000002_profiles_and_auth.sql',
  '20261010000003_public_content.sql',
  '20261010000004_enquiries.sql',
  '20261010000005_crm.sql',
  '20261010000006_indexes.sql',
  '20261010000007_rls.sql',
];

// ---------------------------------------------------------------------------
// [SOURCE CHECK] Migration File Existence
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Migration files exist with correct names', () => {
  for (const filename of EXPECTED_MIGRATIONS) {
    test(`Migration exists: ${filename}`, () => {
      assert.ok(
        existsSync(join(MIGRATIONS_DIR, filename)),
        `Expected migration file not found: ${filename}`
      );
    });
  }
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] All 11 ENUM Types Defined in Migration 001
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Migration 001 — ENUM types', () => {
  const sql = readMigration('20261010000001_enums.sql');

  const expectedEnums = [
    'project_category',
    'project_status',
    'project_media_type',
    'unit_status',
    'construction_service_type',
    'enquiry_type',
    'preferred_contact',
    'enquiry_status',
    'visit_status',
    'sale_stage',
    'followup_status',
  ];

  for (const enumName of expectedEnums) {
    test(`ENUM type declared: ${enumName}`, () => {
      assert.ok(
        sql.includes(`CREATE TYPE public.${enumName}`),
        `Expected ENUM type not found: public.${enumName}`
      );
    });
  }
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] is_admin() Security Hardening (Migration 002)
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Migration 002 — is_admin() security hardening', () => {
  const sql = readMigration('20261010000002_profiles_and_auth.sql');

  test('is_admin() is declared SECURITY DEFINER', () => {
    assert.ok(
      sql.includes('SECURITY DEFINER'),
      'is_admin() must be SECURITY DEFINER to bypass caller RLS'
    );
  });

  test('is_admin() sets row_security = off', () => {
    assert.ok(
      sql.includes('SET row_security = off'),
      'is_admin() must disable row_security to prevent infinite recursion on profiles'
    );
  });

  test('is_admin() sets fixed search_path', () => {
    assert.ok(
      sql.includes('SET search_path = public, pg_temp'),
      'is_admin() must fix search_path to prevent schema injection attacks'
    );
  });

  test('REVOKE EXECUTE FROM PUBLIC on is_admin()', () => {
    assert.ok(
      sql.includes('REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC'),
      'is_admin() must revoke execute from PUBLIC before granting to authenticated'
    );
  });

  test('GRANT EXECUTE TO authenticated on is_admin()', () => {
    assert.ok(
      sql.includes('GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated') ||
      sql.includes('GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated'),
      'is_admin() must grant execute only to authenticated role'
    );
  });

  test('Role self-elevation prevention trigger declared', () => {
    assert.ok(
      sql.includes('prevent_role_self_elevation'),
      'Migration 002 must include the role self-elevation prevention trigger'
    );
  });

  test('profiles table references auth.users', () => {
    assert.ok(
      sql.includes('REFERENCES auth.users(id)'),
      'profiles.id must reference auth.users(id) to link with Supabase Auth'
    );
  });
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] 15 Entities Across Migrations 003–005
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] All 15 entities declared across migrations', () => {
  const sql003 = readMigration('20261010000003_public_content.sql');
  const sql004 = readMigration('20261010000004_enquiries.sql');
  const sql005 = readMigration('20261010000005_crm.sql');
  const allPublicSql = sql003 + sql004;

  // 8 public content entities
  const publicEntities = [
    'projects',
    'project_media',
    'project_units',
    'construction_services',
    'journal_posts',
    'company_timeline',
    'team_members',
    'testimonials',
  ];

  for (const entity of publicEntities) {
    test(`Public entity declared: ${entity}`, () => {
      assert.ok(
        allPublicSql.includes(`CREATE TABLE public.${entity}`),
        `Public entity not found: public.${entity}`
      );
    });
  }

  // 5 CRM entities
  const crmEntities = [
    'customers',
    'site_visits',
    'sales',
    'followups',
    'activity_logs',
  ];

  for (const entity of crmEntities) {
    test(`CRM entity declared: ${entity}`, () => {
      assert.ok(
        sql005.includes(`CREATE TABLE public.${entity}`),
        `CRM entity not found: public.${entity}`
      );
    });
  }

  // construction_services must be separate from projects
  test('construction_services is a separate table from projects', () => {
    assert.ok(
      sql003.includes('CREATE TABLE public.construction_services'),
      'construction_services must be a separate table, not merged into projects'
    );
    assert.ok(
      sql003.includes('CREATE TABLE public.projects'),
      'projects table must exist separately'
    );
  });
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] Critical Schema Constraints
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Critical schema constraints', () => {
  test('enquiries.consent has CHECK (consent = true)', () => {
    const sql = readMigration('20261010000004_enquiries.sql');
    assert.ok(
      sql.includes('CHECK (consent = true)'),
      'enquiries.consent must have CHECK constraint enforcing true value'
    );
  });

  test('customers.phone is NOT NULL UNIQUE', () => {
    const sql = readMigration('20261010000005_crm.sql');
    assert.ok(
      sql.includes('phone') && sql.includes('NOT NULL UNIQUE'),
      'customers.phone must be NOT NULL UNIQUE for deduplication'
    );
  });

  test('sales uses ON DELETE RESTRICT for customer and project FKs', () => {
    const sql = readMigration('20261010000005_crm.sql');
    const salesSection = sql.substring(sql.indexOf('CREATE TABLE public.sales'));
    assert.ok(
      salesSection.includes('ON DELETE RESTRICT'),
      'sales.customer_id and sales.project_id must use ON DELETE RESTRICT to protect financial history'
    );
  });

  test('activity_logs has no updated_at column definition', () => {
    const sql = readMigration('20261010000005_crm.sql');
    const logsSection = sql.substring(
      sql.indexOf('CREATE TABLE public.activity_logs'),
      sql.indexOf('CREATE TABLE public.activity_logs') + 600
    );
    // Only match actual column definitions like "updated_at TIMESTAMPTZ".
    // The comment "-- No updated_at by design" must not trigger a false failure.
    const updatedAtColumn = /\bupdated_at\s+(TIMESTAMPTZ|TEXT|INTEGER|UUID)/i;
    assert.ok(
      !updatedAtColumn.test(logsSection),
      'activity_logs must not have an updated_at column — it is append-only'
    );
  });

  test('journal_posts has denormalized author_name alongside author_id FK', () => {
    const sql = readMigration('20261010000003_public_content.sql');
    const jpSection = sql.substring(sql.indexOf('CREATE TABLE public.journal_posts'));
    assert.ok(
      jpSection.includes('author_id') && jpSection.includes('author_name'),
      'journal_posts must have both author_id FK and denormalized author_name'
    );
  });
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] RLS Migration Completeness
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Migration 007 — RLS coverage', () => {
  const sql = readMigration('20261010000007_rls.sql');

  const allTables = [
    'profiles', 'projects', 'project_media', 'project_units',
    'construction_services', 'journal_posts', 'company_timeline',
    'team_members', 'testimonials', 'enquiries', 'customers',
    'site_visits', 'sales', 'followups', 'activity_logs',
  ];

  // Normalize whitespace before checking: the SQL uses column-aligned spacing
  // (e.g. "public.profiles          ENABLE") for readability.
  const sqlNormalized = sql.replace(/[ \t]+/g, ' ');

  for (const table of allTables) {
    test(`RLS enabled on: ${table}`, () => {
      assert.ok(
        sqlNormalized.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
        `RLS must be explicitly enabled on public.${table}`
      );
    });
  }

  test('activity_logs has NO UPDATE policy (immutable audit)', () => {
    // There should be no FOR UPDATE policy on activity_logs.
    const logsUpdatePolicy = /ON public\.activity_logs\s+FOR UPDATE/;
    assert.ok(
      !logsUpdatePolicy.test(sql),
      'activity_logs must not have a FOR UPDATE policy — audit log is immutable'
    );
  });

  test('activity_logs has NO DELETE policy (immutable audit)', () => {
    const logsDeletePolicy = /ON public\.activity_logs\s+FOR DELETE/;
    assert.ok(
      !logsDeletePolicy.test(sql),
      'activity_logs must not have a FOR DELETE policy — audit log is immutable'
    );
  });

  test('Enquiry INSERT policy requires consent = true', () => {
    assert.ok(
      sql.includes('consent = true'),
      'enquiries INSERT policy must check consent = true at RLS level'
    );
  });

  test('Public projects policy checks is_published = true', () => {
    assert.ok(
      sql.includes('is_published = true'),
      'Public read policies must filter by is_published = true'
    );
  });

  test('Admin policies use public.is_admin()', () => {
    assert.ok(
      sql.includes('public.is_admin()'),
      'All admin policies must use public.is_admin() for authorization'
    );
  });
});

// ---------------------------------------------------------------------------
// [SOURCE CHECK] Index Coverage (Migration 006)
// ---------------------------------------------------------------------------

describe('[SOURCE CHECK] Migration 006 — index coverage', () => {
  const sql = readMigration('20261010000006_indexes.sql');

  const expectedIndexes = [
    'idx_projects_slug',
    'idx_projects_public_filter',
    'idx_construction_services_slug',
    'idx_construction_services_public',
    'idx_journal_posts_slug',
    'idx_journal_posts_published',
    'idx_project_media_project',
    'idx_customers_phone',
    'idx_customers_email',
    'idx_enquiries_status_date',
    'idx_site_visits_scheduled',
    'idx_sales_pipeline',
    'idx_followups_due',
  ];

  for (const idx of expectedIndexes) {
    test(`Index declared: ${idx}`, () => {
      assert.ok(
        sql.includes(idx),
        `Expected index not found in migration 006: ${idx}`
      );
    });
  }
});

// ---------------------------------------------------------------------------
// [REQUIRES DB] Runtime RLS Tests — BLOCKED: Supabase CLI not installed
// ---------------------------------------------------------------------------

describe('[REQUIRES DB] Runtime RLS Tests (BLOCKED — Supabase CLI not installed)', () => {
  /**
   * These tests CANNOT run because `supabase --version` fails on this machine.
   * Supabase CLI is required to:
   *   1. Run `supabase start` to spin up a local PostgreSQL instance
   *   2. Run `supabase db push` to apply migrations
   *   3. Connect to the local DB URL for integration queries
   *
   * INSTALL THE CLI:
   *   Windows (scoop): scoop install supabase
   *   Or download from: https://github.com/supabase/cli/releases
   *
   * AFTER INSTALLING:
   *   supabase start
   *   Set TEST_DB_URL=postgresql://postgres:postgres@localhost:54322/postgres
   *   node --experimental-strip-types --test tests/schema-integration.test.mjs
   *
   * Pending tests cover:
   *   - Fresh migration apply (migration ordering, no FK errors)
   *   - Anon INSERT into enquiries with consent = true (should succeed)
   *   - Anon INSERT into enquiries with consent = false (should fail)
   *   - Anon READ customers table (should fail — CRM is admin-only)
   *   - Anon READ published projects (should succeed)
   *   - Anon READ unpublished projects (should fail)
   *   - Authenticated non-admin READ customers (should fail)
   *   - Authenticated admin READ customers (should succeed)
   *   - Authenticated admin INSERT activity_log (should succeed)
   *   - Authenticated admin UPDATE activity_log (should fail — immutable)
   *   - Authenticated admin DELETE activity_log (should fail — immutable)
   *   - Admin attempt to elevate own role (should fail — trigger)
   *   - Duplicate phone INSERT into customers (should fail — UNIQUE)
   *   - DELETE project with sales history (should fail — RESTRICT)
   */

  const CLI_BLOCKER = 'BLOCKED: Supabase CLI not installed. Run: scoop install supabase';

  test('Anon can INSERT enquiry with consent = true', { skip: CLI_BLOCKER }, async () => {
    // Requires: TEST_DB_URL env var + running local Supabase
    // When unblocked:
    //   1. Connect to TEST_DB_URL
    //   2. SET ROLE anon; or use anon key
    //   3. INSERT INTO enquiries (..., consent = true) RETURNING id
    //   4. Assert: no error, row inserted
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Anon INSERT enquiry with consent = false must fail', { skip: CLI_BLOCKER }, async () => {
    // When unblocked:
    //   1. SET ROLE anon
    //   2. INSERT INTO enquiries (..., consent = false)
    //   3. Assert: PostgreSQL error (RLS violation or CHECK violation)
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Anon cannot read customers table', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Admin can read customers table', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Admin INSERT to activity_logs succeeds', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Admin UPDATE to activity_logs must fail (immutable audit)', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Admin DELETE from activity_logs must fail (immutable audit)', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Non-superadmin role self-elevation must fail (trigger)', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Duplicate customer phone insert must fail (UNIQUE)', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Delete project with active sales must fail (RESTRICT)', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('is_admin() does not recurse infinitely on profiles RLS', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });

  test('Rollback: all 7 migrations can be reverted cleanly', { skip: CLI_BLOCKER }, async () => {
    assert.fail('Not implemented — Supabase CLI required');
  });
});
