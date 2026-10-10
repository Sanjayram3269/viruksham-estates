import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "superadmin";
  avatarUrl: string | null;
}

export interface GetAdminUserResult {
  user: { id: string; email?: string } | null;
  profile: AdminUser | null;
  isAdmin: boolean;
  error?: string;
}

/**
 * Server-side administrator profile verification.
 * Fetches the authenticated user from Supabase Auth and validates their
 * profile and role in the public.profiles database table.
 */
export async function getAdminUser(): Promise<GetAdminUserResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { user: null, profile: null, isAdmin: false };
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr || !profile) {
      return {
        user: { id: user.id, email: user.email },
        profile: null,
        isAdmin: false,
        error: "Profile not found or inaccessible.",
      };
    }

    const isAdmin =
      profile.role === "admin" || profile.role === "superadmin";

    if (!isAdmin) {
      return {
        user: { id: user.id, email: user.email },
        profile: null,
        isAdmin: false,
        error: "User does not hold administrator role.",
      };
    }

    return {
      user: { id: user.id, email: user.email },
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role as "admin" | "superadmin",
        avatarUrl: profile.avatar_url,
      },
      isAdmin: true,
    };
  } catch (error) {
    return {
      user: null,
      profile: null,
      isAdmin: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
