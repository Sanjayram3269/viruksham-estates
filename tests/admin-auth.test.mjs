/**
 * Viruksham Estates — Phase 2A Authentication & Route Protection Unit Tests
 * =========================================================================
 * File: tests/admin-auth.test.mjs
 * Runner: Node.js built-in test runner
 * Command: node --experimental-strip-types --test tests/admin-auth.test.mjs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Import helper functions
import { getSafeRedirectPath } from '../lib/auth/redirect.ts';
import { parseSupabaseEnvironment } from '../lib/supabase/env.ts';
import { executeAdminSignOut } from '../lib/auth/sign-out.ts';

// ---------------------------------------------------------------------------
// 1. Safe Redirect Path Validation (Open-Redirect Prevention)
// ---------------------------------------------------------------------------

describe('[AUTH UNIT] Open Redirect Prevention (getSafeRedirectPath)', () => {
  test('Null or empty rawNext returns default dashboard path', () => {
    assert.equal(getSafeRedirectPath(null), '/admin/dashboard');
    assert.equal(getSafeRedirectPath(''), '/admin/dashboard');
    assert.equal(getSafeRedirectPath('   '), '/admin/dashboard');
  });

  test('Valid relative /admin subpaths are preserved', () => {
    assert.equal(getSafeRedirectPath('/admin/projects'), '/admin/projects');
    assert.equal(getSafeRedirectPath('/admin/customers?page=2'), '/admin/customers?page=2');
    assert.equal(getSafeRedirectPath('/admin/settings'), '/admin/settings');
  });

  test('Protocol-relative and external domain URLs are rejected', () => {
    assert.equal(getSafeRedirectPath('//evil.com/phish'), '/admin/dashboard');
    assert.equal(getSafeRedirectPath('https://evil.com/admin'), '/admin/dashboard');
    assert.equal(getSafeRedirectPath('http://attacker.org'), '/admin/dashboard');
    assert.equal(getSafeRedirectPath('\\\\attacker.org'), '/admin/dashboard');
  });

  test('/admin/login is rejected to prevent redirect loops', () => {
    assert.equal(getSafeRedirectPath('/admin/login'), '/admin/dashboard');
  });
});

// ---------------------------------------------------------------------------
// 2. Environment Configuration Validation
// ---------------------------------------------------------------------------

describe('[AUTH UNIT] Supabase Environment Config Validation', () => {
  test('Valid local HTTP configuration is accepted in development', () => {
    const config = parseSupabaseEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
      NODE_ENV: 'development',
    });

    assert.equal(config.url, 'http://127.0.0.1:54321');
    assert.equal(config.publishableKey, 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH');
  });

  test('Missing URL throws descriptive error without disclosing secret values', () => {
    assert.throws(
      () =>
        parseSupabaseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: undefined,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
        }),
      /Set NEXT_PUBLIC_SUPABASE_URL/
    );
  });

  test('Legacy JWT or secret keys are strictly rejected', () => {
    assert.throws(
      () =>
        parseSupabaseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        }),
      /sb_publishable_ key/
    );
  });
});

// ---------------------------------------------------------------------------
// 3. Security Boundary & Secret Exposing Audit
// ---------------------------------------------------------------------------

describe('[AUTH SECURITY AUDIT] Secret & Client Bundle Isolation', () => {
  const CLIENT_FILES = [
    'lib/supabase/client.ts',
    'lib/supabase/env.ts',
    'lib/supabase/middleware.ts',
    'lib/auth/sign-out.ts',
    'components/admin/admin-login-form.tsx',
    'components/admin/admin-sign-out.tsx',
    'app/admin/login/page.tsx',
  ];

  for (const relPath of CLIENT_FILES) {
    test(`Client file does not contain service-role key: ${relPath}`, () => {
      const fullPath = join(ROOT, relPath);
      assert.ok(existsSync(fullPath), `File must exist: ${relPath}`);
      const content = readFileSync(fullPath, 'utf-8');

      assert.ok(
        !content.includes('SUPABASE_SERVICE_ROLE_KEY'),
        `Client file ${relPath} must NOT reference SUPABASE_SERVICE_ROLE_KEY`
      );
      assert.ok(
        !content.includes('sb_secret_'),
        `Client file ${relPath} must NOT contain hardcoded secret keys`
      );
    });
  }

  test('No password or secret credentials logged in client or middleware code', () => {
    const middlewarePath = join(ROOT, 'lib/supabase/middleware.ts');
    const middlewareContent = readFileSync(middlewarePath, 'utf-8');

    assert.ok(
      !middlewareContent.includes('console.log') && !middlewareContent.includes('console.dir'),
      'Middleware must not log session details'
    );
  });
});

// ---------------------------------------------------------------------------
// 4. Administrator Sign-Out Handler & Failure Isolation
// ---------------------------------------------------------------------------

describe('[AUTH UNIT] Administrator Sign-Out Handler (executeAdminSignOut)', () => {
  test('Successful sign-out returns success = true and no error', async () => {
    const result = await executeAdminSignOut(async () => ({ error: null }));

    assert.equal(result.success, true);
    assert.equal(result.error, null);
  });

  test('Failed sign-out with API error message returns actionable feedback and success = false', async () => {
    const result = await executeAdminSignOut(async () => ({
      error: { message: 'Server session revocation rejected' },
    }));

    assert.equal(result.success, false);
    assert.ok(result.error !== null);
    assert.ok(result.error.includes('Server session revocation rejected'));
    assert.ok(result.error.includes('Refresh the page and try again'));
  });

  test('Failed sign-out with empty error object falls back to standard message', async () => {
    const result = await executeAdminSignOut(async () => ({
      error: {},
    }));

    assert.equal(result.success, false);
    assert.ok(result.error !== null);
    assert.ok(result.error.includes('Failed to terminate session on server'));
    assert.ok(result.error.includes('Refresh the page'));
  });

  test('Thrown exception in sign-out is safely caught and returns user-facing error', async () => {
    const result = await executeAdminSignOut(async () => {
      throw new Error('Network connection severed');
    });

    assert.equal(result.success, false);
    assert.ok(result.error !== null);
    assert.ok(result.error.includes('Network connection severed'));
    assert.ok(result.error.includes('Refresh the page'));
  });

  test('AdminSignOutButton component does not redirect on failure and renders error', () => {
    const compPath = join(ROOT, 'components/admin/admin-sign-out.tsx');
    assert.ok(existsSync(compPath), 'AdminSignOutButton component must exist');
    const content = readFileSync(compPath, 'utf-8');

    // router.push must only be executed if result.success is true (i.e. guarded by if (!result.success) return)
    assert.ok(
      content.includes('if (!result.success)'),
      'Sign-out button must guard redirect with success check'
    );
    assert.ok(
      !content.match(/finally\s*\{[^}]*router\.push/),
      'router.push must NOT be in a finally block'
    );
    // Component renders error state
    assert.ok(
      content.includes('signOutError &&'),
      'Component must render signOutError when non-null'
    );
  });
});

