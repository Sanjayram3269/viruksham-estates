"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { Shield, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryError = searchParams.get("error");
  const rawNext = searchParams.get("next");
  const targetPath = getSafeRedirectPath(rawNext);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. No session established.");
        setIsLoading(false);
        return;
      }

      // Check profile role client-side for immediate user feedback (middleware and server layout also enforce this)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const isAdmin =
        profile && (profile.role === "admin" || profile.role === "superadmin");

      if (!isAdmin) {
        // Sign out invalid user session immediately
        await supabase.auth.signOut();
        setError(
          "Access Denied: Your account does not hold administrator privileges."
        );
        setIsLoading(false);
        return;
      }

      // Redirect to target path and refresh server components
      router.push(targetPath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Alert Banners for Query Errors */}
      {queryError === "unauthorized" && !error && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Access Denied</p>
            <p className="mt-0.5 text-amber-700">
              Your account does not have administrator privileges required to access the admin portal.
            </p>
          </div>
        </div>
      )}

      {queryError === "missing_config" && !error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Configuration Error</p>
            <p className="mt-0.5 text-red-700">
              Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.
            </p>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="rounded-2xl border border-[#dce7d5] bg-white p-8 shadow-[0_24px_80px_rgba(16,58,40,.12)] sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/5 text-emerald-900 mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#103a28] sm:text-3xl">
            Viruksham Estates
          </h1>
          <p className="mt-2 text-sm font-extrabold uppercase tracking-[.2em] text-[#24763d]">
            Admin Portal
          </p>
          <p className="mt-3 text-sm leading-6 text-[#596b5d]">
            Use your authorised administrator account. Public visitors cannot access this workspace.
          </p>
        </div>

        {/* Dynamic Submission Error */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#294636]"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your administrator email"
                disabled={isLoading}
                className="block w-full rounded-xl border border-[#cfe0c6] bg-[#fbfcf7] pl-10 pr-4 py-3.5 text-base font-medium text-[#173c29] placeholder-[#829184] focus:border-[#24763d] focus:outline-none focus:ring-4 focus:ring-[#24763d]/10 disabled:bg-stone-50 disabled:text-stone-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-stone-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                disabled={isLoading}
                className="block w-full rounded-md border border-stone-300 pl-9 pr-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 disabled:bg-stone-50 disabled:text-stone-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#174f35] px-5 py-4 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-[#174f35]/15 transition hover:-translate-y-0.5 hover:bg-[#24763d] focus:outline-none focus:ring-4 focus:ring-[#24763d]/20 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs font-medium text-[#596b5d]">
          <p>Protected System — Authorized Access Only</p>
          <p className="mt-0.5">Session state is server-validated and encrypted.</p>
        </div>
      </div>
    </div>
  );
}
