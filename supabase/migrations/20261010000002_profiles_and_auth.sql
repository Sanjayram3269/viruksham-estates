-- =============================================================================
-- Migration 002: Profiles Table & Hardened is_admin() Function
-- Viruksham Estates — Phase 1B Schema Implementation
-- Depends on: 001_enums.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: Administrator accounts linked to Supabase Auth.
-- Only users added by a superadmin can have a profile.
-- There is no self-registration flow — accounts are created manually.
-- -----------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id          UUID      PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT      NOT NULL UNIQUE,
  full_name   TEXT      NOT NULL,
  role        TEXT      NOT NULL DEFAULT 'admin'
                        CHECK (role IN ('admin', 'superadmin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- is_admin(): Security-hardened admin check function.
--
-- Design decisions:
--   1. SECURITY DEFINER — function executes as its owner (postgres), bypassing
--      caller's session RLS. This prevents infinite recursion when profiles'
--      own RLS policy calls is_admin() which in turn queries profiles.
--   2. SET row_security = off — explicitly disables RLS inside function body
--      so the internal SELECT on profiles is not subject to any policy.
--   3. SET search_path = public, pg_temp — pins the schema search path,
--      preventing search_path injection attacks (SECURITY DEFINER functions
--      are vulnerable if search_path is uncontrolled).
--   4. STABLE — marks the function as stable within a single query; safe
--      to inline and cache across a transaction.
--   5. REVOKE from PUBLIC / GRANT to authenticated — limits who can call
--      this function. Anonymous callers cannot invoke is_admin().
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
  );
$$;

-- Remove broad execution access first, then grant only to authenticated role.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- prevent_role_self_elevation(): Trigger to block non-superadmin users from
-- modifying their own role or any other profile's role.
-- Only a superadmin can change roles.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_role_self_elevation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  _caller_role TEXT;
BEGIN
  -- Fetch the calling user's current role from profiles.
  SELECT role INTO _caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- If the role column is being changed and the caller is NOT a superadmin,
  -- reject the operation.
  IF OLD.role IS DISTINCT FROM NEW.role AND _caller_role <> 'superadmin' THEN
    RAISE EXCEPTION 'Only superadmins may modify profile roles.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_role_self_elevation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_elevation();
