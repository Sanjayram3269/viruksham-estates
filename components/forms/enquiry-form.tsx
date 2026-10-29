"use client";

import React, { useState } from "react";
import { enquirySchema, EnquiryFormValues } from "@/lib/validations/enquiry";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

interface EnquiryFormProps {
  defaultProjectSlug?: string;
  className?: string;
}

export function EnquiryForm({ defaultProjectSlug = "", className }: EnquiryFormProps) {
  const [formData, setFormData] = useState<EnquiryFormValues>({
    name: "",
    email: "",
    phone: "",
    projectSlug: defaultProjectSlug,
    enquiryType: defaultProjectSlug ? "PROJECT" : "GENERAL",
    preferredContact: "EMAIL",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const parsed = enquirySchema.safeParse(formData);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) nextErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "We could not send your enquiry. Please try again.");
      setStatus({ kind: "success", message: body.message || "Thank you. Your enquiry has been received." });
      setFormData({ name: "", email: "", phone: "", projectSlug: defaultProjectSlug, enquiryType: defaultProjectSlug ? "PROJECT" : "GENERAL", preferredContact: "EMAIL", message: "", consent: false });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "We could not send your enquiry. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full rounded-none border border-[#ded7cb] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#183327] outline-none transition placeholder:text-[#a49b8e] focus:border-[#68816f] focus:ring-2 focus:ring-[#315843]/10 disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className || ""}`} noValidate>
      {status && <div role={status.kind === "error" ? "alert" : "status"} className={`flex items-start gap-3 border p-4 text-sm leading-6 ${status.kind === "success" ? "border-[#bcd2bf] bg-[#edf4eb] text-[#28543a]" : "border-[#e5beb4] bg-[#fff1ed] text-[#943e30]"}`}>{status.kind === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <Send size={18} className="mt-0.5 shrink-0" />}<span>{status.message}</span></div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">Full name <span className="text-[#b94c3a]">*</span></label><input id="name" name="name" type="text" autoComplete="name" required minLength={2} value={formData.name} onChange={handleChange} className={fieldClass} placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "enquiry-name-error" : undefined} />{errors.name && <p id="enquiry-name-error" className="text-xs text-[#a33d2c]">{errors.name}</p>}</div>
        <div className="space-y-2"><label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">Email address <span className="text-[#b94c3a]">*</span></label><input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={fieldClass} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "enquiry-email-error" : undefined} />{errors.email && <p id="enquiry-email-error" className="text-xs text-[#a33d2c]">{errors.email}</p>}</div>
        <div className="space-y-2"><label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">Phone number <span className="text-[#b94c3a]">*</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleChange} className={fieldClass} placeholder="+91 00000 00000" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "enquiry-phone-error" : undefined} />{errors.phone && <p id="enquiry-phone-error" className="text-xs text-[#a33d2c]">{errors.phone}</p>}</div>
        <div className="space-y-2"><label htmlFor="enquiryType" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">Enquiry type <span className="text-[#b94c3a]">*</span></label><select id="enquiryType" name="enquiryType" value={formData.enquiryType} onChange={handleChange} className={fieldClass}><option value="GENERAL">General enquiry</option><option value="PROJECT">Project specific</option><option value="SITE_VISIT">Request a site visit</option><option value="PARTNERSHIP">Partnership / investor</option></select></div>
      </div>

      <div className="space-y-2"><label htmlFor="preferredContact" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">Preferred contact method <span className="text-[#b94c3a]">*</span></label><select id="preferredContact" name="preferredContact" value={formData.preferredContact} onChange={handleChange} className={fieldClass}><option value="EMAIL">Email</option><option value="PHONE">Phone call</option><option value="WHATSAPP">WhatsApp</option></select></div>

      <div className="space-y-2"><label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#4e594f]">How can we help? <span className="text-[#b94c3a]">*</span></label><textarea id="message" name="message" rows={4} required minLength={10} value={formData.message} onChange={handleChange} className={`${fieldClass} resize-y`} placeholder="Tell us what you are looking for…" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "enquiry-message-error" : undefined} />{errors.message && <p id="enquiry-message-error" className="text-xs text-[#a33d2c]">{errors.message}</p>}</div>

      <div className="flex items-start gap-3 border-t border-[#e7e0d6] pt-5"><input id="consent" name="consent" type="checkbox" required checked={formData.consent} onChange={handleChange} className="mt-1 h-4 w-4 shrink-0 accent-[#183327]" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "enquiry-consent-error" : undefined} /><div><label htmlFor="consent" className="text-xs leading-5 text-[#716b61]">I consent to being contacted by Viruksham Estates regarding this enquiry.</label>{errors.consent && <p id="enquiry-consent-error" className="mt-1 text-xs text-[#a33d2c]">{errors.consent}</p>}</div></div>

      <Button type="submit" variant="primary" disabled={submitting} className="group flex w-full items-center justify-center gap-3 rounded-none bg-[#183327] py-4 text-sm font-semibold text-white transition hover:bg-[#284c3a] disabled:cursor-not-allowed disabled:opacity-70">{submitting ? <><LoaderCircle size={16} className="animate-spin" /> Sending enquiry…</> : <>Send enquiry <Send size={15} className="transition group-hover:translate-x-1" /></>}</Button>
      <p className="text-center text-[10px] leading-5 text-[#948b7e]">Your details are used to respond to this enquiry. Please do not include sensitive financial or identity information.</p>
    </form>
  );
}
