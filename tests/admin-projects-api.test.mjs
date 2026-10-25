// Admin projects API behavior tests.
//
// These tests validate the server-side handler logic through the project's own
// route module when local Supabase credentials are available. They do not run
// against a live database when TEST_SUPABASE_ANON_KEY or
// TEST_SUPABASE_SERVICE_KEY is unset; in that case they skip the relevant cases
// and print a single BLOCKED note so missing local services are easy to
// distinguish from genuine failures.

import { test as _test, describe as _describe } from "node:test";
import assert from "node:assert/strict";

const test = _test;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const describe = _describe;

if (typeof test === "undefined") {
  throw new Error("node:test helpers unavailable");
}

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || "http://127.0.0.1:54321";
const ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.TEST_SUPABASE_SERVICE_KEY;

let credentialsBlocked = false;

if (!ANON_KEY || !SERVICE_KEY) {
  process.stderr.write(
    "\n[API] BLOCKED: TEST_SUPABASE_ANON_KEY and TEST_SUPABASE_SERVICE_KEY " +
      "must be set to run the admin projects API test suite.\n" +
      "Run `npx supabase start` then export the keys shown in its output.\n\n"
  );
  credentialsBlocked = true;
}

function adminClient() {
  assert.ok(
    ANON_KEY && SERVICE_KEY,
    "adminClient should only be called when credentials are set"
  );
  return createClient(SUPABASE_URL, ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    },
  });
}

/** Minimal request stub used to validate route handlers in isolation. */
function makeRequest(initial = {}) {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return {
    request: {
      headers,
      json: async () => {
        if (initial.body === undefined) {
          if (initial.bodyAlreadyConsumed) {
            throw new TypeError("already read");
          }
          throw new Error("no body");
        }
        initial.bodyAlreadyConsumed = true;
        return initial.body;
      },
    },
    responseProps: { status: 200, jsonBody: null },
    parseResponse(response) {
      return {
        status: response.status,
        body: response.jsonBody,
      };
    },
  };
}

async function callExport(handler, request) {
  const importedRouteModule = await import("../app/api/admin/projects/route.ts");
  const handlerFn =
    importedRouteModule.default ?? importedRouteModule[handler];
  assert.ok(
    typeof handlerFn === "function",
    `${handler} must be exported`
  );
  const response = await handlerFn(request.request);
  request.responseProps.jsonBody = await response.json().catch(() => ({}));
  Object.defineProperty(
    response,
    "status",
    { value: response.status, writable: false }
  );
  return request.parseResponse(response);
}

test("POST /api/admin/projects rejects malformed JSON bodies", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: Symbol("invalid") });
  request.request.json = async () => {
    throw new SyntaxError("unexpected token");
  };
  const response = await callExport("POST", request);
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("POST /api/admin/projects requires administrator role", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: { title: "Admin Guard", slug: "admin-guard" } });
  const adminWithoutRole = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistence: "none" },
  });
  const { data, error } = await adminWithoutRole.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL || "admin@example.test",
    password: process.env.TEST_ADMIN_PASSWORD || "change-me-in-real-run",
  });
  assert.ok(data, "sign-in payload should be available for this guard test");
  const guardedRequest = makeRequest({
    body: { title: "Admin Guard", slug: "admin-guard" },
  });
  guardedRequest.request.headers.set(
    "Authorization",
    `Bearer ${data.session?.access_token || ""}`
  );
  const response = await callExport("POST", guardedRequest);
  assert.equal(response.status, 401);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("POST /api/admin/projects requires a non-empty title", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: { slug: "short-slug" } });
  const response = await callExport("POST", request);
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("POST /api/admin/projects rejects when title is present but slug is missing", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: { title: "Title Only" } });
  const response = await callExport("POST", request);
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("POST /api/admin/projects defaults new projects to is_published false", async () => {
  if (credentialsBlocked) return;
  const slug = `api-publish-default-${Date.now()}`;
  const request = makeRequest({
    body: {
      title: "API Publish Default Test",
      slug,
      category: "RESIDENTIAL",
      status: "UPCOMING",
      location: "Chennai",
    },
  });
  const response = await callExport("POST", request);
  assert.equal(response.status, 201);
  assert.deepEqual(response.body.project.is_published, false);
  await adminClient().from("projects").delete().eq("slug", slug);
});

