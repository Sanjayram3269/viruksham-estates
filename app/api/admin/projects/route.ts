import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";

export async function GET(_request: NextRequest) {
  void _request;
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator privileges required." },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

function isBodyValid(body: unknown): body is Record<string, unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    !Array.isArray(body)
  );
}

function normalizeSlug(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  return trimmed.toLowerCase();
}

function pickString(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  return raw;
}

function pickNumber(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  }
  return undefined;
}

function pickBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") return raw;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function pickStringArray(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean);
  if (typeof raw === "string") {
    return raw.split(/[,\n]/).map((value) => value.trim()).filter(Boolean);
  }
  return undefined;
}

function slugify(raw: string): string {
  return raw.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator privileges required." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    if (!isBodyValid(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const title = body.title;
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string." },
        { status: 400 }
      );
    }
    const slugCandidate = normalizeSlug(body.slug) ?? (slugify(title) || `project-${Date.now()}`);

    if (!slugCandidate) {
      return NextResponse.json(
        { error: "slug is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("slug")
      .eq("slug", slugCandidate)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to verify slug uniqueness." },
        { status: 500 }
      );
    }

    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this slug already exists. Please use a unique slug." },
        { status: 400 }
      );
    }

    const is_published = pickBoolean(body.is_published) ?? false;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: title.trim(),
        subtitle:
          typeof body.subtitle === "string"
            ? body.subtitle.trim()
            : undefined,
        category: pickString(body.category),
        status: pickString(body.status),
        location: pickString(body.location),
        description: pickString(body.description),
        overview: pickString(body.overview),
        highlights: pickStringArray(body.highlights),
        amenities: pickStringArray(body.amenities),
        pricing: pickString(body.pricing),
        availability: pickString(body.availability),
        coordinates: body.coordinates,
        is_published,
        display_order: pickNumber(body.display_order),
        slug: slugCandidate,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create project." },
        { status: 400 }
      );
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to create project.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator privileges required." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    if (!isBodyValid(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const rawProjectId = body.projectId;

    if (typeof rawProjectId !== "string" || rawProjectId.trim().length === 0) {
      return NextResponse.json(
        { error: "projectId must be a non-empty string." },
        { status: 400 }
      );
    }

    const projectId = rawProjectId.trim();
    const supabase = await createClient();

    const { count: salesCount, error: salesError } = await supabase
      .from("sales")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);

    if (salesError) {
      return NextResponse.json(
        { error: "Failed to verify project dependencies." },
        { status: 500 }
      );
    }

    if ((salesCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "This project has associated sales and cannot be deleted while they exist." },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete project." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to delete project.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator privileges required." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    if (!isBodyValid(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const projectId = body.id;

    if (typeof projectId !== "string" || projectId.trim().length === 0) {
      return NextResponse.json(
        { error: "id must be a non-empty string." },
        { status: 400 }
      );
    }

    const title = body.title;
    const slugCandidate = normalizeSlug(body.slug);

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const normalizedProjectId = projectId.trim();
    const supabase = await createClient();

    if (slugCandidate) {
      const { data: existingProject, error: checkError } = await supabase
        .from("projects")
        .select("slug")
        .eq("slug", slugCandidate)
        .neq("id", normalizedProjectId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        return NextResponse.json(
          { error: "Failed to verify slug uniqueness." },
          { status: 500 }
        );
      }

      if (existingProject) {
        return NextResponse.json(
          { error: "Another project already has this slug. Please use a unique slug." },
          { status: 400 }
        );
      }
    }

    const supabaseForUpdate = await createClient();
    const { data, error } = await supabaseForUpdate
      .from("projects")
      .update({
        title: title.trim(),
        subtitle:
          typeof body.subtitle === "string"
            ? body.subtitle.trim()
            : undefined,
        category: pickString(body.category),
        status: pickString(body.status),
        location: pickString(body.location),
        description: pickString(body.description),
        overview: pickString(body.overview),
        highlights: pickStringArray(body.highlights),
        amenities: pickStringArray(body.amenities),
        pricing: pickString(body.pricing),
        availability: pickString(body.availability),
        coordinates: body.coordinates,
        is_published: pickBoolean(body.is_published),
        display_order: pickNumber(body.display_order),
        ...(slugCandidate ? { slug: slugCandidate } : {}),
      })
      .eq("id", normalizedProjectId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update project." },
        { status: 400 }
      );
    }

    return NextResponse.json({ project: data });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to update project.",
      },
      { status: 500 }
    );
  }
}
