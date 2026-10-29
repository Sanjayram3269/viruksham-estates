import React from "react";
import { ArrowRight, Compass, Handshake, Leaf } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

export function BrandIntroduction() {
  return (
    <Section className="relative overflow-hidden bg-[#f8f9f2]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[.42fr_1fr] lg:gap-20">
          <div className="flex flex-col items-start justify-between gap-6">
            <Eyebrow>THE VIRUKSHAM APPROACH</Eyebrow>
            <span className="hidden h-24 w-px bg-gradient-to-b from-[#2b8a45] to-transparent lg:block" />
            <p className="hidden max-w-[180px] text-xs leading-6 text-[#718171] lg:block">A considered approach to the places that shape our lives.</p>
          </div>
          <div>
            <h2 className="display-serif max-w-5xl text-3xl leading-[1.12] text-[#174f35] sm:text-4xl lg:text-[3.5rem]">
              Spaces should do more than occupy land. They should create a sense of <span className="italic text-[#2b8a45]">belonging, possibility and permanence.</span>
            </h2>
            <div className="mt-8 grid gap-8 border-t border-[#dce7d5] pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-xl text-sm leading-7 text-[#596b5d] sm:text-base">
                We approach real estate with architectural care, thoughtful planning and enduring values — keeping the people who will use each space at the centre of every decision.
              </p>
              <Button href="/about" variant="outline" className="group inline-flex w-fit items-center gap-3 rounded-full border-[#d3cabc] px-5 py-3.5 text-xs font-semibold hover:border-[#174f35]">
                Learn about our vision <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Compass, title: "Thoughtful planning", text: "Every detail begins with its context." },
                { icon: Handshake, title: "Transparent process", text: "Clear guidance at each step." },
                { icon: Leaf, title: "Long-term value", text: "A view beyond the handover." },
              ].map((item) => {
                const Icon = item.icon;
                return <div key={item.title} className="border-t border-[#d9d0c3] pt-4"><Icon size={17} className="mb-4 text-[#2b8a45]" /><h3 className="text-xs font-bold text-[#174f35]">{item.title}</h3><p className="mt-2 text-xs leading-5 text-[#718171]">{item.text}</p></div>;
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
