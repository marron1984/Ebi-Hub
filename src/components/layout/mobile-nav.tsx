"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  Users,
  BookOpen,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "戦績", href: "/dashboard", icon: LayoutDashboard },
  { name: "記録", href: "/sessions/new", icon: Plus },
  { name: "HH", href: "/hands", icon: ClipboardList },
  { name: "分配", href: "/staking", icon: Calculator },
  { name: "チーム", href: "/team", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] font-medium transition-colors",
                isActive ? "text-emerald" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
