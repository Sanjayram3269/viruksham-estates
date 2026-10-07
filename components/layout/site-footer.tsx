"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getSnapshot() {
  return new Date().getFullYear();
}

function getServerSnapshot() {
  return 2026;
}

export function SiteFooter() {
  const currentYear = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  return (
    <footer className="border-t border-stone-200 bg-stone-100 text-stone-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div>
          <p className="text-base font-semibold text-stone-900">Viruksham Estates</p>
          <p className="text-sm text-stone-500">Your Trust, Our Commitment</p>
        </div>
        <p className="text-xs text-stone-500">
          &copy; {currentYear} Viruksham Estates. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
