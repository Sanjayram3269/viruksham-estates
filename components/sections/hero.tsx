import React from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { HeroFadeIn } from "@/components/ui/hero-motion";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] lg:min-h-[93vh] w-full flex-col justify-between overflow-hidden bg-[#faf8f5] pt-12 pb-10 lg:py-16">
      {/* Visual / Media Region with Layered Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <MediaPlaceholder label="PROJECT MEDIA / COMING SOON" />
        {/* Responsive Layered Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/85 to-[#faf8f5]/40 lg:bg-gradient-to-r lg:from-[#faf8f5] lg:via-[#faf8f5]/90 lg:to-transparent lg:w-3/4" />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-between">
        {/* Upper whitespace spacer */}
        <div className="h-6 lg:h-12" />

        {/* Asymmetric Left-Aligned Editorial Typography Block */}
        <div className="max-w-2xl py-6 space-y-6 lg:space-y-8">
          <HeroFadeIn delay={0.2}>
            <Eyebrow>VIRUKSHAM ESTATES</Eyebrow>
          </HeroFadeIn>

          <HeroFadeIn delay={0.35}>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1c1917] sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[1.08]">
              Building Spaces.
              <br />
              <span className="text-[#1e3a2b]">Shaping Futures.</span>
            </h1>
          </HeroFadeIn>

          <HeroFadeIn delay={0.5}>
            <p className="max-w-xl text-base text-[#645d57] sm:text-lg lg:text-xl leading-relaxed">
              Thoughtfully designed spaces where people, place and possibility come together.
            </p>
          </HeroFadeIn>

          <HeroFadeIn delay={0.65}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button href="/projects" variant="primary" className="px-7 py-3.5 text-base">
                Explore Projects
              </Button>
              <Button
                href="/contact"
                variant="outline"
                className="px-7 py-3.5 text-base border-[#1c1917]/20 hover:border-[#1c1917]"
              >
                Start a Conversation
              </Button>
            </div>
          </HeroFadeIn>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="pt-6">
          <HeroFadeIn delay={0.8}>
            <ScrollIndicator />
          </HeroFadeIn>
        </div>
      </Container>
    </section>
  );
}
