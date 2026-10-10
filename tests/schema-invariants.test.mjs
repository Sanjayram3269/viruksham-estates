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

test("Schema Invariants: All 14 required domain entities are defined", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  const requiredTables = [
    "profiles",
    "projects",
    "project_media",
    "project_units",
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

test("Schema Invariants: Mandatory legal consent constraint on enquiries", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("consent BOOLEAN NOT NULL CHECK (consent = true)"),
    "Enquiries table must enforce mandatory legal consent constraint"
  );
});

test("Schema Invariants: Non-recursive admin security function defined", () => {
  const sql = fs.readFileSync(MIGRATION_PATH, "utf-8");
  assert.ok(
    sql.includes("CREATE OR REPLACE FUNCTION public.is_admin()"),
    "is_admin() helper function must be defined"
  );
  assert.ok(
    sql.includes("SECURITY DEFINER"),
    "is_admin() function must use SECURITY DEFINER to avoid RLS recursion"
  );
});
