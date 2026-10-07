import { Hero } from "@/components/sections/hero";
import { BrandIntroduction } from "@/components/sections/brand-introduction";
import { TrustStrip } from "@/components/sections/trust-strip";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { WhyViruksham } from "@/components/sections/why-viruksham";
import { Journey } from "@/components/sections/journey";
import { JournalPreview } from "@/components/sections/journal-preview";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntroduction />
      <TrustStrip />
      <FeaturedProjects />
      <WhyViruksham />
      <Journey />
      <JournalPreview />
      <FinalCta />
    </>
  );
}
