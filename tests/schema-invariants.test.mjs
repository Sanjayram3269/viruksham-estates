import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const MIGRATION_PATH = path.join(
  process.cwd(),
  "supabase",
  "migrations",
  "20261010000000_schema_design_draft.sql"
);

test("Schema Invariants: DDL draft file exists and contains unapproved draft banner", () => {
  assert.ok(fs.existsSync(MIGRATION_PATH), "Draft migration SQL file must exist");
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("UNAPPROVED DRAFT MIGRATION ARTIFACT FOR REVIEW ONLY"),
    "Draft migration file must be clearly marked as unapproved"
  );
});

test("Schema Invariants: All 15 required domain entities are defined with RLS enabled", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  const requiredTables = [
    "profiles",
    "projects",
    "project_media",
    "project_units",
    "construction_services",
    "journal_posts",
    "company_timeline",
    "team_members",
    "testimonials",
    "enquiries",
    "customers",
    "site_visits",
    "sales",
    "followups",
    "activity_logs",
  ];

  for (const table of requiredTables) {
    assert.ok(
      sql.includes(`CREATE TABLE public.${table}`),
      `Table public.${table} must be defined in DDL`
    );
    assert.ok(
      sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
      `RLS must be enabled on public.${table}`
    );
  }
});

test("Schema Invariants: Project Categories & Statuses match TypeScript types", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  const categories = ["'RESIDENTIAL'", "'PLOTS'", "'CONSTRUCTION'", "'COMMERCIAL'"];
  const statuses = ["'LIVE'", "'ONGOING'", "'COMPLETED'", "'UPCOMING'", "'SOLD_OUT'"];

  for (const cat of categories) {
    assert.ok(sql.includes(cat), `Project category ${cat} must be present in ENUM`);
  }
  for (const stat of statuses) {
    assert.ok(sql.includes(stat), `Project status ${stat} must be present in ENUM`);
  }
});

test("Schema Invariants: Construction Services entity defined independently", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("CREATE TABLE public.construction_services"),
    "construction_services table must be defined as an independent entity"
  );
  assert.ok(
    sql.includes("CREATE TYPE public.construction_service_type"),
    "construction_service_type ENUM must be defined"
  );
});

test("Schema Invariants: Non-recursive admin security function with row_security = off", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("CREATE OR REPLACE FUNCTION public.is_admin()"),
    "is_admin() helper function must be defined"
  );
  assert.ok(
    sql.includes("SECURITY DEFINER"),
    "is_admin() function must use SECURITY DEFINER"
  );
  assert.ok(
    sql.includes("SET row_security = off"),
    "is_admin() function must set row_security = off to prevent RLS recursion loops"
  );
  assert.ok(
    sql.includes("SET search_path = public, pg_temp"),
    "is_admin() function must set fixed search_path = public, pg_temp"
  );
  assert.ok(
    sql.includes("REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC"),
    "is_admin() must revoke execution from PUBLIC"
  );
  assert.ok(
    sql.includes("GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated"),
    "is_admin() must grant execution to authenticated"
  );
});

test("Schema Invariants: Mandatory legal consent constraint on enquiries", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("consent BOOLEAN NOT NULL CHECK (consent = true)"),
    "Enquiries table must enforce mandatory legal consent constraint"
  );
});

test("Schema Invariants: Immutable activity_logs audit policies", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("CREATE POLICY \"Admins read activity_logs\""),
    "activity_logs must have SELECT policy"
  );
  assert.ok(
    sql.includes("CREATE POLICY \"Admins insert activity_logs\""),
    "activity_logs must have INSERT policy"
  );
  assert.ok(
    !sql.includes("Admins update activity_logs") && !sql.includes("Admins delete activity_logs"),
    "activity_logs must NOT have UPDATE or DELETE policies"
  );
});

test("Schema Invariants: Customer phone uniqueness constraint", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("phone TEXT NOT NULL UNIQUE") || sql.includes("idx_customers_phone ON public.customers(phone)"),
    "Customers table must enforce unique phone number"
  );
});
