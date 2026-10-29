import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { BrandMark } from "@/components/brand/brand-mark";
import {
  Users, CalendarDays, ChartNoAxesCombined,
  Clock3, Newspaper, Settings, Hammer, ShieldCheck, LockKeyhole,
} from "lucide-react";

const ACTIVE_NAV = [
  { href: "/admin/dashboard", label: "Overview", iconName: "overview" },
  { href: "/admin/projects", label: "Projects", iconName: "projects" },
  { href: "/admin/enquiries", label: "Enquiries", iconName: "enquiries" },
];
const LATER_NAV = [
  { label: "Construction services", icon: Hammer },
  { label: "Customers", icon: Users },
  { label: "Site visits", icon: CalendarDays },
  { label: "Sales pipeline", icon: ChartNoAxesCombined },
  { label: "Follow-ups", icon: Clock3 },
  { label: "Journal CMS", icon: Newspaper },
  { label: "Settings", icon: Settings },
];

async function ProtectedAdminShell({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin } = await getAdminUser();
  if (!isAdmin || !profile) redirect("/admin/login?error=unauthorized");

  return (
    <div className="min-h-screen bg-[#f8f9f2] text-[#172c20] md:flex">
      <aside className="relative z-20 flex w-full shrink-0 flex-col border-b border-[#dce7d5] bg-[#f8f9f2] md:sticky md:top-0 md:h-screen md:w-[258px] md:border-b-0 md:border-r">
        <div className="flex items-center justify-between border-b border-[#dce7d5] px-5 py-5 sm:px-6 md:block md:px-6 md:py-7">
          <BrandMark href="/admin/dashboard" />
          <div className="mt-3 hidden items-center gap-2 md:flex"><ShieldCheck size={13} className="text-[#2b8a45]" /><span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#596b5d]">Private workspace</span></div>
          <Link href="/" className="text-[10px] font-semibold text-[#8a8175] underline decoration-[#2b8a45]/50 underline-offset-4 transition hover:text-[#174f35] md:hidden">View site ↗</Link>
        </div>

        <div className="hidden px-5 pb-2 pt-6 md:block"><p className="editorial-kicker text-[#a69a8a]">Workspace</p></div>
        <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto px-3 py-3 md:flex-1 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:px-4 md:py-1">
          {ACTIVE_NAV.map((item) => <AdminNavLink key={item.href} {...item} />)}
          <div className="hidden px-3 pb-1 pt-6 md:block"><p className="editorial-kicker text-[#b3a999]">Coming in future phases</p></div>
          <div className="hidden space-y-1 md:block">
            {LATER_NAV.map((item) => {
              const Icon = item.icon;
              return <div key={item.label} title="This module is not available yet" className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3.5 py-3 text-xs font-medium text-[#b0a99e]"><Icon size={16} /><span className="flex-1">{item.label}</span><LockKeyhole size={11} /></div>;
            })}
          </div>
        </nav>

        <div className="hidden border-t border-[#dce7d5] p-4 md:block">
          <div className="flex items-center gap-3 bg-[#edf3e5] p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8c6ad] text-xs font-bold text-[#174f35]">{(profile.fullName || "A").slice(0,1).toUpperCase()}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#174f35]">{profile.fullName || "Administrator"}</p><p className="mt-1 truncate text-[9px] font-semibold uppercase tracking-[.12em] text-[#596b5d]">{profile.role}</p></div>
            <span className="h-2 w-2 rounded-full bg-[#4c8a5c]" title="Authenticated" />
          </div>
          <p className="mt-3 px-1 text-[9px] leading-4 text-[#a49a8a]">Your workspace is protected by server-side role authorization.</p>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-[#dce7d5] bg-[#f8f9f2]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="min-w-0"><p className="editorial-kicker text-[#2b8a45]">Viruksham / Admin</p><h2 className="mt-1 truncate text-sm font-semibold text-[#174f35]">Management workspace</h2></div>
          <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#6d7768] sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[#4c8a5c]" /> Session verified</span><span className="hidden h-5 w-px bg-[#ded7cb] sm:block" /><AdminSignOutButton /></div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9 xl:p-10">
          {children}
        </main>
        <footer className="flex flex-col gap-1 border-t border-[#dce7d5] bg-[#f8f9f2] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-[#a49a8a] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><span>Viruksham Estates · Management</span><span>Private system · Authorized access only</span></footer>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f5f1e9] text-sm text-[#596b5d]">Verifying administrator session…</div>}><ProtectedAdminShell>{children}</ProtectedAdminShell></Suspense>;
}
