import assert from "node:assert/strict";
import test from "node:test";
import { parseSupabaseEnvironment } from "../lib/supabase/env.ts";

// Configuration fixtures only. These are not credentials or business records.
const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_only_not_a_real_key",
  NODE_ENV: "production",
};

test("accepts a hosted project and normalizes surrounding whitespace", () => {
  assert.deepEqual(
    parseSupabaseEnvironment({
      ...valid,
      NEXT_PUBLIC_SUPABASE_URL: ` ${valid.NEXT_PUBLIC_SUPABASE_URL}/ `,
    }),
    {
      url: valid.NEXT_PUBLIC_SUPABASE_URL,
      publishableKey: valid.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  );
});

test("requires both settings without disclosing their values", () => {
  for (const name of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ]) {
    assert.throws(() => parseSupabaseEnvironment({ ...valid, [name]: " " }));
  }
});

test("rejects secret keys and legacy JWTs without echoing them", () => {
  for (const key of ["sb_secret_test_only", "eyJ.test.signature", "invalid"]) {
    assert.throws(
      () =>
        parseSupabaseEnvironment({
          ...valid,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
        }),
      (error) => {
        assert.ok(!error.message.includes(key));
        return true;
      },
    );
  }
});

test("rejects malformed URLs, embedded credentials, paths, queries and fragments", () => {
  for (const url of [
    "invalid",
    "http://fixture.supabase.co",
    "https://user:password@fixture.supabase.co",
    "https://fixture.supabase.co/rest/v1",
    "https://fixture.supabase.co?secret=test",
    "https://fixture.supabase.co#fragment",
  ]) {
    assert.throws(
      () => parseSupabaseEnvironment({ ...valid, NEXT_PUBLIC_SUPABASE_URL: url }),
      (error) => {
        assert.ok(!error.message.includes(url));
        return true;
      },
    );
  }
});

test("permits local HTTP only outside production", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
    const environment = {
      ...valid,
      NEXT_PUBLIC_SUPABASE_URL: `http://${host}:54321`,
    };
    assert.throws(() => parseSupabaseEnvironment(environment));
    assert.equal(
      parseSupabaseEnvironment({ ...environment, NODE_ENV: "development" }).url,
      environment.NEXT_PUBLIC_SUPABASE_URL,
    );
  }
  assert.throws(() =>
    parseSupabaseEnvironment({
      ...valid,
      NODE_ENV: "development",
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost.example.com",
    }),
  );
});
