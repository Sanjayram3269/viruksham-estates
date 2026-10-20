import { Suspense } from "react";
import { getAdminUser } from "@/lib/auth/admin";
import {
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
  Info,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — Viruksham Estates",
  description: "Management dashboard for Viruksham Estates platform.",
};

const MODULE_CARDS = [
  {
    title: "Projects Catalogue",
    description: "Manage real-estate developments, availability, media galleries, and unit masterplans.",
    icon: Building2,
    status: "Under Development",
    href: "/admin/projects",
  },
  {
    title: "Construction Services",
    description: "Turnkey construction, architectural design offerings, and service specifications.",
    icon: Hammer,
    status: "Under Development",
    href: "/admin/services",
  },
  {
    title: "Public Enquiries",
    description: "Inbound customer contact submissions and project inquiry triage.",
    icon: MessageSquare,
    status: "Under Development",
    href: "/admin/enquiries",
  },
  {
    title: "CRM Customers",
    description: "Qualified leads, client profiles, and contact history.",
    icon: Users,
    status: "Under Development",
    href: "/admin/customers",
  },
  {
    title: "Site Visits",
    description: "Scheduled property walk-throughs and visitor feedback management.",
    icon: Calendar,
    status: "Under Development",
    href: "/admin/visits",
  },
  {
    title: "Sales Pipeline",
    description: "Lead progression, unit bookings, and transaction status.",
    icon: TrendingUp,
    status: "Under Development",
    href: "/admin/sales",
  },
  {
    title: "Follow-up Reminders",
    description: "Task queues and scheduled reminders for administrative follow-ups.",
    icon: Clock,
    status: "Under Development",
    href: "/admin/followups",
  },
  {
    title: "Journal CMS",
    description: "Editorial market insights, architectural articles, and published news.",
    icon: Newspaper,
    status: "Under Development",
    href: "/admin/journal",
  },
  {
    title: "System Settings",
    description: "Platform parameters, administrative profile roles, and security audit logs.",
    icon: Settings,
    status: "Under Development",
    href: "/admin/settings",
  },
];

async function DashboardContent() {
  const { profile } = await getAdminUser();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Welcome back, {profile?.fullName || "Administrator"}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
              {profile?.role || "admin"}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Viruksham Estates Digital Platform — Administration & Management Portal
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-md border border-stone-200">
          <ShieldCheck className="h-4 w-4 text-emerald-800 shrink-0" />
          <span>Authenticated Session Active</span>
        </div>
      </div>

      {/* Operational Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-950">System Status Notice</p>
          <p className="mt-0.5 text-blue-800">
            Authentication, middleware session refresh, and database role authorization (Phase 2A) are fully operational.
            Management modules are undergoing staged CMS and CRM integration. No fabricated metrics or synthetic customer records are rendered.
          </p>
        </div>
      </div>

      {/* System Modules Grid */}
      <div>
        <h2 className="text-sm font-semibold text-stone-800 mb-4 tracking-wide uppercase">
          Platform Management Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                      {card.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-900">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>Module Status</span>
                  <span className="font-mono text-[11px] text-stone-500">Under Dev</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500">
          Loading dashboard content...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
