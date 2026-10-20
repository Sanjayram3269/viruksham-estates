"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { executeAdminSignOut } from "@/lib/auth/sign-out";
import { LogOut, Loader2, AlertCircle } from "lucide-react";

export function AdminSignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError(null);

    try {
      const supabase = createClient();
      const result = await executeAdminSignOut(() => supabase.auth.signOut());

      if (!result.success) {
        // Sign-out failed: stay on the page and display actionable error message.
        setSignOutError(result.error);
        return;
      }

      // Success: session cleared — navigate to login and revalidate server state.
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
        title="Sign out of Admin Portal"
      >
        {isSigningOut ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-500" />
        ) : (
          <LogOut className="h-3.5 w-3.5 text-stone-500" />
        )}
        <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
      </button>

      {signOutError && (
        <span className="flex items-center gap-1 text-[10px] text-red-700 font-medium max-w-xs text-right leading-tight">
          <AlertCircle className="h-3 w-3 shrink-0 text-red-600" />
          <span>{signOutError}</span>
        </span>
      )}
    </div>
  );
}

