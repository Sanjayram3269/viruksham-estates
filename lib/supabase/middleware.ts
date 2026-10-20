import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { parseSupabaseEnvironment } from "./env";
import { getSafeRedirectPath } from "../auth/redirect";

export { getSafeRedirectPath };

/**
 * Next.js 16 Session Refresh & Admin Route Protection Proxy
 * Updates session cookies on incoming requests and enforces server-side profile role authorization for /admin routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Safe lazy environment check
  let env;
  try {
    env = parseSupabaseEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch {
    // If environment is missing/malformed, redirect /admin access to login with missing_config indicator.
    // Public routes remain unaffected.
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextUrl.pathname !== "/admin/login"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "missing_config");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // Protect /admin and all nested administrative routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // 1. Authenticate user session with Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Unauthenticated user flow
    if (!user) {
      if (!isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";

        const relativeNext = pathname + request.nextUrl.search;
        if (relativeNext.startsWith("/admin") && relativeNext !== "/admin/login") {
          url.searchParams.set("next", relativeNext);
        }
        return NextResponse.redirect(url);
      }
      return response;
    }

    // 2. Server-side profile authorization check (query profiles table for role)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile && (profile.role === "admin" || profile.role === "superadmin");

    if (!isAdmin) {
      // Authenticated user lacks administrator profile
      if (!isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    } else {
      // Authenticated administrator accessing login page -> redirect to dashboard/next
      if (isLoginPage) {
        const rawNext = request.nextUrl.searchParams.get("next");
        const safePath = getSafeRedirectPath(rawNext);
        const url = request.nextUrl.clone();
        url.pathname = safePath;
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
