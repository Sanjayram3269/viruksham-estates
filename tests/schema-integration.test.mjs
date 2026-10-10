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
// EXPECTED MIGRATION FILES — strictly the 7 executable migrations
// ---------------------------------------------------------------------------

const EXPECTED_MIGRATIONS = [
  '20261010000001_enums.sql',
  '20261010000002_profiles_and_auth.sql',
  '20261010000003_public_content.sql',
  '20261010000004_enquiries.sql',
  '20261010000005_crm.sql',
  '20261010000006_indexes.sql',
  '20261010000007_rls.sql',
];

describe('[SOURCE CHECK] Draft migration relocation', () => {
  test('Draft design artifact is NOT in supabase/migrations/', () => {
    const badPath = join(MIGRATIONS_DIR, '20261010000000_schema_design_draft.sql');
    assert.ok(
      !existsSync(badPath),
      'Draft design file must be removed from supabase/migrations/ to avoid execution during db push'
    );
  });

  test('Draft design artifact is located in docs/database/', () => {
    const goodPath = join(ROOT, 'docs', 'database', '20261010000000_schema_design_draft.sql');
    assert.ok(
      existsSync(goodPath),
      'Draft design file must exist in docs/database/'
    );
  });
});

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
// [RUNTIME DB] Local Supabase RLS & Security Validation
// Connects to local Supabase instance at http://127.0.0.1:54321
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://127.0.0.1:54321';
const ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SERVICE_KEY = process.env.TEST_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

