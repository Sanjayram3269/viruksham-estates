import { getSupabaseEnvironment } from "../lib/supabase/env.ts";

// Read-only connectivity check. No tables, users, sessions or business records
// are created. Do not print environment values or remote response bodies.
try {
  const { url, publishableKey } = getSupabaseEnvironment();
  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: publishableKey },
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
  });

  if (!response.ok) {
    throw new Error(`Supabase connection check failed (HTTP ${response.status}).`);
  }

  const settings = await response.json();
  if (!settings || typeof settings.external !== "object" || settings.external === null) {
    throw new Error("Supabase did not return the expected Auth settings response.");
  }

  console.log("Supabase Auth endpoint reachable; publishable key accepted.");
  console.log("This does not verify database permissions, RLS, or admin authentication.");
} catch (error) {
  console.error(
    error instanceof TypeError
      ? "Supabase connection failed. Check the project URL and network access."
      : error instanceof Error
        ? error.message
        : "Supabase connection check failed.",
  );
  process.exitCode = 1;
}
