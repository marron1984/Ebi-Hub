"use client";

import { Spade } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
          <Spade className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">Ebi-Hub</h1>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
