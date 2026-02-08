"use client";

import { Spade } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { NotificationCenter } from "@/components/share/notification-center";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b mobile-nav-blur safe-area-top md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
            <Spade className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Ebi-Hub</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
