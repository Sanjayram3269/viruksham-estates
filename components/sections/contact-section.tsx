import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export function ContactSection() {
  return (
    <Section className="bg-[#faf8f5]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
              Start a conversation with Viruksham Estates.
            </h1>
            <p className="text-base text-[#645d57] leading-relaxed">
              Whether you are looking to explore upcoming developments, schedule a site visit, or discuss property investments, our team is at your service.
            </p>

            <div className="pt-6 space-y-4 border-t border-[#e7e2d9]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2e523c]">
                  Official Contact
                </h3>
                <p className="text-sm text-[#1c1917] mt-1 font-medium">
                  Direct inquiry channels are managed through our central office.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2e523c]">
                  Hours of Operation
                </h3>
                <p className="text-sm text-[#645d57] mt-1">
                  Monday – Saturday: 9:00 AM – 6:00 PM IST
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-[#e7e2d9] bg-[#faf8f5] p-6 sm:p-8 shadow-xs lg:col-span-7">
            <h2 className="text-xl font-semibold text-[#1c1917] mb-6">
              Send an Enquiry
            </h2>
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