test("POST /api/admin/projects accepts explicit boolean is_published values", async () => {
  if (credentialsBlocked) return;
  const slug = `api-publish-explicit-${Date.now()}`;
  const request = makeRequest({
    body: {
      title: "API Publish Explicit Test",
      slug,
      category: "PLOTS",
      status: "LIVE",
      location: "Madurai",
      is_published: true,
    },
  });
  const response = await callExport("POST", request);
  assert.equal(response.status, 201);
  assert.deepEqual(response.body.project.is_published, true);
  await adminClient().from("projects").delete().eq("slug", slug);
});

test("POST /api/admin/projects rejects duplicate slugs", async () => {
  if (credentialsBlocked) return;
  const slug = `api-dup-${Date.now()}`;
  await adminClient().from("projects").insert({
    title: "Dup Anchor",
    slug,
    category: "RESIDENTIAL",
    status: "LIVE",
    location: "Chennai",
  });
  const request = makeRequest({ body: { title: "Dup Attempt", slug } });
  const response = await callExport("POST", request);
  assert.equal(response.status, 400);
  assert.ok(
    typeof response.body.error === "string" && response.body.error.length > 0
  );
  await adminClient().from("projects").delete().eq("slug", slug);
});

test("POST /api/admin/projects normalizes slug casing", async () => {
  if (credentialsBlocked) return;
  const slug = `Case-Normalized-${Date.now()}`;
  const request = makeRequest({
    body: {
      title: "Case Normalized Slug",
      slug,
      category: "RESIDENTIAL",
      status: "UPCOMING",
      location: "Chennai",
    },
  });
  const response = await callExport("POST", request);
  assert.equal(response.status, 201);
  assert.equal(response.body.project.slug, slug.toLowerCase());
  await adminClient().from("projects").delete().eq("slug", slug.toLowerCase());
});

test("PUT /api/admin/projects requires administrator role", async () => {
  if (credentialsBlocked) return;
  const existingSlug = `put-role-guard-${Date.now()}`;
  const existing = await adminClient().from("projects").insert({
    title: "Put Role Guard",
    slug: existingSlug,
    category: "RESIDENTIAL",
    status: "UPCOMING",
    location: "Chennai",
  }).select().single();
  assert.ok(existing, "anchor project should exist for this guard test");
  const adminWithoutRole = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistence: "none" },
  });
  const { data } = await adminWithoutRole.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL || "admin@example.test",
    password: process.env.TEST_ADMIN_PASSWORD || "change-me-in-real-run",
  });
  assert.ok(data, "sign-in payload should be available for this guard test");
  const guardedRequest = makeRequest({
    body: {
      id: existing.id,
      title: "Updated Title",
      slug: existingSlug,
    },
  });
  guardedRequest.request.headers.set(
    "Authorization",
    `Bearer ${data.session?.access_token || ""}`
  );
  const response = await callExport("PUT", guardedRequest);
  assert.equal(response.status, 401);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
  await adminClient().from("projects").delete().eq("slug", existingSlug);
});

test("PUT /api/admin/projects rejects missing project id", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: { title: "Missing Id" } });
  const response = await callExport("PUT", request);
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("PUT /api/admin/projects rejects nonexistent project id", async () => {
  if (credentialsBlocked) return;
  const fakeId = "00000000-0000-0000-0000-000000000002";
  const request = makeRequest({
    body: { id: fakeId, title: "Nonexistent Project", slug: "nonexistent-project" },
  });
  const response = await callExport("PUT", request);
  const isExpectedFailure =
    response.status === 400 ||
    (response.status >= 400 && response.status < 600);
  assert.ok(isExpectedFailure, "nonexistent id must not silently succeed");
  if (response.status === 400) {
    assert.equal(typeof response.body.error, "string");
    assert.ok(response.body.error.length > 0);
  }
});

test("PUT /api/admin/projects rejects duplicate slugs on another project", async () => {
  if (credentialsBlocked) return;
  const slug = `put-dup-${Date.now()}`;
  const first = await adminClient().from("projects").insert({
    title: "First Put Dup",
    slug,
    category: "RESIDENTIAL",
    status: "LIVE",
    location: "Chennai",
  }).select().single();
  const secondSlug = `put-dup-second-${Date.now()}`;
  const second = await adminClient().from("projects").insert({
    title: "Second Put Dup",
    slug: secondSlug,
    category: "PLOTS",
    status: "LIVE",
    location: "Madurai",
  }).select().single();
  const request = makeRequest({
    body: {
      id: second.id,
      title: "Second Put Dup Renamed",
      slug,
    },
  });
  const response = await callExport("PUT", request);
  assert.equal(response.status, 400);
  assert.ok(
    typeof response.body.error === "string" && response.body.error.length > 0
  );
  await adminClient()
    .from("projects")
    .delete()
    .in("id", [first.id, second.id]);
});

