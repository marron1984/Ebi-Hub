"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Trophy, Calendar, MapPin, Clock, Zap, Users,
  DollarSign, ChevronRight, Radio, Star,
} from "lucide-react";
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
  OTHER: "#8B5CF6",
};

const SERIES_LABELS: Record<string, string> = {
  KOPT: "KOPT",
  TPC: "TPC",
  JAPAN_GOLD_DRAGON: "JGD",
  OSL: "OSL",
  OTHER: "OTHER",
};

// ===== Event type config =====
const EVENT_TYPE_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  tournament: { label: "トーナメント", className: "bg-emerald/20 text-emerald" },
  cash_game: { label: "キャッシュ", className: "bg-gold/20 text-gold" },
  freeroll: { label: "フリーロール", className: "bg-emerald/10 text-emerald" },
  league: { label: "リーグ", className: "bg-purple-500/20 text-purple-400" },
  special: { label: "スペシャル", className: "bg-crimson/20 text-crimson" },
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

function extractTime(datetimeStr: string): string {
  const parts = datetimeStr.split("T");
  if (parts.length === 2) {
    return parts[1].slice(0, 5);
  }
  return datetimeStr;
}

// ===== Component =====
export default function EventsPage() {
  const [spotFilter, setSpotFilter] = useState<string>("all");

  const hasLive = mockTournaments.some(
    (t) => t.status === "registration_open",
  );

  // --- Filtered data ---
  const filteredDailyEvents = mockDailyEvents.filter(
    (e) => spotFilter === "all" || e.spotId === spotFilter,
  );

  const filteredTournaments = mockTournaments
    .filter((t) => spotFilter === "all" || t.spotId === spotFilter)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#020617]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ===== Header ===== */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7 text-[#2563EB] dark:text-[#00FF9F]" />
            <h1 className="text-2xl font-bold tracking-tight">
              イベント・コマンドセンター
            </h1>
            {hasLive && (
              <Badge
                variant="outline"
                className="ml-2 gap-1.5 border-emerald/40 text-emerald"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                LIVE
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            大阪ポーカースポットのイベント情報を集約
          </p>
        </div>

        {/* ===== Spot Filter ===== */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSpotFilter("all")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
              spotFilter === "all"
                ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-[#00FF9F] dark:bg-[#00FF9F]/10 dark:text-[#00FF9F]"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
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
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <MapPin className="h-3 w-3" />
              {spot.shortName}
            </button>
          ))}
        </div>

        {/* ===== Tabs ===== */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              本日のイベント
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              大会スケジュール
            </TabsTrigger>
          </TabsList>

          {/* ===== Tab 1: Daily Events ===== */}
          <TabsContent value="daily">
            {filteredDailyEvents.length === 0 ? (
              <Card className="border bg-card">
                <CardContent className="py-12 text-center text-muted-foreground">
                  該当するイベントがありません
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredDailyEvents.map((event) => (
                  <DailyEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== Tab 2: Tournament Schedule ===== */}
          <TabsContent value="tournaments">
            {filteredTournaments.length === 0 ? (
              <Card className="border bg-card">
                <CardContent className="py-12 text-center text-muted-foreground">
                  該当する大会がありません
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ===== Daily Event Card =====
function DailyEventCard({ event }: { event: MockDailyEvent }) {
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType] ?? {
    label: event.eventType,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="border rounded-md bg-white dark:bg-[#0B1120]">
      <CardContent className="p-4">
        {/* Top row: spot + type badges */}
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            <MapPin className="h-3 w-3" />
            {event.spotName}
          </Badge>
          <Badge
            className={cn(
              "border-transparent text-xs",
              typeConfig.className,
            )}
          >
            {typeConfig.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-bold leading-tight">{event.title}</h3>

        {/* Time */}
        <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {event.startTime} ~ {event.endTime ?? "終了未定"}
          </span>
        </div>

        {/* Buy-in */}
        {event.buyInJpy !== undefined && event.buyInJpy > 0 && (
          <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            <span>{formatYen(event.buyInJpy)}</span>
          </div>
        )}

        {/* Detail */}
        {event.detail && (
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {event.detail}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Tournament Card =====
function TournamentCard({ tournament }: { tournament: MockTournament }) {
  const isOpen = tournament.status === "registration_open";
  const seriesColor = SERIES_COLORS[tournament.series] ?? SERIES_COLORS.OTHER;

  const dateLabel = tournament.endDate
    ? `${formatDateJP(tournament.startDate)} ~ ${formatDateJP(tournament.endDate)}`
    : formatDateJP(tournament.startDate);

  return (
    <Card
      className={cn(
        "border rounded-md bg-white dark:bg-[#0B1120] border-l-[3px] overflow-hidden",
        isOpen && "animate-pulse-border",
      )}
      style={{
        borderLeftColor: tournament.accentColor,
        ...(isOpen
          ? { borderColor: `${tournament.accentColor}66` }
          : {}),
      }}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Row 1: Name + Live badge */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight">
              {tournament.name}
            </h3>
            {isOpen && (
              <Badge
                variant="outline"
                className="gap-1.5 border-red-500/40 text-red-500 shrink-0"
              >
                <Radio className="h-3 w-3 animate-pulse" />
                レジスト受付中
              </Badge>
            )}
          </div>

          {/* Row 2: Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className="border-transparent text-xs font-bold"
              style={{
                backgroundColor: `${seriesColor}20`,
                color: seriesColor,
              }}
            >
              <Star className="mr-1 h-3 w-3" />
              {SERIES_LABELS[tournament.series] ?? tournament.series}
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {tournament.spotName}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              {FORMAT_LABELS[tournament.format] ?? tournament.format}
            </Badge>
          </div>

          {/* Row 3: Details grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{dateLabel}</span>
            </div>

            {/* Registration deadline */}
            {tournament.registrationEnd && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  レジスト締切: {extractTime(tournament.registrationEnd)}
                </span>
              </div>
            )}

            {/* Buy-in + Guarantee */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span>
                {formatYen(tournament.buyInJpy)}
                {tournament.guaranteeJpy && (
                  <> / GTD {formatYen(tournament.guaranteeJpy)}</>
                )}
              </span>
            </div>

            {/* Player count placeholder */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>{tournament.gameType}</span>
            </div>
          </div>

          {/* Row 4: Notes */}
          {tournament.notes && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tournament.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
