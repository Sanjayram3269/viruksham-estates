import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function TrustStrip() {
  return (
    <Section className="border-y border-[#e7e2d9] bg-[#f2ece4]/50 py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2e523c]">
              DEVELOPMENTS
            </span>
            <p className="text-sm font-medium text-[#645d57]">
              Verified metrics will appear here.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2e523c]">
              LOCATION FOOTPRINT
            </span>
            <p className="text-sm font-medium text-[#645d57]">
              Verified metrics will appear here.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2e523c]">
              TRUST & COMPLIANCE
            </span>
            <p className="text-sm font-medium text-[#645d57]">
              Verified metrics will appear here.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
