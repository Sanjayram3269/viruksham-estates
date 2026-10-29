"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, MessageSquare } from "lucide-react";

const icons = {
  overview: LayoutDashboard,
  projects: Building2,
  enquiries: MessageSquare,
} as const;

type AdminNavLinkProps = {
  href: string;
  label: string;
  iconName: keyof typeof icons;
};

export function AdminNavLink({ href, label, iconName }: AdminNavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));
  const Icon = icons[iconName];

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3.5 py-3 text-xs font-semibold transition-all duration-200 ${active ? "bg-[#174f35] text-white shadow-[0_8px_20px_rgba(23,79,53,.18)]" : "text-[#596b5d] hover:bg-[#edf3e5] hover:text-[#174f35]"}`}
    >
      <Icon size={16} className={active ? "text-[#d7f29b]" : "text-[#2b8a45] transition-colors"} />
      <span className="flex-1">{label}</span>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#a8cf24]" />}
    </Link>
  );
}
