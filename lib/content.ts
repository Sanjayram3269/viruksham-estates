import { Project } from "@/types/project";
import { JournalPost } from "@/types/journal";
import { LeadershipMember, TimelineEvent, Testimonial } from "@/types/company";

export const siteConfig = {
  name: "Viruksham Estates",
  tagline: "Your Trust, Our Commitment",
  description:
    "Viruksham Estates — premium real-estate projects, developments and property solutions.",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

export const projects: Project[] = [];

export const journalPosts: JournalPost[] = [];

export const leadership: LeadershipMember[] = [];

export const timeline: TimelineEvent[] = [];

export const testimonials: Testimonial[] = [];
