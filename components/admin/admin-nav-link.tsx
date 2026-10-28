"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type AdminNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function AdminNavLink({ href, label, icon: Icon }: AdminNavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3.5 py-3 text-xs font-semibold transition-all duration-200 ${active ? "bg-[#183327] text-[#fbf8f2] shadow-[0_8px_20px_rgba(24,51,39,.12)]" : "text-[#716b61] hover:bg-[#f2ece2] hover:text-[#183327]"}`}
    >
      <Icon size={16} className={active ? "text-[#e3b69e]" : "text-[#9a9184] transition-colors group-hover:text-[#b94c3a]"} />
      <span className="flex-1">{label}</span>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#e3b69e]" />}
    </Link>
  );
}
