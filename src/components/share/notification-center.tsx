"use client";

import { useState } from "react";
import { Bell, Send, BookOpen, Eye, MessageSquare, Play, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockActivities, type MockActivity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<MockActivity["type"], typeof Bell> = {
  session_start: Play,
  session_end: Square,
  hand_review: BookOpen,
  opponent_note: Eye,
  comment: MessageSquare,
};

function timeAgo(dateStr: string): string {
  const ref = new Date("2025-02-07T18:00:00Z");
  const then = new Date(dateStr);
  const diffMin = Math.floor((ref.getTime() - then.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}時間前`;
  return `${Math.floor(diffHr / 24)}日前`;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const unreadCount = 3; // Mock unread count

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-crimson text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald" />
                <span className="text-sm font-bold">通知センター</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {mockActivities.slice(0, 6).map((activity, i) => {
                const Icon = ICON_MAP[activity.type];
                const isUnread = i < unreadCount;
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0",
                      isUnread && "bg-emerald/[0.03]",
                    )}
                  >
                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: activity.userColor }}
                    >
                      {activity.userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-medium">{activity.userName}</span>
                        {isUnread && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{activity.title}</p>
                      {activity.detail && (
                        <p className="mt-0.5 truncate text-[11px]">{activity.detail}</p>
                      )}
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t px-4 py-2">
              <button
                className="w-full text-center text-[11px] font-medium text-emerald hover:underline"
                onClick={() => setOpen(false)}
              >
                すべての通知を見る
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
