"use client";

import type { Session } from "@/types/poker";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Globe, Building2 } from "lucide-react";

interface SessionTableProps {
  sessions: Session[];
  privacy?: boolean;
}

export function SessionTable({ sessions, privacy = false }: SessionTableProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedSessions.map((session) => (
        <div
          key={session.id}
          className="glass rounded-lg border p-4 transition-all hover:border-emerald/30"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Date & Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {new Date(session.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Badge variant={session.venue === "live" ? "default" : "secondary"}>
                  {session.venue === "live" ? (
                    <Building2 className="mr-1 h-3 w-3" />
                  ) : (
                    <Globe className="mr-1 h-3 w-3" />
                  )}
                  {session.venue === "live" ? "ライブ" : "オンライン"}
                </Badge>
                <Badge variant="outline">{session.gameType}</Badge>
                {session.currency === "JPY" && (
                  <Badge variant="outline" className="text-[10px]">¥</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {session.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(session.durationMinutes)}
                </span>
                <span className="font-number">{session.stakes}</span>
              </div>
            </div>

            {/* Right: P&L */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">バイイン / キャッシュアウト</p>
                <p className="font-number text-sm">
                  {privacy
                    ? "*** / ***"
                    : `${formatCurrency(session.buyIn, session.currency).replace("+", "")} / ${formatCurrency(session.cashOut, session.currency).replace("+", "")}`}
                </p>
              </div>
              <div
                className={cn(
                  "min-w-[80px] rounded-lg px-3 py-2 text-right",
                  session.profit >= 0
                    ? "bg-emerald/10 text-emerald"
                    : "bg-crimson/10 text-crimson"
                )}
              >
                <p className="font-number text-lg font-bold">
                  {formatCurrency(session.profit, session.currency, privacy)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <p className="mt-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
              {session.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
