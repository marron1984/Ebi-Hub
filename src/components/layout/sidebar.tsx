"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  Users,
  Spade,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "セッション記録", href: "/sessions/new", icon: Plus },
  { name: "ハンドレビュー", href: "/hands", icon: ClipboardList },
  { name: "レンジ表", href: "/ranges", icon: BookOpen },
  { name: "チーム", href: "/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald text-white">
          <Spade className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">POKER TEAM HUB</h1>
          <p className="text-[10px] text-muted-foreground">戦略家の書斎</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald/10 text-emerald"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/20 text-sm font-bold text-emerald">
              武
            </div>
            <div>
              <p className="text-sm font-medium">武 (Takeshi)</p>
              <p className="text-xs text-muted-foreground">リーダー</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
