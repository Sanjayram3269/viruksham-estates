import React from "react";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  label?: string;
  className?: string;
  variant?: "hero" | "project" | "detail" | "land";
}

export function MediaPlaceholder({
  label = "PROJECT PHOTOGRAPH COMING SOON",
  className,
  variant = "project",
}: MediaPlaceholderProps) {
  const isHero = variant === "hero";
  const isLand = variant === "land";

  return (
    <div className={cn("relative isolate h-full min-h-[240px] w-full overflow-hidden bg-[#e6dfd2]", className)} aria-label={label} role="img">
      <svg viewBox="0 0 1200 820" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="ve-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isHero ? "#d8d7c9" : "#e5dccd"} />
            <stop offset="54%" stopColor={isLand ? "#b9c0a0" : "#f1e9dc"} />
            <stop offset="100%" stopColor={isHero ? "#a9b7a8" : "#c6c8b6"} />
          </linearGradient>
          <linearGradient id="ve-building" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6f0e5" />
            <stop offset="50%" stopColor="#c8c4b7" />
            <stop offset="100%" stopColor="#8b9a91" />
          </linearGradient>
          <linearGradient id="ve-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#17392c" stopOpacity=".42" />
            <stop offset="100%" stopColor="#17392c" stopOpacity="0" />
          </linearGradient>
          <pattern id="ve-window-grid" width="82" height="74" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="64" height="54" fill="#52716c" fillOpacity=".9" />
            <path d="M37 5V59M5 31H69" stroke="#f6f0e5" strokeOpacity=".78" strokeWidth="3" />
            <path d="M10 9L30 9L10 30Z" fill="#f4f3e6" fillOpacity=".15" />
          </pattern>
          <pattern id="ve-grain" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="17" r="1" fill="#183327" fillOpacity=".12" />
            <circle cx="82" cy="64" r=".8" fill="#183327" fillOpacity=".1" />
            <circle cx="48" cy="106" r=".7" fill="#183327" fillOpacity=".1" />
          </pattern>
        </defs>
        <rect width="1200" height="820" fill="url(#ve-sky)" />
        <circle cx="920" cy="115" r="92" fill="#f9f2df" fillOpacity=".4" />
        {isLand ? (
          <>
            <path d="M0 460L260 320L470 430L690 280L930 430L1200 300V820H0Z" fill="#8d9e82" />
            <path d="M0 580L300 455L520 555L800 400L1200 560V820H0Z" fill="#6d8b70" />
            <path d="M0 700L380 570L650 655L970 525L1200 620V820H0Z" fill="#456a50" />
            <path d="M125 820L480 575L590 575L380 820Z" fill="#eee2c8" />
            <path d="M390 820L610 575L645 575L520 820Z" fill="#f8f2e7" />
            {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${105 + i*145} 640L${30+i*172} 690M${270+i*145} 735L${200+i*145} 780`} stroke="#e1d7be" strokeWidth="2" />)}
          </>
        ) : (
          <>
            <path d="M0 820V210L248 126L410 165V820Z" fill="#c9c6b9" />
            <path d="M18 224L245 152L385 183V820H18Z" fill="url(#ve-window-grid)" />
            <path d="M0 208L248 120L410 160V208L248 170L0 260Z" fill="#f8f2e8" />
            <path d="M300 820V90L570 45L825 95V820Z" fill="url(#ve-building)" />
            <path d="M328 133L570 95L792 138V785H328Z" fill="url(#ve-window-grid)" />
            <path d="M300 92L570 40L825 90V145L570 98L300 148Z" fill="#fbf6ed" />
            <path d="M540 820V190L800 145L1200 188V820Z" fill="#e0ddd2" />
            <path d="M568 220L805 180L1176 222V755L568 790Z" fill="url(#ve-window-grid)" />
            <path d="M540 190L800 145L1200 188V236L800 195L540 245Z" fill="#faf4e8" />
            <path d="M560 450L830 404L1200 435V480L830 453L560 495Z" fill="#f9f2e6" />
            <path d="M560 645L830 608L1200 635V678L830 655L560 689Z" fill="#f9f2e6" />
            <path d="M0 700L300 660L540 694V740L300 714L0 748Z" fill="#f8f2e8" />
            <path d="M0 820L0 620L300 584V820Z" fill="url(#ve-shadow)" />
            <path d="M0 820L210 770L370 820Z" fill="#7f927c" />
            <path d="M700 820L820 760L1040 820Z" fill="#718674" />
            {Array.from({length: 5}).map((_, i) => <g key={i} opacity=".65"><path d={`M${720+i*88} 820v-72`} stroke="#8caa8a" strokeWidth="5" /><circle cx={750+i*88} cy="740" r="24" fill="#63836b" /><circle cx={735+i*88} cy="760" r="17" fill="#7a9675" /></g>)}
          </>
        )}
        <rect width="1200" height="820" fill="url(#ve-grain)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#13251c]/70 via-transparent to-[#13251c]/5" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#13251c]/45 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.19em] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d5b883]" />
            Visual placeholder
          </span>
          <p className="mt-2 text-xs font-medium text-white/75">{label}</p>
        </div>
        {isHero && <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/60 sm:block">Replace with original photography</span>}
      </div>
    </div>
  );
}
