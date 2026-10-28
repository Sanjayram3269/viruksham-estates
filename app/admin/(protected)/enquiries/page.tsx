"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpRight, Check, Clock3, Inbox, LoaderCircle, Mail, MessageCircle, Phone, RefreshCw, Search, SlidersHorizontal, UserRound } from "lucide-react";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  project_slug: string | null;
  enquiry_type: string;
  preferred_contact: string;
  consent: boolean;
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "CONVERTED" | "ARCHIVED";
  created_at: string;
};

const statuses = ["NEW", "IN_REVIEW", "CONTACTED", "CONVERTED", "ARCHIVED"] as const;
const statusPresentation: Record<string, string> = {
  NEW: "border-[#e7c8bc] bg-[#f9e8e1] text-[#984633]",
  IN_REVIEW: "border-[#e5d5af] bg-[#f8f0dc] text-[#8c7040]",
  CONTACTED: "border-[#c7d8c9] bg-[#eaf1e9] text-[#315b3d]",
  CONVERTED: "border-[#bfd5c8] bg-[#dcebe1] text-[#245a3d]",
  ARCHIVED: "border-[#ded8ce] bg-[#f0ece5] text-[#716b61]",
};

function humanize(value: string | null | undefined) {
  return (value || "General").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/enquiries", { credentials: "include", cache: "no-store" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Enquiries could not be loaded.");
      setEnquiries(Array.isArray(body.enquiries) ? body.enquiries : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enquiries could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadEnquiries(); }, [loadEnquiries]);

  const filtered = useMemo(() => enquiries.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [item.name, item.email, item.phone, item.project_slug ?? "", item.message].some((value) => value.toLowerCase().includes(q));
    return matchesQuery && (statusFilter === "ALL" || item.status === statusFilter);
  }), [enquiries, query, statusFilter]);

  async function updateStatus(item: Enquiry, status: Enquiry["status"]) {
    if (item.status === status) return;
    setSavingId(item.id);
    setError(null);
    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Status update failed.");
      setEnquiries((current) => current.map((entry) => entry.id === item.id ? { ...entry, status } : entry));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setSavingId(null);
    }
  }

  const freshCount = enquiries.filter((item) => item.status === "NEW").length;
  const activeCount = enquiries.filter((item) => item.status === "IN_REVIEW" || item.status === "CONTACTED").length;
  const convertedCount = enquiries.filter((item) => item.status === "CONVERTED").length;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="relative overflow-hidden border border-[#d8d0c3] bg-[#183327] px-6 py-7 text-[#fbf8f2] sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="mb-4 flex items-center gap-3"><span className="h-px w-8 bg-[#d97862]" /><span className="editorial-kicker text-white/60">Client relationships</span></div><h1 className="display-serif text-4xl leading-tight text-[#fbf8f2] sm:text-5xl">Every conversation matters.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Review incoming enquiries, understand what people are looking for and keep the next step visible.</p></div><button type="button" onClick={() => void loadEnquiries()} className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/25 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10"><RefreshCw size={14} /> Refresh inbox</button></div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">All enquiries</p><p className="mt-3 text-3xl text-[#183327]">{loading ? "—" : enquiries.length}</p><p className="mt-1 text-xs text-[#81796d]">Records received through the website</p></div>
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">New</p><p className="mt-3 text-3xl text-[#984633]">{loading ? "—" : freshCount}</p><p className="mt-1 text-xs text-[#81796d]">Awaiting first review</p></div>
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">In progress</p><p className="mt-3 text-3xl text-[#8c7040]">{loading ? "—" : activeCount}</p><p className="mt-1 text-xs text-[#81796d]">Under review or contacted</p></div>
        <div className="border border-[#e3dcd1] bg-[#fffdf9] p-5"><p className="editorial-kicker text-[#81796d]">Converted</p><p className="mt-3 text-3xl text-[#315b3d]">{loading ? "—" : convertedCount}</p><p className="mt-1 text-xs text-[#81796d]">Marked as converted by your team</p></div>
      </section>

      {error && <div role="alert" className="border border-[#d8aaa0] bg-[#fff4f1] p-4 text-sm text-[#8b3427]">{error}</div>}

      <section className="border border-[#e3dcd1] bg-[#fffdf9]">
        <div className="border-b border-[#e3dcd1] p-5 sm:p-6"><p className="editorial-kicker text-[#b94c3a]">Lead inbox</p><h2 className="display-serif mt-1 text-2xl text-[#183327]">Incoming conversations</h2><p className="mt-1 text-xs text-[#81796d]">Use the status control to track each enquiry. Updates are saved to Supabase.</p></div>
        <div className="grid gap-3 border-b border-[#e3dcd1] p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <label className="flex items-center gap-3 border border-[#ded7cb] bg-[#fbf8f2] px-3.5 py-3"><Search size={15} className="shrink-0 text-[#948b7e]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone or project…" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a49b8e]" /></label>
          <div className="flex items-center gap-2"><SlidersHorizontal size={15} className="text-[#81796d]" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by enquiry status" className="min-h-11 border border-[#ded7cb] bg-[#fbf8f2] px-3 text-xs font-semibold text-[#183327] outline-none"><option value="ALL">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{humanize(status)}</option>)}</select></div>
        </div>
        {loading ? <div className="flex items-center justify-center gap-3 p-16 text-sm text-[#81796d]"><LoaderCircle size={18} className="animate-spin" />Loading enquiries…</div> : filtered.length === 0 ? (
          <div className="px-6 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1ece2] text-[#183327]"><Inbox size={20} /></span><h3 className="display-serif mt-4 text-2xl text-[#183327]">{enquiries.length ? "No conversations match." : "No enquiries yet."}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81796d]">{enquiries.length ? "Try another search or status filter." : "When a visitor submits the public enquiry form, the conversation will appear here."}</p></div>
        ) : (
          <div className="divide-y divide-[#eee8df]">
            {filtered.map((item) => (
              <article key={item.id} className="grid gap-5 p-5 transition hover:bg-[#fcfaf6] sm:p-6 xl:grid-cols-[1fr_1.2fr_190px] xl:items-start">
                <div className="min-w-0"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8e9df] text-[#183327]"><UserRound size={17} /></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-[#183327]">{item.name}</h3><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#b94c3a]">{humanize(item.enquiry_type)}</p><p className="mt-2 flex items-center gap-2 break-all text-xs text-[#716b61]"><Mail size={12} className="shrink-0" />{item.email}</p><p className="mt-1 flex items-center gap-2 text-xs text-[#716b61]"><Phone size={12} />{item.phone}</p></div></div></div>
                <div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-[#e3dcd1] bg-[#f4efe7] px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#6e6a60]">Contact: {humanize(item.preferred_contact)}</span>{item.project_slug && <span className="rounded-full border border-[#e3dcd1] bg-[#f4efe7] px-3 py-1 text-[9px] font-semibold text-[#6e6a60]">{item.project_slug}</span>}</div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#625f56]">{item.message}</p><p className="mt-3 text-[10px] text-[#9a9184]">{formatDate(item.created_at)}</p></div>
                <div className="flex flex-col gap-3 xl:items-end"><span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] ${statusPresentation[item.status] ?? statusPresentation.NEW}`}>{item.status === "NEW" ? <Inbox size={11} /> : item.status === "CONVERTED" ? <Check size={11} /> : <Clock3 size={11} />}{humanize(item.status)}</span><label className="w-full max-w-[190px]"><span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[.12em] text-[#8b8479]">Update status</span><select disabled={savingId === item.id} value={item.status} onChange={(event) => void updateStatus(item, event.target.value as Enquiry["status"])} className="w-full border border-[#ded7cb] bg-[#fbf8f2] px-3 py-2.5 text-xs font-semibold text-[#183327] outline-none focus:border-[#b94c3a] disabled:opacity-60">{statuses.map((status) => <option key={status} value={status}>{humanize(status)}</option>)}</select></label><span className="text-[10px] text-[#9a9184]">{savingId === item.id ? "Saving…" : item.consent ? "Consent recorded" : "Consent not recorded"}</span></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
