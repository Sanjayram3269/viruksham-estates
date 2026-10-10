import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out";
import {
  LayoutDashboard,
  Building2,
  Hammer,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Newspaper,
  Settings,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, active: true },
  { href: "/admin/projects", label: "Projects", icon: Building2, status: "Under Development" },
  { href: "/admin/services", label: "Construction Services", icon: Hammer, status: "Under Development" },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare, status: "Under Development" },
  { href: "/admin/customers", label: "Customers", icon: Users, status: "Under Development" },
  { href: "/admin/visits", label: "Site Visits", icon: Calendar, status: "Under Development" },
  { href: "/admin/sales", label: "Sales Pipeline", icon: TrendingUp, status: "Under Development" },
  { href: "/admin/followups", label: "Follow-ups", icon: Clock, status: "Under Development" },
  { href: "/admin/journal", label: "Journal CMS", icon: Newspaper, status: "Under Development" },
  { href: "/admin/settings", label: "Settings", icon: Settings, status: "Under Development" },
];

async function AdminShellInner({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const { profile, isAdmin } = await getAdminUser();

  if (!isAdmin || !profile) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-lg font-serif font-bold tracking-tight text-stone-900 hover:text-emerald-900 transition"
            >
              Viruksham Estates
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-800" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition ${
                  item.active
                    ? "bg-emerald-950 text-white font-semibold shadow-sm"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${item.active ? "text-white" : "text-stone-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.status && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-normal">
                    Dev
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {profile.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500 truncate">
                  {profile.role}
                </span>
              </div>
            </div>
            <AdminSignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Header */}
        <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-stone-800">
              Management Dashboard
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
              Operational Core
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>Server Authenticated</span>
            <div className="h-3 w-px bg-stone-200" />
            <AdminSignOutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] p-8 flex items-center justify-center text-xs text-stone-500">
          Verifying administrator session...
        </div>
      }
    >
      <AdminShellInner>{children}</AdminShellInner>
    </Suspense>
  );
}
