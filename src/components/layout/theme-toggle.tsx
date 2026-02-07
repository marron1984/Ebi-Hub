"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-16 rounded-full border bg-muted" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "白銀モードへ" : "墨黒モードへ"}
      className={cn(
        "relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full border transition-colors",
        isDark
          ? "border-emerald/30 bg-emerald/10"
          : "border-[#2563EB]/30 bg-[#2563EB]/10",
      )}
    >
      <span
        className={cn(
          "absolute flex h-6 w-6 items-center justify-center rounded-full transition-all",
          isDark
            ? "left-[4px] bg-emerald text-[#020617]"
            : "left-[calc(100%-28px)] bg-[#2563EB] text-white",
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="sr-only">テーマ切替</span>
    </button>
  );
}
