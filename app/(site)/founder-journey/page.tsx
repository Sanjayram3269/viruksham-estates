import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass, Landmark, BriefcaseBusiness, Scale, Users, Building2, Sprout } from "lucide-react";
import { Container } from "@/components/ui/container";

const milestones = [
  { year: "1994", title: "Industry professional", tag: "The foundation", icon: BriefcaseBusiness, body: "The supplied roadmap begins in 1994 with an industry-professional chapter, described with the phrase “Engineering Excellence”. It marks the earliest milestone in the founder’s professional timeline.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85", imageAlt: "Architectural lines of a modern building" },
  { year: "2005", title: "Network marketing", tag: "Building connections", icon: Users, body: "The roadmap identifies a move into network marketing in 2005, framed around “Building Connections”. Relationships and networks become a visible chapter in the story.", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85", imageAlt: "Professionals working together around a table" },
  { year: "2009", title: "GEMSS Real Estates", tag: "Property enters the story", icon: Building2, body: "In 2009, the roadmap records GEMSS Real Estates with the line “Turns Dreams into Reality”. This is the first real-estate business explicitly named in the supplied timeline.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", imageAlt: "Contemporary residential architecture with landscaped outdoor space" },
  { year: "2019", title: "Shivshakthi Sai Constructions", tag: "Construction chapter", icon: Landmark, body: "The 2019 milestone names Shivshakthi Sai Constructions and the promise “Built on Trust, Focused on Quality”. The roadmap presents this as another chapter in the wider professional journey.", image: "https://images.unsplash.com/photo-1503387762-5928b6b7f6a7?auto=format&fit=crop&w=1200&q=85", imageAlt: "Construction and architectural planning" },
  { year: "2020", title: "Advocate — Bar Council of Delhi", tag: "Legal perspective", icon: Scale, body: "The roadmap lists an advocate milestone associated with the Bar Council of Delhi in 2020, with the phrase “Strategic Minds, Strong Defense”. This page records the wording supplied in the roadmap and does not independently verify professional registration.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85", imageAlt: "Law books and a legal reference setting" },
  { year: "2021", title: "Treasurer, AIADMK — Tambaram East", tag: "Community and public life", icon: Users, body: "The 2021 entry records the role “Treasurer, AIADMK, Tambaram East”, accompanied by “Party Driven, People Focused”. It is included as shown on the founder’s supplied roadmap, not as an independently verified current position.", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85", imageAlt: "People gathered around a table in conversation" },
  { year: "2022", title: "Digital Assets Advisor", tag: "Exploring new asset classes", icon: Compass, body: "The roadmap adds a Digital Assets Advisor chapter in 2022 with the line “Unlock your Potential”. It signals an additional professional interest alongside the earlier chapters.", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=85", imageAlt: "Abstract digital network and technology concept" },
];

export const metadata = {
  title: "The Founder’s Roadmap | Viruksham Estates",
  description: "Explore the milestones shown in the founder’s supplied professional roadmap and the values behind the Viruksham Estates story.",
};

export default function FounderJourneyPage() {
  return (
    <div className="overflow-hidden bg-[#f8f7f1] text-[#1b3025]">
      <section className="relative isolate overflow-hidden bg-[#14291f] text-[#f8f7f1]">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85)", backgroundPosition: "center 52%", backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10271d] via-[#10271d]/90 to-[#10271d]/45" />
        <Container className="relative py-16 sm:py-24 lg:py-32">
          <Link href="/journal" className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-[#d7f29b]"><ArrowLeft size={16} /> Back to Journal</Link>
          <p className="editorial-kicker text-[#d7f29b]">Founder story · a timeline</p>
          <h1 className="display-serif mt-5 max-w-4xl text-5xl leading-[.98] sm:text-6xl lg:text-8xl">A journey shaped by <span className="italic text-[#d7f29b]">many chapters.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">From an early professional chapter to real estate, construction, legal work and further areas of interest, this visual story follows the milestones listed in the roadmap shared with us.</p>
          <div className="mt-10 flex flex-wrap gap-3 text-xs font-extrabold uppercase tracking-[.15em] text-white/85"><span className="rounded-full border border-white/25 px-4 py-2">1994 — 2022</span><span className="rounded-full border border-white/25 px-4 py-2">Founder’s timeline</span><span className="rounded-full border border-white/25 px-4 py-2">Viruksham Estates</span></div>
        </Container>
      </section>

      <section className="border-b border-[#deded2] bg-[#ece9df]">
        <Container className="grid gap-8 py-12 md:grid-cols-3 md:gap-10 md:py-16">
          <div><p className="editorial-kicker text-[#347747]">The through-line</p><h2 className="display-serif mt-3 text-3xl sm:text-4xl">Experience is built in layers.</h2></div>
          <p className="text-base font-medium leading-8 text-[#4f5e53]">The roadmap brings together different professional settings across several decades. Rather than treating it as a list of titles, we present it as a sequence of chapters and the themes attached to each one.</p>
          <div className="flex items-start gap-4 border-l border-[#c9cbbd] pl-5"><Sprout className="mt-1 shrink-0 text-[#347747]" size={24}/><p className="text-base leading-7 text-[#4f5e53]">For Viruksham Estates, the public-facing story returns to trust, considered decisions and spaces made for real lives.</p></div>
        </Container>
      </section>

      <section className="relative py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="mb-12 max-w-3xl"><p className="editorial-kicker text-[#347747]">The milestones</p><h2 className="display-serif mt-4 text-4xl sm:text-5xl lg:text-6xl">Seven chapters. One evolving journey.</h2><p className="mt-5 text-base leading-8 text-[#59685d]">Each year below is taken from the supplied roadmap. The accompanying photography is illustrative editorial imagery, not a claim that it depicts the founder or the actual businesses.</p></div>
          <div className="relative">
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-[#cbd6c4] md:left-1/2" />
            <div className="space-y-12 md:space-y-20">
              {milestones.map((item, index) => {
                const Icon = item.icon;
                const reverse = index % 2 === 1;
                return (
                  <article key={item.year} className="relative grid gap-6 pl-12 md:grid-cols-2 md:gap-14 md:pl-0">
                    <span className="absolute left-[8px] top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#f8f7f1] bg-[#2b8749] shadow-[0_0_0_1px_#a8c4a4] md:left-1/2 md:-translate-x-1/2" />
                    <div className={reverse ? "md:order-2" : ""}>
                      <div className="group relative overflow-hidden rounded-2xl bg-[#dedfd4] shadow-[0_20px_55px_rgba(22,45,31,.12)]">
                        <div className="aspect-[5/3] overflow-hidden">
                          <img src={item.image} alt={item.imageAlt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#10271d]/65 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white"><span className="rounded-full border border-white/35 bg-[#10271d]/55 px-4 py-2 text-sm font-extrabold backdrop-blur">{item.year}</span><span className="text-xs font-bold uppercase tracking-[.14em]">{item.tag}</span></div>
                      </div>
                    </div>
                    <div className={`flex flex-col justify-center ${reverse ? "md:order-1 md:pr-4" : "md:pl-4"}`}>
                      <div className="flex items-center gap-3 text-[#347747]"><Icon size={21}/><span className="editorial-kicker">{item.year} / milestone</span></div>
                      <h3 className="display-serif mt-4 text-3xl leading-tight text-[#173a29] sm:text-4xl">{item.title}</h3>
                      <p className="mt-4 text-base font-medium leading-8 text-[#536256]">{item.body}</p>
                      <div className="mt-6 h-px w-20 bg-[#a8cf24]" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#173e2b] py-16 text-white sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div><p className="editorial-kicker text-[#d7f29b]">The next chapter</p><h2 className="display-serif mt-4 text-4xl leading-tight sm:text-5xl">A considered approach to places that matter.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/85">Viruksham Estates presents its work through a focus on trust, thoughtful planning and long-term value. As projects and company milestones are confirmed, this story can grow with them.</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/[.06] p-7 sm:p-9"><p className="editorial-kicker text-[#d7f29b]">Explore further</p><Link href="/about" className="mt-5 flex items-center justify-between border-b border-white/20 py-4 text-lg font-bold hover:text-[#d7f29b]">Our story <ArrowUpRight size={18}/></Link><Link href="/projects" className="flex items-center justify-between border-b border-white/20 py-4 text-lg font-bold hover:text-[#d7f29b]">Explore projects <ArrowUpRight size={18}/></Link><Link href="/contact" className="flex items-center justify-between py-4 text-lg font-bold hover:text-[#d7f29b]">Start a conversation <ArrowUpRight size={18}/></Link></div>
        </Container>
      </section>
      <div className="bg-[#f8f7f1] py-6"><Container><p className="text-xs leading-6 text-[#687469]">Editorial note: professional roles and dates on this page reflect the image supplied for this website update. They have not been independently verified. Replace illustrative photographs with approved founder, team and project photography when available.</p></Container></div>
    </main>
  );
}
