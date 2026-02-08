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
  Calendar,
  Wallet,
  Crosshair,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { NotificationCenter } from "@/components/share/notification-center";

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "イベント", href: "/events", icon: Calendar },
  { name: "セッション記録", href: "/sessions/new", icon: Plus },
  { name: "ハンドレビュー", href: "/hands", icon: ClipboardList },
  { name: "レンジ表", href: "/ranges", icon: BookOpen },
  { name: "対戦相手DB", href: "/intelligence", icon: Crosshair },
  { name: "資産管理", href: "/assets", icon: Wallet },
  { name: "メンバー", href: "/members", icon: Users },
  { name: "設定", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
            <Spade className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Ebi-Hub</h1>
            <p className="text-[10px] text-muted-foreground">Poker Team OS</p>
          </div>
        </div>
        <NotificationCenter />
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
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald/10 text-emerald border border-emerald/20"
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald/30 text-sm font-bold text-emerald">
              お
            </div>
            <div>
              <p className="text-sm font-medium">おにく</p>
              <p className="text-xs text-muted-foreground">リーダー</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
