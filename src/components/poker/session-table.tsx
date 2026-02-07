"use client";

import type { Session } from "@/types/poker";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Globe, Building2 } from "lucide-react";
import {
  formatOriginal,
  formatJpy,
  getCurrencyFlag,
  POKER_CURRENCIES,
} from "@/lib/currency";
import { getSpot } from "@/lib/poker-spots";

interface SessionTableProps {
  sessions: Session[];
  privacy?: boolean;
}

export function SessionTable({ sessions, privacy = false }: SessionTableProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedSessions.map((session) => {
        const spot = session.spotId ? getSpot(session.spotId) : undefined;
        return (
          <div
            key={session.id}
            className={cn(
              "rounded-lg border bg-card p-4 transition-colors hover:border-emerald/30",
              session.status === "OPEN" && "border-gold/30"
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Date & Location */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    {new Date(session.sessionDate).toLocaleDateString("ja-JP", {
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
                  <Badge variant="outline" className="text-[10px] gap-1">
                    {getCurrencyFlag(session.currency)} {session.currency}
                  </Badge>
                  {spot && (
                    <span className="spot-badge">
                      {spot.shortName}
                    </span>
                  )}
                  {session.status === "OPEN" && (
                    <Badge variant="outline" className="text-[10px] border-gold/50 text-gold">
                      プレイ中
                    </Badge>
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
                  {session.currency !== "JPY" && (
                    <span className="font-number text-[10px]">
                      (1{POKER_CURRENCIES[session.currency].symbol}=¥{session.exchangeRate})
                    </span>
                  )}
                </div>
              </div>

              {/* Right: P&L */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">バイイン / キャッシュアウト</p>
                  <p className="font-number text-sm">
                    {privacy
                      ? "*** / ***"
                      : `${formatOriginal(session.buyIn, session.currency).replace("+", "")} / ${formatOriginal(session.cashOut, session.currency).replace("+", "")}`}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "min-w-[100px] rounded-md border px-3 py-1.5",
                      session.profit >= 0
                        ? "border-emerald/30 bg-emerald/5 text-emerald"
                        : "border-crimson/30 bg-crimson/5 text-crimson"
                    )}
                  >
                    <p className="font-number text-lg font-bold">
                      {formatOriginal(session.profit, session.currency, privacy)}
                    </p>
                  </div>
                  {session.currency !== "JPY" && !privacy && (
                    <p className="mt-0.5 font-number text-[11px] text-muted-foreground">
                      {formatJpy(session.profitJpy)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {session.notes && (
              <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
                {session.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
