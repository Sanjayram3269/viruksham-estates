import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validations/enquiry";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      error: "Please check the enquiry details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }, { status: 422 });
  }

  const values = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      project_slug: values.projectSlug?.trim() || null,
      enquiry_type: values.enquiryType,
      preferred_contact: values.preferredContact,
      consent: values.consent,
    });

    if (error) {
      return NextResponse.json({
        error: "Your enquiry could not be submitted right now. Please try again or contact our team.",
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Thank you. Your enquiry has been received." }, { status: 201 });
  } catch {
    return NextResponse.json({
      error: "Your enquiry could not be submitted right now. Please try again or contact our team.",
    }, { status: 500 });
  }
}
