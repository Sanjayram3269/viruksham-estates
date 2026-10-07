import React from "react";
import { AboutStory } from "@/components/sections/about-story";
import { CompanyValues } from "@/components/sections/company-values";
import { CompanyJourney } from "@/components/sections/company-journey";
import { LeadershipPreview } from "@/components/sections/leadership-preview";
import { FinalCta } from "@/components/sections/final-cta";

export default function AboutPage() {
  return (
    <>
      <AboutStory />
      <CompanyValues />
      <CompanyJourney />
      <LeadershipPreview />
      <FinalCta />
    </>
  );
}
