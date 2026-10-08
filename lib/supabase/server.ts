import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnvironment } from "./env";

// One client per request; never cache or share a user's cookie-backed client.
// Session refresh and authorization must be added in the authentication phase
// before using this helper for protected pages or admin operations.
export async function createClient() {
  const { url, publishableKey } = getSupabaseEnvironment();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The authentication phase
          // must supply a session-refresh proxy before sign-in is enabled.
        }
      },
    },
  });
}
