import { Suspense } from "react";
import Link from "next/link";
import { getAdminUser } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, CircleAlert, Clock3, Inbox, MessageSquare, Users2 } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — Viruksham Estates",
  description: "The Viruksham Estates administration workspace.",
};

function MetricCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof Building2; tone: "green" | "clay" | "sand" | "dark" }) {
  const tones = {
    green: "bg-[#e7eee7] text-[#244a35]",
    clay: "bg-[#f5e5df] text-[#a44836]",
    sand: "bg-[#eee7d8] text-[#8c7046]",
    dark: "bg-[#183327] text-[#fbf8f2]",
  };
  return (
    <article className="lift-card border border-[#e3dcd1] bg-[#fffdf9] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3"><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#81796d]">{label}</p><span className={`flex h-10 w-10 items-center justify-center rounded-full ${tones[tone]}`}><Icon size={18} /></span></div>
      <p className="mt-5 text-4xl font-medium tracking-[-.05em] text-[#183327]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#81796d]">{note}</p>
    </article>
  );
}

async function DashboardContent() {
  const { profile } = await getAdminUser();
  const supabase = await createClient();

  const [
    { count: projectCount, error: projectsError },
    { count: enquiryCount, error: enquiriesError },
    { count: customerCount, error: customersError },
    { data: latestEnquiries, error: latestError },
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id,name,email,project_slug,enquiry_type,status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const anyError = projectsError || enquiriesError || customersError || latestError;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="relative overflow-hidden border border-[#d8d0c3] bg-[#183327] px-6 py-7 text-[#fbf8f2] sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-8 -top-28 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96" /><div className="pointer-events-none absolute right-20 top-12 h-48 w-48 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="mb-5 flex items-center gap-2"><span className="h-px w-8 bg-[#d97862]" /><p className="editorial-kicker text-white/65">Your workspace · Overview</p></div><h1 className="display-serif max-w-3xl text-4xl leading-tight text-[#fbf8f2] sm:text-5xl">Welcome back, <span className="italic text-[#e2b39f]">{profile?.fullName || "Administrator"}.</span></h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/65">A clear view of your developments, incoming enquiries and the next actions for your team.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-full bg-[#d8b18a] px-5 py-3.5 text-xs font-bold text-[#183327] transition hover:-translate-y-0.5 hover:bg-[#e5c5a5]">Add a project <ArrowUpRight size={15} /></Link><Link href="/admin/enquiries" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-white/10">View enquiries <ArrowUpRight size={15} /></Link></div></div>
        <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[.15em] text-white/55"><span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#9fce9e]" /> Authenticated session</span><span>Access level · {profile?.role || "admin"}</span><span className="hidden sm:inline">Viruksham Estates / Administration</span></div>
      </section>

      {anyError && <div role="status" className="flex gap-3 border border-[#d8b18a] bg-[#f6eddf] p-4 text-sm text-[#725b3b]"><CircleAlert size={17} className="mt-0.5 shrink-0" /><span>Some database summaries could not be loaded. Counts below show “—” wherever a query failed.</span></div>}

      <section><div className="mb-4 flex items-end justify-between gap-3"><div><p className="editorial-kicker text-[#b94c3a]">Live workspace</p><h2 className="display-serif mt-2 text-3xl text-[#183327]">At a glance</h2></div><span className="text-[10px] uppercase tracking-[.13em] text-[#948b7e]">Live database counts</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total projects" value={projectsError ? "—" : String(projectCount ?? 0)} note="Drafts and published developments" icon={Building2} tone="green" />
        <MetricCard label="Incoming enquiries" value={enquiriesError ? "—" : String(enquiryCount ?? 0)} note="All enquiry records received" icon={Inbox} tone="clay" />
        <MetricCard label="CRM customers" value={customersError ? "—" : String(customerCount ?? 0)} note="Customer records in the CRM" icon={Users2} tone="sand" />
        <MetricCard label="Access verified" value="Secure" note="Server-validated administrator session" icon={CheckCircle2} tone="dark" />
      </div></section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="overflow-hidden border border-[#e3dcd1] bg-[#fffdf9]">
          <div className="flex items-center justify-between gap-4 border-b border-[#e3dcd1] px-5 py-5 sm:px-6"><div><p className="editorial-kicker text-[#b94c3a]">Inbox</p><h2 className="display-serif mt-1 text-2xl text-[#183327]">Latest enquiries</h2></div><Link href="/admin/enquiries" className="inline-flex items-center gap-2 text-xs font-semibold text-[#183327] hover:text-[#b94c3a]">Open inbox <ArrowRight size={14} /></Link></div>
          {latestError ? <p className="p-6 text-sm text-[#8b3427]">Latest enquiries could not be loaded.</p> : latestEnquiries?.length ? <div className="divide-y divide-[#eee8df]">{latestEnquiries.map((enquiry) => <Link href="/admin/enquiries" key={enquiry.id} className="group grid grid-cols-[1fr_auto] gap-4 px-5 py-4 transition hover:bg-[#f8f4ed] sm:px-6"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#183327] group-hover:text-[#b94c3a]">{enquiry.name}</p><p className="mt-1 truncate text-xs text-[#81796d]">{enquiry.project_slug || String(enquiry.enquiry_type).replaceAll("_", " ").toLowerCase()}</p></div><div className="text-right"><span className="inline-flex rounded-full border border-[#e3dcd1] bg-[#f5efe5] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#706b60]">{String(enquiry.status).replaceAll("_", " ")}</span><p className="mt-2 text-[10px] text-[#948b7e]">{new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(enquiry.created_at))}</p></div></Link>)}</div> : <div className="px-6 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1ece2] text-[#183327]"><MessageSquare size={20} /></span><h3 className="display-serif mt-4 text-2xl text-[#183327]">The inbox is clear.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#81796d]">New public enquiries will appear here when visitors submit the contact form.</p></div>}
        </div>

        <div className="space-y-4"><div className="border border-[#e3dcd1] bg-[#f2ece1] p-6"><p className="editorial-kicker text-[#b94c3a]">Quick actions</p><h2 className="display-serif mt-2 text-2xl text-[#183327]">Move things forward.</h2><div className="mt-5 flex flex-col"><Link href="/admin/projects" className="flex items-center justify-between border-t border-[#ddd3c4] py-4 text-sm font-semibold text-[#183327] transition hover:pl-1 hover:text-[#b94c3a]">Manage projects <ArrowUpRight size={16} /></Link><Link href="/admin/projects/new" className="flex items-center justify-between border-t border-[#ddd3c4] py-4 text-sm font-semibold text-[#183327] transition hover:pl-1 hover:text-[#b94c3a]">Create a development <ArrowUpRight size={16} /></Link><Link href="/admin/enquiries" className="flex items-center justify-between border-t border-[#ddd3c4] py-4 text-sm font-semibold text-[#183327] transition hover:pl-1 hover:text-[#b94c3a]">Review enquiries <ArrowUpRight size={16} /></Link></div></div>
          <div className="border border-[#e3dcd1] bg-[#fffdf9] p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eee7] text-[#244a35]"><CheckCircle2 size={18} /></span><div><p className="text-sm font-semibold text-[#183327]">Access verified</p><p className="mt-0.5 text-xs text-[#81796d]">Server-side role check is active</p></div></div><div className="mt-5 flex items-start gap-3 border-t border-[#eee8df] pt-4"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#b94c3a]" /><p className="text-xs leading-5 text-[#81796d]">Other CRM modules will be introduced as their workflows are completed. No placeholder performance figures are shown.</p></div></div>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-[#81796d]">Loading management overview…</div>}><DashboardContent /></Suspense>;
}
