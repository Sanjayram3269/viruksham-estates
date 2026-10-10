"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Loader2 } from "lucide-react";

export function AdminSignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore errors during sign-out and proceed to clear client state
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
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
  );
}
