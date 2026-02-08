"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenLine,
  Plus,
  Crosshair,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "ホーム", href: "/dashboard", icon: LayoutDashboard },
  { name: "ハンド", href: "/hands", icon: PenLine },
  { name: "記録", href: "/hands/new", icon: Plus, center: true },
  { name: "対戦", href: "/intelligence", icon: Crosshair },
  { name: "設定", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t mobile-nav-blur safe-area-bottom md:hidden">
      <div className="flex items-end justify-around px-2 pt-1 pb-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.center) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-0.5 -mt-3"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-100",
                    isActive
                      ? "border-emerald bg-emerald text-primary-foreground scale-105"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    isActive ? "text-emerald" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-100",
                isActive
                  ? "text-emerald"
                  : "text-muted-foreground active:bg-accent"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
