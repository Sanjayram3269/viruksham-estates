"use client";

import React, { useState } from "react";
import { enquirySchema, EnquiryFormValues } from "@/lib/validations/enquiry";
import { Button } from "@/components/ui/button";

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
    enquiryType: "GENERAL",
    preferredContact: "EMAIL",
    message: "",
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [devStatusMessage, setDevStatusMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDevStatusMessage(null);

    const result = enquirySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setDevStatusMessage("Enquiry submission will be connected to the Viruksham CRM.");
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ""}`}>
      {devStatusMessage && (
        <div className="rounded-sm border border-[#1e3a2b] bg-[#f2ece4] p-4 text-sm font-medium text-[#1e3a2b]">
          {devStatusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
            placeholder="+91 00000 00000"
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="enquiryType" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
            Enquiry Type *
          </label>
          <select
            id="enquiryType"
            name="enquiryType"
            value={formData.enquiryType}
            onChange={handleChange}
            className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
          >
            <option value="GENERAL">General Enquiry</option>
            <option value="PROJECT">Project Specific</option>
            <option value="SITE_VISIT">Request Site Visit</option>
            <option value="PARTNERSHIP">Partnership / Investor</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="preferredContact" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
          Preferred Contact Method *
        </label>
        <select
          id="preferredContact"
          name="preferredContact"
          value={formData.preferredContact}
          onChange={handleChange}
          className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
        >
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone Call</option>
          <option value="WHATSAPP">WhatsApp</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-sm border border-[#e7e2d9] bg-[#faf8f5] px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#1e3a2b] focus:outline-none"
          placeholder="How can we assist you?"
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
      </div>

      <div className="flex items-start space-x-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded-xs border-[#e7e2d9] text-[#1e3a2b] focus:ring-[#1e3a2b]"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-[#645d57]">
          I consent to being contacted by Viruksham Estates regarding my enquiry.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}

      <Button type="submit" variant="primary" className="w-full py-3">
        Submit Enquiry
      </Button>
    </form>
  );
}
