import React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { HeroFadeIn } from "@/components/ui/hero-motion";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f8f9f2]">
      <div className="pointer-events-none absolute -right-32 top-16 h-[580px] w-[580px] rounded-full border border-[#174f35]/[0.07]" />
      <div className="pointer-events-none absolute -right-12 top-32 h-[430px] w-[430px] rounded-full border border-[#174f35]/[0.09]" />
      <Container className="relative z-10">
        <div className="grid min-h-[700px] items-center gap-8 py-12 lg:min-h-[750px] lg:grid-cols-[.92fr_1.08fr] lg:gap-5 lg:py-14">
          <div className="relative z-10 py-6 lg:py-10">
            <HeroFadeIn delay={0.1}>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-[#2b8a45]" />
                <span className="editorial-kicker text-[#6b766b]">Considered living · enduring value</span>
              </div>
            </HeroFadeIn>
            <HeroFadeIn delay={0.2}>
              <h1 className="display-serif max-w-[760px] text-[clamp(3.5rem,7.4vw,7rem)] leading-[.94] text-[#182e23]">
                A place to
                <br />
                <span className="italic text-[#2b8a45]">belong.</span>
                <br />
                A future to
                <br />
                <span className="relative inline-block">build<span className="absolute -bottom-1 left-0 h-[2px] w-4/5 bg-[#2b8a45]/75" />.</span>
              </h1>
            </HeroFadeIn>
            <HeroFadeIn delay={0.34}>
              <p className="mt-8 max-w-md text-[15px] leading-7 text-[#6b6a60] sm:text-base">
                Thoughtfully considered spaces shaped around real lives, a sense of place and the promise of what comes next.
              </p>
            </HeroFadeIn>
            <HeroFadeIn delay={0.46}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/projects" className="group inline-flex min-h-13 items-center justify-center gap-8 rounded-full bg-[#174f35] px-6 py-4 text-sm font-semibold text-[#f8f9f2] shadow-[0_14px_30px_rgba(24,51,39,.16)] transition hover:-translate-y-1 hover:bg-[#284c3a]">
                  Explore our projects <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link href="/about" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-[#d7d0c4] px-6 py-4 text-sm font-semibold text-[#174f35] transition hover:border-[#174f35] hover:bg-white/60">
                  The Viruksham story <ArrowRight size={15} />
                </Link>
              </div>
            </HeroFadeIn>
            <HeroFadeIn delay={0.58}>
              <div className="mt-12 flex items-center gap-5 border-t border-[#dce7d5] pt-5">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8f9f2] bg-[#ded2bf] text-[10px] font-semibold text-[#174f35]">V</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8f9f2] bg-[#b8c3ae] text-[10px] font-semibold text-[#174f35]">E</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8f9f2] bg-[#e5c4b4] text-[10px] font-semibold text-[#174f35]">+</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#263c2d]">Every detail has a purpose</p>
                  <p className="mt-0.5 text-[11px] text-[#777267]">A considered approach to every space.</p>
                </div>
              </div>
            </HeroFadeIn>
          </div>

          <HeroFadeIn delay={0.24} className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
            <div className="relative">
              <div className="absolute -right-3 -top-3 h-full w-full border border-[#2b8a45]/35 sm:-right-5 sm:-top-5" />
              <div className="relative aspect-[4/4.65] overflow-hidden shadow-[0_30px_90px_rgba(24,51,39,.17)] sm:aspect-[4/4.2]">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90" alt="Contemporary home opening onto a landscaped terrace" className="h-full min-h-[420px] w-full object-cover" fetchPriority="high" />
              </div>
              <div className="float-slow absolute -bottom-6 left-3 max-w-[270px] border border-[#e3dcd1] bg-[#f8f9f2] p-4 shadow-[0_18px_40px_rgba(24,51,39,.12)] sm:-left-8 sm:p-5">
                <p className="editorial-kicker text-[#2b8a45]">The Viruksham outlook</p>
                <p className="display-serif mt-2 text-xl leading-tight text-[#174f35] sm:text-2xl">Designed for the life you imagine.</p>
              </div>
              <div className="absolute -right-2 top-8 hidden -rotate-90 origin-right text-[9px] font-semibold uppercase tracking-[.32em] text-[#174f35]/55 sm:block">Spaces with meaning · Est. with intention</div>
            </div>
            <a href="#discover" className="mt-12 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#6e7065] transition hover:text-[#2b8a45]">
              Discover the difference <ArrowDownRight size={16} />
            </a>
          </HeroFadeIn>
        </div>
      </Container>
      <div id="discover" className="h-px w-full bg-gradient-to-r from-transparent via-[#174f35]/20 to-transparent" />
    </section>
  );
}
