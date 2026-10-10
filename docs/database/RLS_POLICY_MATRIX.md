# Viruksham Estates — RLS Policy Matrix & Authorization Model (Hardened Phase 1A)

## 1. Authorization Architecture & Security Hardening

The authorization framework for **Viruksham Estates** integrates Supabase Auth (`auth.users`), a dedicated `profiles` table, and PostgreSQL Row Level Security (RLS).

### Core Security Guarantees:
1. **Three-Person Administrative Access Model:** System administration is restricted to designated user accounts (`role IN ('admin', 'superadmin')`).
2. **Prevention of RLS Infinite Recursion:** Administrative checks rely on a `SECURITY DEFINER` helper function (`is_admin()`) configured with `SET row_security = off` and `SET search_path = public, pg_temp`. This ensures internal profile lookups bypass RLS, eliminating infinite recursion loops.
3. **Execution Privilege Restriction:** `public.is_admin()` revokes execution from `PUBLIC` and grants execution strictly to `authenticated` users.
4. **Prevention of Role Self-Elevation:** Profile updates by non-superadmins cannot modify `profiles.role`. A database trigger (`prevent_role_self_elevation()`) rejects unauthorized role alterations.
5. **Immutable Audit Log:** `activity_logs` permits `SELECT` and `INSERT` for administrators, but explicitly prohibits `UPDATE` and `DELETE` actions.

### Hardened Admin Check Function:
```sql
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

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
```

---

## 2. Table-by-Table RLS Policy Matrix (15 Entities)

| Table Name | Anon Read (Public) | Anon Write (Public) | Authenticated Admin Read | Authenticated Admin Write |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | ❌ No | ❌ No | ✅ Self / Admin (`is_admin()`) | ❌ No Self Role Edit / Admin (`is_admin()`) |
| `projects` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `project_media` | ✅ Parent project `is_published` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `project_units` | ✅ Parent project `is_published` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `construction_services` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `journal_posts` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `company_timeline` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `team_members` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `testimonials` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `enquiries` | ❌ No | ✅ Insert Only (`consent = true`) | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `customers` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `site_visits` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `sales` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `followups` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `activity_logs` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ⚠️ Insert Only / NO UPDATE OR DELETE |

---

## 3. SQL Policy Specifications

```sql
-- Public Read Published Construction Services
CREATE POLICY "Public construction services readable by everyone"
  ON public.construction_services FOR SELECT USING (is_published = true);

-- Public Enquiry Submission with Legal Consent
CREATE POLICY "Anyone can submit an enquiry with consent"
  ON public.enquiries FOR INSERT WITH CHECK (consent = true);

-- Immutable Activity Logs Policies
CREATE POLICY "Admins can read activity logs"
  ON public.activity_logs FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can insert activity logs"
  ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
```
