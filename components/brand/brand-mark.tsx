import Link from "next/link";

type BrandMarkProps = {
  inverse?: boolean;
  compact?: boolean;
  href?: string;
};

export function BrandMark({ inverse = false, compact = false, href = "/" }: BrandMarkProps) {
  const ink = inverse ? "#f8f7ef" : "#174f35";
  const leaf = "#2b8a45";
  const lime = "#a8cf24";

  return (
    <Link href={href} aria-label="Viruksham Estates home" className="group inline-flex items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-[54px] sm:w-[54px]">
        <svg viewBox="0 0 100 100" role="img" aria-label="Viruksham Estates tree emblem" className="h-full w-full">
          <circle cx="50" cy="50" r="46" fill="none" stroke={leaf} strokeWidth="4" />
          <g fill={leaf}>
            <path d="M50 13C42 24 43 31 50 38C57 30 58 23 50 13Z" />
            <path d="M36 22C27 24 25 31 34 38C39 32 40 27 36 22Z" />
            <path d="M64 22C60 27 61 32 66 38C75 31 73 24 64 22Z" />
            <path d="M25 33C15 33 14 41 25 46C30 41 30 37 25 33Z" />
            <path d="M75 33C70 37 70 41 75 46C86 41 85 33 75 33Z" />
            <path d="M19 47C9 47 9 55 21 59C26 54 25 50 19 47Z" />
            <path d="M81 47C75 50 74 54 79 59C91 55 91 47 81 47Z" />
            <path d="M31 45C21 44 20 51 31 58C36 53 36 49 31 45Z" />
            <path d="M69 45C64 49 64 53 69 58C80 51 79 44 69 45Z" />
            <path d="M39 34C30 35 30 43 41 49C45 43 44 38 39 34Z" />
            <path d="M61 34C56 38 55 43 59 49C70 43 70 35 61 34Z" />
          </g>
          <g fill={lime}>
            <path d="M43 27C38 32 40 38 47 42C51 36 49 31 43 27Z" />
            <path d="M57 27C51 31 49 36 53 42C60 38 62 32 57 27Z" />
            <path d="M29 39C24 44 27 49 35 52C38 46 35 42 29 39Z" />
            <path d="M71 39C65 42 62 46 65 52C73 49 76 44 71 39Z" />
            <path d="M40 48C34 53 37 59 46 62C49 56 46 51 40 48Z" />
            <path d="M60 48C54 51 51 56 54 62C63 59 66 53 60 48Z" />
          </g>
          <path d="M50 36V66" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
          <path d="M31 61L69 61L60 77L50 85L40 77Z" fill={lime} stroke={leaf} strokeWidth="2" />
          <path d="M38 66H62L57 73H43Z" fill="none" stroke={leaf} strokeWidth="2" />
          <path d="M43 77H57" stroke={leaf} strokeWidth="2" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.2rem] font-semibold tracking-[-0.045em]" style={{ color: ink }}>
            Viruksham <span className="font-normal">Estates</span>
          </span>
          <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.28em]" style={{ color: inverse ? "#b7d96a" : leaf }}>
            Spaces with meaning
          </span>
        </span>
      )}
    </Link>
  );
}
