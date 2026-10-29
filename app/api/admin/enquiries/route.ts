import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";

const ENQUIRY_STATUSES = ["NEW", "IN_REVIEW", "CONTACTED", "CONVERTED", "ARCHIVED"] as const;
type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) return NextResponse.json({ error: "Administrator privileges required." }, { status: 401 });

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("id,name,email,phone,message,project_slug,enquiry_type,preferred_contact,consent,status,created_at")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: "Enquiries could not be loaded." }, { status: 500 });
    return NextResponse.json({ enquiries: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Enquiries could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin.isAdmin) return NextResponse.json({ error: "Administrator privileges required." }, { status: 401 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    if (typeof record.id !== "string" || !record.id.trim()) return NextResponse.json({ error: "A valid enquiry id is required." }, { status: 400 });
    if (typeof record.status !== "string" || !ENQUIRY_STATUSES.includes(record.status as EnquiryStatus)) return NextResponse.json({ error: "Choose a valid enquiry status." }, { status: 400 });

    const supabase = await createClient();
    const { data: current, error: currentError } = await supabase
      .from("enquiries")
      .select("id,status")
      .eq("id", record.id.trim())
      .single();
    if (currentError || !current) return NextResponse.json({ error: "Enquiry could not be found." }, { status: 404 });

    const nextStatus = record.status as EnquiryStatus;
    const { data, error } = await supabase
      .from("enquiries")
      .update({ status: nextStatus })
      .eq("id", record.id.trim())
      .select("id,status")
      .single();
    if (error || !data) return NextResponse.json({ error: "Enquiry status could not be updated." }, { status: 400 });

    const { data: { user } } = await supabase.auth.getUser();
    const { error: auditError } = await supabase.from("activity_logs").insert({
      actor_id: user?.id ?? null,
      action: "ENQUIRY_STATUS_CHANGED",
      target_table: "enquiries",
      target_id: data.id,
      metadata: { from: current.status, to: data.status },
    });
    if (auditError) {
      // The status is already saved. Tell the client so it can refresh, while
      // avoiding an unsafe attempt to update/delete the append-only log.
      return NextResponse.json({ enquiry: data, warning: "Status saved, but the audit event could not be recorded. Please review database permissions." });
    }

    return NextResponse.json({ enquiry: data });
  } catch {
    return NextResponse.json({ error: "Enquiry status could not be updated." }, { status: 500 });
  }
}
