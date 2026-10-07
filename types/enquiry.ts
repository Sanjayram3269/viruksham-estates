export type EnquiryType = "GENERAL" | "PROJECT" | "SITE_VISIT" | "PARTNERSHIP";

export type PreferredContact = "PHONE" | "EMAIL" | "WHATSAPP";

export interface Enquiry {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectSlug?: string;
  enquiryType: EnquiryType;
  preferredContact: PreferredContact;
  consent: boolean;
}