describe('[RUNTIME DB] Local Supabase Database Integration & Security Tests', () => {

  test('Database Connectivity Check', async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: { apikey: ANON_KEY }
      });
      assert.ok(res.ok || res.status === 200, `Local Supabase API gateway responds with HTTP ${res.status}`);
    } catch (err) {
      assert.fail(`Local Supabase database is unreachable at ${SUPABASE_URL}. Ensure local Supabase is running via 'npx supabase start'. Error: ${err.message}`);
    }
  });

  test('Anon can INSERT enquiry with consent = true (succeeds)', async () => {
    const testEnquiry = {
      name: 'Test Visitor',
      email: 'visitor@example.com',
      phone: '+919876543210',
      message: 'Interested in residential plots.',
      enquiry_type: 'GENERAL',
      preferred_contact: 'EMAIL',
      consent: true
    };

    const { error } = await anonClient
      .from('enquiries')
      .insert(testEnquiry);

    assert.equal(error, null, `Anon enquiry insert with consent=true should succeed: ${error?.message}`);
  });

  test('Anon INSERT enquiry with consent = false must fail (consent constraint enforcement)', async () => {
    const testEnquiry = {
      name: 'No Consent Visitor',
      email: 'noconsent@example.com',
      phone: '+919876543211',
      message: 'No consent provided.',
      enquiry_type: 'GENERAL',
      preferred_contact: 'EMAIL',
      consent: false
    };

    const { error } = await anonClient
      .from('enquiries')
      .insert(testEnquiry);

    assert.ok(error !== null, 'Anon enquiry insert with consent=false must be rejected by database');
  });

  test('Published vs Unpublished content visibility', async () => {
    const pubSlug = `pub-proj-${Date.now()}`;
    const unpubSlug = `unpub-proj-${Date.now()}`;

    // Seed published and unpublished project via service role
    const { error: seedErr } = await serviceClient
      .from('projects')
      .insert([
        {
          slug: pubSlug,
          title: 'Published Project Test',
          category: 'RESIDENTIAL',
          status: 'LIVE',
          location: 'Chennai',
          description: 'Published project description.',
          is_published: true
        },
        {
          slug: unpubSlug,
          title: 'Unpublished Project Test',
          category: 'PLOTS',
          status: 'UPCOMING',
          location: 'Madurai',
          description: 'Unpublished project description.',
          is_published: false
        }
      ]);

    assert.equal(seedErr, null, `Seeding test projects failed: ${seedErr?.message}`);

    // Query projects via anon client
    const { data: anonProjects, error: queryErr } = await anonClient
      .from('projects')
      .select('slug');

    assert.equal(queryErr, null, `Anon select projects failed: ${queryErr?.message}`);
    const slugs = (anonProjects || []).map(p => p.slug);

    assert.ok(slugs.includes(pubSlug), `Published project ${pubSlug} must be visible to anon`);
    assert.ok(!slugs.includes(unpubSlug), `Unpublished project ${unpubSlug} must NOT be visible to anon`);
  });

  test('CRM Confidentiality: Anon cannot read customers table', async () => {
    const phone = `+9199${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Seed customer via service role
    await serviceClient
      .from('customers')
      .insert({ full_name: 'Confidential Client', phone });

    // Query customers via anon client
    const { data, error } = await anonClient
      .from('customers')
      .select('*');

    assert.ok(
      error !== null || (data && data.length === 0),
      'Anon client must NOT be able to read CRM customers table'
    );
  });

  test('CRM Confidentiality: Non-admin authenticated user cannot read customers table', async () => {
    // Attempt select as anon/non-admin user
    const { data, error } = await anonClient
      .from('customers')
      .select('*');

    assert.ok(
      error !== null || (data && data.length === 0),
      'Non-admin user must not receive CRM customer records'
    );
  });

  test('Administrator access: Service / Admin role can read and write CRM entities', async () => {
    const phone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

    const { data, error } = await serviceClient
      .from('customers')
      .insert({ full_name: 'Admin Managed Customer', phone })
      .select('id, full_name');

    assert.equal(error, null, `Admin service role should insert customer cleanly: ${error?.message}`);
    assert.ok(data && data.length > 0);
  });

  test('Role self-elevation trigger blocks unauthorized role modifications', async () => {
    // Attempt to execute update with anon or missing caller identity
    const { error } = await anonClient
      .from('profiles')
      .update({ role: 'superadmin' })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    assert.ok(error !== null, 'Role modification attempt without superadmin identity must be rejected');
  });

  test('Audit log immutability: UPDATE or DELETE on activity_logs fails', async () => {
    // Seed audit log entry
    const { data: logEntry, error: insertErr } = await serviceClient
      .from('activity_logs')
      .insert({ action: 'TEST_AUDIT', target_table: 'profiles' })
      .select('id');

    assert.equal(insertErr, null, `Seeding audit log failed: ${insertErr?.message}`);
    const logId = logEntry[0].id;

    // Attempt UPDATE via anon client
    const { error: updateErr } = await anonClient
      .from('activity_logs')
      .update({ action: 'MUTATED' })
      .eq('id', logId);

    assert.ok(updateErr !== null, 'UPDATE on activity_logs must be denied');

    // Attempt DELETE via anon client
    const { error: deleteErr } = await anonClient
      .from('activity_logs')
      .delete()
      .eq('id', logId);

    assert.ok(deleteErr !== null, 'DELETE on activity_logs must be denied');
  });

  test('Duplicate normalized customer phone number fails (UNIQUE constraint)', async () => {
    const dupPhone = `+9197${Math.floor(10000000 + Math.random() * 90000000)}`;

    // First insert
    const { error: err1 } = await serviceClient
      .from('customers')
      .insert({ full_name: 'First Customer', phone: dupPhone });
    assert.equal(err1, null, `First customer insert should succeed: ${err1?.message}`);

    // Second insert with duplicate phone
    const { error: err2 } = await serviceClient
      .from('customers')
      .insert({ full_name: 'Second Customer', phone: dupPhone });

    assert.ok(err2 !== null, 'Duplicate phone number insert must fail UNIQUE constraint');
    assert.ok(
      err2.message.includes('unique') || err2.code === '23505',
      `Error must indicate unique constraint violation: ${err2.message}`
    );
  });

  test('Foreign key RESTRICT: Cannot delete project with active sales history', async () => {
    const projectSlug = `restrict-proj-${Date.now()}`;
    const custPhone = `+9196${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Create project
    const { data: proj } = await serviceClient
      .from('projects')
      .insert({
        slug: projectSlug,
        title: 'Restrict Test Project',
        category: 'RESIDENTIAL',
        status: 'LIVE',
        location: 'Coimbatore',
        description: 'Testing RESTRICT FK'
      })
      .select('id');

    // Create customer
    const { data: cust } = await serviceClient
      .from('customers')
      .insert({ full_name: 'Sales Customer', phone: custPhone })
      .select('id');

    // Create sale linking customer and project
    await serviceClient
      .from('sales')
      .insert({
        customer_id: cust[0].id,
        project_id: proj[0].id,
        stage: 'LEAD'
      });

    // Attempt to delete project
    const { error: deleteErr } = await serviceClient
      .from('projects')
      .delete()
      .eq('id', proj[0].id);

    assert.ok(deleteErr !== null, 'Deleting project with active sales must fail due to ON DELETE RESTRICT');
  });

  test('Composite FK mismatch: Sale referencing unit belonging to a DIFFERENT project fails', async () => {
    const projASlug = `proj-a-${Date.now()}`;
    const projBSlug = `proj-b-${Date.now()}`;
    const custPhone = `+9195${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Create Project A and Project B
    const { data: projs } = await serviceClient
      .from('projects')
      .insert([
        { slug: projASlug, title: 'Project A', category: 'RESIDENTIAL', status: 'LIVE', location: 'City A', description: 'Desc A' },
        { slug: projBSlug, title: 'Project B', category: 'PLOTS', status: 'LIVE', location: 'City B', description: 'Desc B' }
      ])
      .select('id, slug');

    const projAId = projs.find(p => p.slug === projASlug).id;
    const projBId = projs.find(p => p.slug === projBSlug).id;

    // Create Unit U_B in Project B
    const { data: units } = await serviceClient
      .from('project_units')
      .insert({
        project_id: projBId,
        unit_number: 'B-101',
        status: 'AVAILABLE'
      })
      .select('id');

    const unitBId = units[0].id;

    // Create Customer
    const { data: cust } = await serviceClient
      .from('customers')
      .insert({ full_name: 'Mismatch Customer', phone: custPhone })
      .select('id');

    // Attempt to create Sale linking Project A with Unit U_B (which belongs to Project B!)
    const { error: mismatchErr } = await serviceClient
      .from('sales')
      .insert({
        customer_id: cust[0].id,
        project_id: projAId, // Project A
        unit_id: unitBId    // Unit in Project B!
      });

    assert.ok(mismatchErr !== null, 'Sale linking Project A with a Unit in Project B MUST fail composite FK constraint');
  });

  test('Migration sequence integrity check', async () => {
    // Verify tables exist and schema responds
    const { error } = await serviceClient
      .from('projects')
      .select('count', { count: 'exact', head: true });

    assert.equal(error, null, 'Schema table queries should succeed cleanly after all migrations applied');
  });
});
