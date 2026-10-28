import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validations/enquiry";

const statusCodeForMessage = (message: string) => message.toLowerCase().includes("rate") ? 429 : 400;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted enquiry details.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const values = parsed.data;
  if (!values.consent) {
    return NextResponse.json({ error: "Consent is required before submitting an enquiry." }, { status: 422 });
  }

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
      const isRateLimited = error.code === "PGRST116" || error.message.toLowerCase().includes("rate");
      return NextResponse.json(
        { error: isRateLimited ? "Too many requests. Please try again shortly." : "Your enquiry could not be submitted right now. Please try again or contact our team." },
        { status: isRateLimited ? statusCodeForMessage(error.message) : 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Thank you. Your enquiry has been received." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Your enquiry could not be submitted right now. Please try again or contact our team." }, { status: 500 });
  }
}
