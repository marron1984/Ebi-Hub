"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Trophy, MapPin, Clock, Star, Radio,
  Plane, ChevronRight,
} from "lucide-react";
import { calculateCountdown } from "@/lib/intelligence";
import {
  mockTournaments, mockDailyEvents,
  type MockTournament, type MockDailyEvent,
} from "@/lib/mock-data";
import { OSAKA_SPOTS } from "@/lib/poker-spots";

// ===== Series color mapping =====
const SERIES_COLORS: Record<string, string> = {
  KOPT: "#FFD700",
  TPC: "#2563EB",
  JAPAN_GOLD_DRAGON: "#DC2626",
  OSL: "#00FF9F",
  JOPT: "#FF6B35",
  OTHER: "#8B5CF6",
};

const SERIES_LABELS: Record<string, string> = {
  KOPT: "KOPT",
  TPC: "TPC",
  JAPAN_GOLD_DRAGON: "JGD",
  OSL: "OSL",
  JOPT: "JOPT",
  OTHER: "OTHER",
};

// ===== Event type config =====
const EVENT_TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  tournament: { label: "トーナメント", className: "bg-emerald/15 text-emerald border-emerald/30" },
  cash_game: { label: "キャッシュ", className: "bg-gold/15 text-gold border-gold/30" },
  freeroll: { label: "フリーロール", className: "bg-emerald/10 text-emerald border-emerald/20" },
  league: { label: "リーグ", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  special: { label: "スペシャル", className: "bg-crimson/15 text-crimson border-crimson/30" },
};

// ===== Format labels =====
const FORMAT_LABELS: Record<string, string> = {
  "re-entry": "リエントリー",
  freezeout: "フリーズアウト",
  bounty: "バウンティ",
  satellite: "サテライト",
  deepstack: "ディープスタック",
};

// ===== Helpers =====
function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
}

function formatYen(amount: number): string {
  return `\u00A5${amount.toLocaleString()}`;
}

function formatGuarantee(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)}M`;
  }
  if (amount >= 10_000) {
    return `${(amount / 10_000).toFixed(0)}万`;
  }
  return amount.toLocaleString();
}

function getCurrentDateJP(): string {
  const now = new Date();
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const day = days[now.getDay()];
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${d}日 (${day}) ${h}:${min}`;
}

// ===== Status logic for daily events =====
function getEventStatus(
  startTime: string,
  endTime?: string
): { label: string; color: string } {
  const now = 18 * 60; // 18:00 in minutes
  const [sh, sm] = startTime.split(":").map(Number);
  const startMin = sh * 60 + sm;

  if (endTime) {
    const [eh, em] = endTime.split(":").map(Number);
    let endMin = eh * 60 + em;
    if (endMin < startMin) endMin += 24 * 60; // Handle overnight

    if (now >= startMin && now < endMin)
      return { label: "開催中", color: "text-emerald" };
  }

  if (startMin > now && startMin - now <= 60)
    return { label: "まもなく", color: "text-gold" };
  if (startMin > now) return { label: "予定", color: "text-muted-foreground" };
  return { label: "終了", color: "text-muted-foreground" };
}

// ===== Countdown label =====
function getCountdownLabel(startDate: string): string {
  const countdown = calculateCountdown(startDate);
  return countdown.label;
}

