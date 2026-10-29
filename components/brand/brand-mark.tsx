import Link from "next/link";

type BrandMarkProps = {
  inverse?: boolean;
  compact?: boolean;
  href?: string;
};

export function BrandMark({ inverse = false, compact = false, href = "/" }: BrandMarkProps) {
  const ink = inverse ? "#f7f3ec" : "#182f24";
  const accent = "#b94c3a";

  return (
    <Link href={href} aria-label="Viruksham Estates home" className="group inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <svg viewBox="0 0 48 48" role="img" aria-label="Viruksham architectural monogram" className="h-full w-full overflow-visible">
          <path d="M7 40V8H19V18H29V8H41V40H29V30H19V40Z" fill="none" stroke={ink} strokeWidth="1.5" />
          <path d="M7 8L24 18L41 8M7 40L24 30L41 40" fill="none" stroke={accent} strokeWidth="1.5" />
          <path d="M24 18V30" stroke={ink} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill={accent} />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.2rem] font-semibold tracking-[-0.045em]" style={{ color: ink }}>
            Viruksham <span className="font-normal">Estates</span>
          </span>
          <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>
            Spaces with meaning
          </span>
        </span>
      )}
    </Link>
  );
}
