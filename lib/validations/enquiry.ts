import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  projectSlug: z.string().optional(),
  enquiryType: z.enum(["GENERAL", "PROJECT", "SITE_VISIT", "PARTNERSHIP"]),
  preferredContact: z.enum(["PHONE", "EMAIL", "WHATSAPP"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to be contacted regarding your enquiry",
  }),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
