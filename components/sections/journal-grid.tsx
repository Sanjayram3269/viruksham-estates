import React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Leaf, PenLine } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { JournalCard } from "@/components/journal/journal-card";
import { journalPosts } from "@/lib/content";

export function JournalGrid() {
  return (
    <div className="bg-[#f8f9f2]">
      <section className="relative overflow-hidden bg-[#174f35] text-[#f8f9f2]">
        <div className="absolute inset-0 architecture-grid opacity-[0.07]" aria-hidden="true" />
        <Container className="relative py-16 sm:py-20 lg:py-28">
          <div className="max-w-4xl"><div className="mb-6 flex items-center gap-3"><span className="h-px w-9 bg-[#a8cf24]" /><span className="editorial-kicker text-white/60">The Viruksham journal</span></div><h1 className="display-serif text-5xl leading-[.98] text-[#f8f9f2] sm:text-6xl lg:text-7xl">Thoughts on place, <span className="italic text-[#d7f29b]">space</span> and possibility.</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">Perspectives on considered development, architecture and the decisions that shape where we live and work.</p></div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs font-semibold uppercase tracking-[.17em] text-white/55"><span className="inline-flex items-center gap-2"><BookOpen size={14} className="text-[#d7f29b]" /> Ideas & insights</span><span className="inline-flex items-center gap-2"><Compass size={14} className="text-[#d7f29b]" /> Perspectives on place</span><span className="inline-flex items-center gap-2"><PenLine size={14} className="text-[#d7f29b]" /> Stories in progress</span></div>
        </Container>
      </section>
      <Section className="bg-[#f8f9f2]">
        <Container className="space-y-10">
          <Link href="/founder-journey" className="group grid overflow-hidden rounded-2xl border border-[#dce7d5] bg-white shadow-[0_20px_60px_rgba(23,55,37,.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(23,55,37,.14)] md:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[240px] overflow-hidden bg-[#d9e0d2]">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" alt="Modern residential architecture surrounded by greenery" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute left-5 top-5 rounded-full bg-[#d7f29b] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#173a29]">Founder’s story</span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10"><p className="editorial-kicker text-[#2b8a45]">1994 — 2022 / A visual timeline</p><h2 className="display-serif mt-3 text-3xl leading-tight text-[#174f35] sm:text-4xl">The founder’s roadmap: a journey through many chapters.</h2><p className="mt-4 text-base leading-7 text-[#596b5d]">Explore the professional milestones, businesses and themes shown in the roadmap shared with us — presented as a visual, long-form editorial story.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#174f35]">Read the full story <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1"/></span></div>
          </Link>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="editorial-kicker text-[#2b8a45]">From our desk</p><h2 className="display-serif mt-3 text-4xl text-[#174f35] sm:text-5xl">Notes worth a pause.</h2></div><p className="max-w-sm text-sm leading-6 text-[#596b5d]">A developing editorial space for useful, grounded conversations about property and place.</p></div>
          {journalPosts.length === 0 ? (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden border border-[#dce7d5] bg-[#edf3e5] p-7 sm:min-h-[390px] sm:p-10">
                <div className="absolute -right-12 -top-14 h-72 w-72 rounded-full border border-[#174f35]/10" /><div className="absolute -right-1 top-2 h-52 w-52 rounded-full border border-[#174f35]/10" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#d4c8b8] bg-[#f8f9f2] text-[#2b8a45]"><Leaf size={21} /></span>
                <div className="relative max-w-lg"><p className="editorial-kicker text-[#2b8a45]">First edition / in preparation</p><h3 className="display-serif mt-3 text-3xl leading-tight text-[#174f35] sm:text-4xl">Good places begin with good questions.</h3><p className="mt-4 text-sm leading-6 text-[#596b5d]">Our first stories are being prepared. We will publish practical perspectives here when they are ready to share.</p></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <article className="lift-card border border-[#dce7d5] bg-[#ffffff] p-6"><span className="editorial-kicker text-[#a49a8a]">Perspective 01</span><h3 className="display-serif mt-3 text-2xl text-[#174f35]">Reading a place before reading a plan.</h3><p className="mt-3 text-sm leading-6 text-[#596b5d]">A future conversation about context, access and the qualities that make a location work.</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[#2b8a45]">Editorial concept <ArrowUpRight size={13} /></span></article>
                <article className="lift-card border border-[#dce7d5] bg-[#ffffff] p-6"><span className="editorial-kicker text-[#a49a8a]">Perspective 02</span><h3 className="display-serif mt-3 text-2xl text-[#174f35]">The everyday life of a well-made space.</h3><p className="mt-3 text-sm leading-6 text-[#596b5d]">A future story about light, movement and the details that make a space feel considered.</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[#2b8a45]">Editorial concept <ArrowUpRight size={13} /></span></article>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{journalPosts.map((post) => <JournalCard key={post.id} post={post} />)}</div>
          )}
          <div className="flex flex-col gap-4 border-t border-[#dce7d5] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#596b5d]">Have a question about an upcoming development?</p><Link href="/contact" className="inline-flex w-fit items-center gap-2 text-xs font-bold text-[#174f35] transition hover:text-[#2b8a45]">Start a conversation <ArrowUpRight size={14} /></Link></div>
        </Container>
      </Section>
    </div>
  );
}
