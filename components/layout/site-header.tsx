import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          Viruksham Estates
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="flex items-center space-x-6 text-sm font-medium text-stone-600">
            <li>
              <Link href="/" className="transition-colors hover:text-stone-900">
                Home
              </Link>
            </li>
            <li>
              <Link href="/projects" className="transition-colors hover:text-stone-900">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-stone-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/journal" className="transition-colors hover:text-stone-900">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-stone-900">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
