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
-- creating or modifying profile roles.
--
-- Security rules:
--   1. BOOTSTRAP / SYSTEM PATH: Execution by database superuser (postgres,
--      supabase_admin) or service_role key is permitted to initialize profiles.
--   2. VALID ROLE VALUES: Role must be NOT NULL and IN ('admin', 'superadmin').
--   3. MISSING CALLER IDENTITY: Non-system updates/inserts with missing auth.uid() are rejected.
--   4. PRIVILEGE RESTRICTION: Only an existing superadmin profile can modify roles or assign superadmin role.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_role_self_elevation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  _caller_uid UUID;
  _caller_role TEXT;
  _current_db_user TEXT;
  _auth_role TEXT;
BEGIN
  -- Fetch execution context details
  _caller_uid := auth.uid();
  _current_db_user := current_user;
  _auth_role := COALESCE(
    current_setting('request.jwt.claim.role', true),
    auth.role()
  );

  -- 1. BOOTSTRAP / SYSTEM EXECUTION PATH:
  -- Only direct database administration (postgres/supabase_admin with NO JWT claim context)
  -- or explicit service_role key execution are permitted to seed initial superadmin profiles.
  IF _auth_role = 'service_role' OR (
    _current_db_user IN ('postgres', 'supabase_admin') AND
    _caller_uid IS NULL AND
    current_setting('request.jwt.claim.role', true) IS NULL
  ) THEN
    RETURN NEW;
  END IF;

  -- 2. VALID ROLE VALUES: Enforce valid non-NULL role string
  IF NEW.role IS NULL OR NEW.role NOT IN ('admin', 'superadmin') THEN
    RAISE EXCEPTION 'Role assignment denied: invalid role value.';
  END IF;

  -- 3. ON INSERT: Only existing superadmins can create new profiles with superadmin role
  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'superadmin' THEN
      IF _caller_uid IS NULL THEN
        RAISE EXCEPTION 'Role assignment denied: missing caller identity.';
      END IF;

      SELECT role INTO _caller_role
      FROM public.profiles
      WHERE id = _caller_uid;

      IF _caller_role IS NULL OR _caller_role <> 'superadmin' THEN
        RAISE EXCEPTION 'Role assignment denied: only superadmins may create superadmin profiles.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  -- 4. ON UPDATE: Protect role column modifications
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF _caller_uid IS NULL THEN
      RAISE EXCEPTION 'Role modification denied: missing caller identity.';
    END IF;

    SELECT role INTO _caller_role
    FROM public.profiles
    WHERE id = _caller_uid;

    IF _caller_role IS NULL THEN
      RAISE EXCEPTION 'Role modification denied: caller profile does not exist.';
    END IF;

    IF _caller_role <> 'superadmin' THEN
      RAISE EXCEPTION 'Role modification denied: only superadmins may modify profile roles.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_role_self_elevation
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_elevation();
