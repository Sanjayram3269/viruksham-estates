interface SupabaseEnvironment {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NODE_ENV?: string;
}

// Validate only when a client is requested. Existing static pages do not need
// Supabase configuration until they are connected to database queries.
export function parseSupabaseEnvironment(environment: SupabaseEnvironment) {
  const url = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL in .env.local.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid project URL.");
  }

  const isLocalDevelopment =
    environment.NODE_ENV !== "production" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(parsedUrl.hostname);

  if (
    (parsedUrl.protocol !== "https:" &&
      !(isLocalDevelopment && parsedUrl.protocol === "http:")) ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.search ||
    parsedUrl.hash ||
    parsedUrl.pathname !== "/"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be an HTTPS project origin without credentials, a path, query, or fragment. Local development may use HTTP on localhost.",
    );
  }

  // This new integration deliberately accepts modern publishable keys only.
  // Rejecting legacy JWTs also prevents a service-role JWT being used here.
  if (!publishableKey || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the sb_publishable_ key from Supabase. Secret and legacy JWT keys are not accepted.",
    );
  }

  return { url: parsedUrl.origin, publishableKey };
}

export function getSupabaseEnvironment() {
  // Keep these direct property references: Next.js inlines NEXT_PUBLIC_* values
  // into browser bundles at build time. Do not pass process.env wholesale.
  return parseSupabaseEnvironment({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
}