test("PUT /api/admin/projects preserves slug when omitted", async () => {
  if (credentialsBlocked) return;
  const slug = `put-preserve-slug-${Date.now()}`;
  const existing = await adminClient().from("projects").insert({
    title: "Put Preserve Slug",
    slug,
    category: "RESIDENTIAL",
    status: "UPCOMING",
    location: "Chennai",
  }).select().single();
  const request = makeRequest({
    body: {
      id: existing.id,
      title: "Put Preserve Slug Renamed",
    },
  });
  const response = await callExport("PUT", request);
  assert.equal(response.status, 200);
  assert.equal(response.body.project.slug, slug);
  assert.equal(response.body.project.title, "Put Preserve Slug Renamed");
  await adminClient().from("projects").delete().eq("slug", slug);
});

test("DELETE /api/admin/projects requires administrator role", async () => {
  if (credentialsBlocked) return;
  const deletableSlug = `delete-role-guard-${Date.now()}`;
  const deletable = await adminClient().from("projects").insert({
    title: "Delete Role Guard",
    slug: deletableSlug,
    category: "RESIDENTIAL",
    status: "COMPLETED",
    location: "Chennai",
  }).select().single();
  const adminWithoutRole = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistence: "none" },
  });
  const { data } = await adminWithoutRole.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL || "admin@example.test",
    password: process.env.TEST_ADMIN_PASSWORD || "change-me-in-real-run",
  });
  assert.ok(data, "sign-in payload should be available for this guard test");
  const guardedRequest = makeRequest({
    body: { projectId: deletable.id },
  });
  guardedRequest.request.headers.set(
    "Authorization",
    `Bearer ${data.session?.access_token || ""}`
  );
  const response = await callExport("DELETE", guardedRequest);
  assert.equal(response.status, 401);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
  await adminClient().from("projects").delete().eq("slug", deletableSlug);
});

test("DELETE /api/admin/projects validates projectId", async () => {
  if (credentialsBlocked) return;
  const request = makeRequest({ body: { projectId: "" } });
  const response = await callExport("DELETE", request);
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});

test("DELETE /api/admin/projects returns 409 when sales exist", async () => {
  if (credentialsBlocked) return;
  const projectWithSales = await adminClient().from("projects").insert({
    title: "Project With Sales",
    slug: `sales-count-${Date.now()}`,
    category: "RESIDENTIAL",
    status: "LIVE",
    location: "Chennai",
  }).select().single();
  await adminClient().from("sales").insert({
    project_id: projectWithSales.id,
    buyer_name: "Sales Count Test Buyer",
    email: `sales-${Date.now()}@test.test`,
    phone: "+919999999999",
    units: 1,
    amount: "999999",
  });
  const request = makeRequest({
    body: { projectId: projectWithSales.id },
  });
  const response = await callExport("DELETE", request);
  assert.equal(response.status, 409);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
  await adminClient().from("sales").delete().eq("project_id", projectWithSales.id);
  await adminClient().from("projects").delete().eq("id", projectWithSales.id);
});

test("DELETE /api/admin/projects deletes project with no sales", async () => {
  if (credentialsBlocked) return;
  const deletable = await adminClient().from("projects").insert({
    title: "Deleteable Project",
    slug: `delete-clean-${Date.now()}`,
    category: "PLOTS",
    status: "COMPLETED",
    location: "Madurai",
  }).select().single();
  const request = makeRequest({
    body: { projectId: deletable.id },
  });
  const response = await callExport("DELETE", request);
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  const { data: found } = await adminClient()
    .from("projects")
    .select("id")
    .eq("id", deletable.id)
    .single();
  assert.equal(found, null);
});

test("GET /api/admin/projects requires administrator role", async () => {
  if (credentialsBlocked) return;
  const anonymousClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistence: "none" },
  });
  const { data } = await anonymousClient.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL || "admin@example.test",
    password: process.env.TEST_ADMIN_PASSWORD || "change-me-in-real-run",
  });
  assert.ok(data, "sign-in payload should be available for this guard test");
  const guardedRequest = makeRequest({});
  guardedRequest.request.headers.set(
    "Authorization",
    `Bearer ${data.session?.access_token || ""}`
  );
  const response = await callExport("GET", guardedRequest);
  assert.equal(response.status, 401);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
});