// ===== Component =====
export default function EventsPage() {
  const [spotFilter, setSpotFilter] = useState<string>("all");

  const hasLive = mockTournaments.some(
    (t) => t.status === "registration_open" || t.status === "running"
  );

  // --- Filtered data ---
  const filteredDailyEvents = mockDailyEvents
    .filter((e) => spotFilter === "all" || e.spotId === spotFilter)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const filteredTournaments = mockTournaments
    .filter((t) => spotFilter === "all" || t.spotId === spotFilter)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#020617]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ===== Airport Board Header ===== */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-[#2563EB] dark:text-[#FFD700]" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  大阪ポーカー掲示板
                </h1>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Osaka Poker Intelligence Board
                </p>
              </div>
              {hasLive && (
                <span className="ml-2 inline-flex items-center gap-1.5 rounded border border-emerald/40 px-2 py-0.5 text-xs font-bold text-emerald">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                  </span>
                  LIVE
                </span>
              )}
            </div>
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <span className="font-number">{getCurrentDateJP()}</span>
            </div>
          </div>
        </header>

        {/* ===== Spot Filter ===== */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSpotFilter("all")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
              spotFilter === "all"
                ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-[#00FF9F] dark:bg-[#00FF9F]/10 dark:text-[#00FF9F]"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin className="h-3 w-3" />
            全スポット
          </button>
          {OSAKA_SPOTS.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setSpotFilter(spot.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                spotFilter === spot.id
                  ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-[#00FF9F] dark:bg-[#00FF9F]/10 dark:text-[#00FF9F]"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <MapPin className="h-3 w-3" />
              {spot.shortName}
            </button>
          ))}
        </div>

        {/* ===== Major Tournaments Section ===== */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#FFD700]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              大型大会スケジュール
            </h2>
            <span className="text-xs text-muted-foreground">
              Major Tournaments
            </span>
          </div>

          {filteredTournaments.length === 0 ? (
            <div className="rounded border border-border bg-white p-8 text-center text-sm text-muted-foreground dark:bg-[#0B1120]">
              該当する大会がありません
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTournaments.map((tournament) => (
                <TournamentRow
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===== Today's Board Section ===== */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Plane className="h-4 w-4 text-[#2563EB] dark:text-[#00FF9F]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              本日の運行状況
            </h2>
            <span className="text-xs text-muted-foreground">
              {"Today's Schedule"}
            </span>
          </div>

          {filteredDailyEvents.length === 0 ? (
            <div className="rounded border border-border bg-white p-8 text-center text-sm text-muted-foreground dark:bg-[#0B1120]">
              該当するイベントがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table header */}
              <div className="hidden border-b border-border bg-[#E2E8F0] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:bg-[#0F172A] sm:grid sm:grid-cols-[70px_64px_1fr_100px_80px_72px]">
                <div>TIME</div>
                <div>SPOT</div>
                <div>EVENT</div>
                <div>TYPE</div>
                <div className="text-right">BUY-IN</div>
                <div className="text-right">STATUS</div>
              </div>

              {/* Table rows */}
              {filteredDailyEvents.map((event, idx) => (
                <DailyEventRow key={event.id} event={event} idx={idx} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ===== Tournament Row (Departure board card) =====
function TournamentRow({ tournament }: { tournament: MockTournament }) {
  const isOpen = tournament.status === "registration_open";
  const isRunning = tournament.status === "running";
  const seriesColor =
    SERIES_COLORS[tournament.series] ?? SERIES_COLORS.OTHER;
  const countdownLabel = getCountdownLabel(tournament.startDate);

  const dateLabel = tournament.endDate
    ? `${formatDateJP(tournament.startDate)} ~ ${formatDateJP(tournament.endDate)}`
    : formatDateJP(tournament.startDate);

  return (
    <div
      className={cn(
        "relative rounded border border-border bg-white dark:bg-[#0B1120]",
        "border-l-[4px] overflow-hidden transition-colors",
        isOpen && "animate-pulse-border"
      )}
      style={{
        borderLeftColor: tournament.accentColor,
        ...(isOpen
          ? {
              borderColor: `${tournament.accentColor}44`,
              borderLeftColor: tournament.accentColor,
            }
          : {}),
      }}
    >
      <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
        {/* Left: Countdown chip */}
        <div className="flex shrink-0 items-center gap-3">
          <span
            className="inline-flex min-w-[72px] items-center justify-center rounded border px-2 py-1 text-xs font-bold font-number"
            style={{
              borderColor: `${seriesColor}44`,
              color: seriesColor,
              backgroundColor: `${seriesColor}10`,
            }}
          >
            {countdownLabel}
          </span>

          {/* Series badge */}
          <span
            className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-bold"
            style={{
              borderColor: `${seriesColor}44`,
              color: seriesColor,
              backgroundColor: `${seriesColor}10`,
            }}
          >
            <Star className="h-3 w-3" />
            {SERIES_LABELS[tournament.series] ?? tournament.series}
          </span>
        </div>

        {/* Center: name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold leading-tight truncate">
              {tournament.name}
            </h3>
            {(isOpen || isRunning) && (
              <span className="inline-flex items-center gap-1 rounded border border-emerald/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                {isOpen ? "レジスト受付中" : "開催中"}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {tournament.spotName}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {dateLabel}
            </span>
            <span className="text-muted-foreground">
              {FORMAT_LABELS[tournament.format] ?? tournament.format}
            </span>
          </div>
        </div>

        {/* Right: buy-in + guarantee */}
        <div className="flex shrink-0 items-center gap-4 text-right text-xs">
          <div>
            <div className="font-number font-bold">
              {formatYen(tournament.buyInJpy)}
            </div>
            {tournament.guaranteeJpy && (
              <div className="text-muted-foreground">
                GTD{" "}
                <span className="font-number font-semibold text-foreground">
                  {formatGuarantee(tournament.guaranteeJpy)}
                </span>
              </div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Notes bar */}
      {tournament.notes && (
        <div className="border-t border-border bg-[#F8FAFC] px-4 py-1.5 text-[11px] text-muted-foreground dark:bg-[#0F172A]">
          {tournament.notes}
        </div>
      )}
    </div>
  );
}

// ===== Daily Event Row (Flight departure board row) =====
function DailyEventRow({
  event,
  idx,
}: {
  event: MockDailyEvent;
  idx: number;
}) {
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType] ?? {
    label: event.eventType,
    className: "bg-muted text-muted-foreground border-border",
  };
  const status = getEventStatus(event.startTime, event.endTime);
  const isEven = idx % 2 === 0;

  return (
    <div
      className={cn(
        "border-b border-border px-3 py-2.5 transition-colors",
        isEven
          ? "bg-white dark:bg-[#0B1120]"
          : "bg-[#F8FAFC] dark:bg-[#0F172A]",
        status.label === "開催中" && "bg-emerald/[0.03] dark:bg-emerald/[0.03]"
      )}
    >
      {/* Mobile layout */}
      <div className="flex items-center gap-3 sm:hidden">
        <div className="shrink-0">
          <span className="font-number text-sm font-bold">
            {event.startTime}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold",
                typeConfig.className
              )}
            >
              {typeConfig.label}
            </span>
            <span className="inline-flex rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              {event.spotName}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs font-semibold">
            {event.title}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {event.buyInJpy !== undefined && event.buyInJpy > 0 && (
              <span className="font-number">{formatYen(event.buyInJpy)}</span>
            )}
            {event.buyInJpy === 0 && <span>FREE</span>}
            <span className={cn("font-bold", status.color)}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop layout (table row) */}
      <div className="hidden sm:grid sm:grid-cols-[70px_64px_1fr_100px_80px_72px] sm:items-center">
        {/* TIME */}
        <div className="font-number text-sm font-bold">
          {event.startTime}
        </div>

        {/* SPOT */}
        <div>
          <span className="inline-flex rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            {event.spotName}
          </span>
        </div>

        {/* EVENT */}
        <div className="truncate pr-2 text-xs font-semibold">
          {event.title}
        </div>

        {/* TYPE */}
        <div>
          <span
            className={cn(
              "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold",
              typeConfig.className
            )}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* BUY-IN */}
        <div className="text-right font-number text-xs font-semibold">
          {event.buyInJpy !== undefined && event.buyInJpy > 0
            ? formatYen(event.buyInJpy)
            : event.buyInJpy === 0
              ? "FREE"
              : "-"}
        </div>

        {/* STATUS */}
        <div className={cn("text-right text-xs font-bold", status.color)}>
          {status.label === "開催中" && (
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
          )}
          {status.label}
        </div>
      </div>
    </div>
  );
}
