# Viruksham Estates — RLS Policy Matrix & Authorization Model

## 1. Authorization Model & Administrative Security

The authorization architecture for **Viruksham Estates** relies on Supabase Auth (`auth.users`) integrated with a dedicated `profiles` table and database-level Row Level Security (RLS).

### Key Security Requirements:
1. **Three-Person Administrative Access Model:** System administration is granted strictly to approved user accounts (`role = 'admin'`).
2. **Prevention of Role Elevation:** Users cannot alter their own `role` field. Profile role updates require superadmin authorization or direct database execution.
3. **No RLS Recursion Loops:** To prevent infinite recursion loops during policy evaluation, administrative checks use a `SECURITY DEFINER` helper function (`is_admin()`) rather than recursive `SELECT` subqueries against protected tables.

### Helper Function for Safe Admin Check:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
  );
$$;
```

---

## 2. Table-by-Table RLS Policy Matrix

| Table Name | Anon Read (Public) | Anon Write (Public) | Authenticated Admin Read | Authenticated Admin Write |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | ❌ No | ❌ No | ✅ Self / Admin (`is_admin()`) | ❌ No Self Role Edit / Admin (`is_admin()`) |
| `projects` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `project_media` | ✅ Parent project `is_published` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `project_units` | ✅ Parent project `is_published` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `journal_posts` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `company_timeline` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `team_members` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `testimonials` | ✅ `is_published = true` | ❌ No | ✅ Full Read | ✅ Full Write (`is_admin()`) |
| `enquiries` | ❌ No | ✅ Insert Only (`consent = true`) | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `customers` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `site_visits` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `sales` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `followups` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Full Write (`is_admin()`) |
| `activity_logs` | ❌ No | ❌ No | ✅ Full Read (`is_admin()`) | ✅ Insert Only via System/Trigger |

---

## 3. Policy Specifications (SQL Blueprint)

### 3.1. Public Content Policies (Anonymous & Authenticated Read)
```sql
-- Projects: Public read published only
CREATE POLICY "Public projects are readable by everyone"
  ON public.projects FOR SELECT
  USING (is_published = true);

-- Project Media: Public read if parent project is published
CREATE POLICY "Public project media readable by everyone"
  ON public.project_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_media.project_id
        AND projects.is_published = true
    )
  );

-- Journal Posts: Public read published only
CREATE POLICY "Published journal posts readable by everyone"
  ON public.journal_posts FOR SELECT
  USING (is_published = true AND published_at <= now());
```

### 3.2. Enquiry Submission Policy (Controlled Public Insert)
```sql
-- Enquiries: Anyone can submit an enquiry provided consent is true
CREATE POLICY "Anyone can submit an enquiry with consent"
  ON public.enquiries FOR INSERT
  WITH CHECK (consent = true);
```

### 3.3. Protected Administrative & CRM Policies
```sql
-- Enquiries: Admin read & write
CREATE POLICY "Admins can view and manage enquiries"
  ON public.enquiries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Customers: Admin only access
CREATE POLICY "Admins can view and manage customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Sales: Admin only access
CREATE POLICY "Admins can view and manage sales opportunities"
  ON public.sales FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```
