import { ArrowRight, Building2, Compass, Layers3 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PublishedProjectGrid } from "@/components/projects/published-project-grid";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Our Projects | Viruksham Estates",
  description: "Explore considered residential, plotted and commercial developments by Viruksham Estates.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const projects = data ?? [];

  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <section className="relative overflow-hidden bg-[#183327] text-[#fbf8f2]">
        <div className="absolute inset-0 opacity-[0.08] architecture-grid" aria-hidden="true" />
        <div className="absolute -right-32 -top-40 h-[580px] w-[580px] rounded-full border border-white/15" />
        <div className="absolute -right-12 -top-20 h-[420px] w-[420px] rounded-full border border-white/15" />
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.7fr] lg:items-end lg:py-28">
          <div>
            <div className="mb-6 flex items-center gap-3"><span className="h-px w-10 bg-[#d97862]" /><span className="editorial-kicker text-white/65">The portfolio</span></div>
            <h1 className="display-serif max-w-3xl text-5xl leading-[.98] text-[#fbf8f2] sm:text-6xl lg:text-7xl">Spaces shaped by <span className="italic text-[#e2b39f]">intention.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Every development begins with a simple question: how should this place make life feel? Discover the Viruksham portfolio.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/20 pt-5 lg:ml-auto lg:w-full lg:max-w-md">
            <div><Building2 size={18} className="mb-3 text-[#e2b39f]" /><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/60">Residential</p></div>
            <div><Compass size={18} className="mb-3 text-[#e2b39f]" /><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/60">Land & plots</p></div>
            <div><Layers3 size={18} className="mb-3 text-[#e2b39f]" /><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/60">Commercial</p></div>
          </div>
        </Container>
        <div className="h-1 w-full bg-gradient-to-r from-[#b94c3a] via-[#d9b785] to-transparent" />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="editorial-kicker text-[#b94c3a]">Selected developments</p><h2 className="display-serif mt-3 text-4xl text-[#183327] sm:text-5xl">Find your next place.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-[#716b61]">Browse the projects currently published by our team. Each listing includes the details available at this stage.</p>
        </div>

        {error ? (
          <div role="alert" className="border border-[#d8aaa0] bg-[#fff4f1] p-5 text-sm text-[#8b3427]">
            We couldn’t load the portfolio just now. Please refresh the page or contact our team.
          </div>
        ) : (
          <PublishedProjectGrid projects={projects} />
        )}
      </section>

      <section className="border-y border-[#e3dcd1] bg-[#f3eee6]">
        <Container className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div><p className="editorial-kicker text-[#b94c3a]">Need a little guidance?</p><h2 className="display-serif mt-2 text-3xl text-[#183327]">Let’s find the right fit.</h2></div>
          <Link href="/contact" className="inline-flex items-center gap-3 self-start rounded-full border border-[#c9c0b3] px-5 py-3.5 text-xs font-semibold text-[#183327] transition hover:border-[#183327] hover:bg-white sm:self-auto">Talk to our team <ArrowRight size={15} /></Link>
        </Container>
      </section>
    </div>
  );
}
