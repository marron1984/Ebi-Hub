"use client";

import {
  DollarSign, Clock, TrendingUp, Trophy, Target, Flame,
  ArrowUpRight, ArrowDownRight, MapPin,
  BookOpen, MessageSquare,
  Radio, Calendar, ChevronRight, Zap, Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/poker/stats-card";
import { ProfitChart } from "@/components/poker/profit-chart";
import { SessionTable } from "@/components/poker/session-table";
import { PrivacyToggle } from "@/components/poker/privacy-toggle";
import { CardGroup } from "@/components/poker/card-display";
import { BroadcastButton } from "@/components/share/broadcast-button";
import {
  mockSessions, mockStats, mockActivities, mockHands,
  mockTournaments, mockDailyEvents,
} from "@/lib/mock-data";
import Link from "next/link";
import {
  formatJpy,
  calculateTotalProfitJpy,
  POKER_CURRENCIES,
  getCurrencyFlag,
} from "@/lib/currency";
import type { PokerCurrency } from "@/lib/currency";
import { formatDuration, formatCurrency, formatResultBB } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import type { GameType, Venue } from "@/types/poker";
import { TAG_LABELS_JA } from "@/types/poker";
import { OSAKA_SPOTS } from "@/lib/poker-spots";
import { calculateCountdown } from "@/lib/intelligence";

export default function DashboardPage() {
  const [gameFilter, setGameFilter] = useState<GameType | "all">("all");
  const [venueFilter, setVenueFilter] = useState<Venue | "all">("all");
  const [spotFilter, setSpotFilter] = useState<string>("all");
  const [privacy, setPrivacy] = useState(false);

  // ---------- Filtered sessions ----------
  const filteredSessions = mockSessions.filter((s) => {
    if (gameFilter !== "all" && s.gameType !== gameFilter) return false;
    if (venueFilter !== "all" && s.venue !== venueFilter) return false;
    if (spotFilter !== "all" && s.spotId !== spotFilter) return false;
    return true;
  });

  // ---------- Aggregation (JPY base) ----------
  const filteredProfitJpy = calculateTotalProfitJpy(filteredSessions);
  const filteredMinutes = filteredSessions.reduce(
    (sum, s) => sum + s.durationMinutes,
    0,
  );
  const filteredHourlyJpy =
    filteredMinutes > 0
      ? Math.round((filteredProfitJpy / filteredMinutes) * 60)
      : 0;
  const filteredWinRate =
    filteredSessions.length > 0
      ? Math.round(
          (filteredSessions.filter((s) => s.profitJpy > 0).length /
            filteredSessions.length) *
            100,
        )
      : 0;

  const approxUsd = Math.round(
    filteredProfitJpy / POKER_CURRENCIES.USD.defaultRate,
  );

  // ---------- Currency summary ----------
  const currencyMap = filteredSessions.reduce<
    Record<string, { originalTotal: number; jpyTotal: number; count: number }>
  >((acc, s) => {
    if (!acc[s.currency]) {
      acc[s.currency] = { originalTotal: 0, jpyTotal: 0, count: 0 };
    }
    acc[s.currency].originalTotal += s.profit;
    acc[s.currency].jpyTotal += s.profitJpy;
    acc[s.currency].count += 1;
    return acc;
  }, {});
  const currencySummary = Object.entries(currencyMap) as [
    string,
    { originalTotal: number; jpyTotal: number; count: number },
  ][];

  // ---------- Spot summary ----------
  const spotMap = filteredSessions.reduce<
    Record<string, { jpyTotal: number; count: number }>
  >((acc, s) => {
    const key = s.spotId || "_other";
    if (!acc[key]) acc[key] = { jpyTotal: 0, count: 0 };
    acc[key].jpyTotal += s.profitJpy;
    acc[key].count += 1;
    return acc;
  }, {});

  // ---------- Tournament data ----------
  const now = useMemo(() => new Date(), []);
  const registrationOpenTournaments = mockTournaments.filter(
    (t) => t.status === "registration_open",
  );
  const upcomingTournaments = mockTournaments.filter(
    (t) => t.status === "upcoming",
  );
  const tournamentCountdowns = useMemo(
    () =>
      upcomingTournaments.map((t) => ({
        tournament: t,
        countdown: calculateCountdown(t.startDate, now),
      })),
    [now],
  );

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ダッシュボード
          </h1>
          <p className="text-sm text-muted-foreground">
            パフォーマンス概要とセッション分析
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PrivacyToggle
            isPrivate={privacy}
            onToggle={() => setPrivacy(!privacy)}
          />
          <Select
            value={gameFilter}
            onValueChange={(v) => setGameFilter(v as GameType | "all")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="ゲーム" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ゲーム</SelectItem>
              <SelectItem value="NLH">NLH</SelectItem>
              <SelectItem value="PLO">PLO</SelectItem>
              <SelectItem value="PLO5">PLO5</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={venueFilter}
            onValueChange={(v) => setVenueFilter(v as Venue | "all")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="会場" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全会場</SelectItem>
              <SelectItem value="live">ライブ</SelectItem>
              <SelectItem value="online">オンライン</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ===== 1. PERSONAL STATS (TOP) ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="累積収支(JPY)"
          value={formatJpy(filteredProfitJpy, privacy)}
          subtitle={
            privacy
              ? `${filteredSessions.length} セッション`
              : `≈ $${Math.abs(approxUsd).toLocaleString()} | ${filteredSessions.length} セッション`
          }
          icon={DollarSign}
          trend={filteredProfitJpy >= 0 ? "up" : "down"}
          accentColor={filteredProfitJpy >= 0 ? "emerald" : "crimson"}
        />
        <StatsCard
          title="時給(JPY)"
          value={
            privacy
              ? "***/h"
              : `${formatJpy(filteredHourlyJpy)}/h`
          }
          subtitle={`${Math.round(filteredMinutes / 60)}時間プレイ`}
          icon={Clock}
          trend={filteredHourlyJpy >= 0 ? "up" : "down"}
          accentColor="gold"
        />
        <StatsCard
          title="勝率"
          value={`${filteredWinRate}%`}
          subtitle={`BB/100: ${mockStats.bbPer100}`}
          icon={Target}
          trend={filteredWinRate >= 50 ? "up" : "down"}
          accentColor="emerald"
        />
        <StatsCard
          title="連勝"
          value={`${mockStats.currentStreak}連勝`}
          subtitle="現在の連勝記録"
          icon={Flame}
          trend="up"
          accentColor="gold"
        />
      </div>

      {/* ===== 2. CHART & SESSION HISTORY ===== */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">
            <TrendingUp className="mr-2 h-4 w-4" />
            収支グラフ
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Trophy className="mr-2 h-4 w-4" />
            セッション履歴
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>累積収支推移 (JPY)</span>
                {!privacy && (
                  <div className="flex gap-4 text-xs font-normal text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald" />
                      最高: {formatJpy(mockStats.bestSessionJpy)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3 text-crimson" />
                      最低: {formatJpy(mockStats.worstSessionJpy)}
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {privacy ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p className="text-sm">
                    プライバシーモード: グラフの推移のみ表示可能
                  </p>
                </div>
              ) : (
                <ProfitChart sessions={filteredSessions} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">セッション履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTable sessions={filteredSessions} privacy={privacy} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== 3. RECENT HAND REVIEWS (Main Feature) ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-emerald" />
            <h2 className="text-lg font-bold tracking-tight">
              最近のハンドレビュー
            </h2>
          </div>
          <Link
            href="/hands"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald transition-colors"
          >
            全ハンド <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {mockHands.slice(0, 3).map((hand) => (
            <Link
              key={hand.id}
              href="/hands"
              className="block rounded-md border p-4 bg-card transition-colors hover:border-emerald/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <CardGroup cards={hand.heroCards} size="sm" />
                    <Badge variant="outline" className="text-xs">
                      {hand.heroPosition}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {hand.stakes} {hand.gameType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(hand.date).toLocaleDateString("ja-JP", {
                        month: "short", day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hand.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                        #{TAG_LABELS_JA[tag]}
                      </Badge>
                    ))}
                  </div>
                  {hand.notes && (
                    <p className="text-xs text-muted-foreground truncate">{hand.notes}</p>
                  )}
                  {hand.comments.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {hand.comments.length}件のコメント
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn("font-number text-base font-bold", hand.result >= 0 ? "text-emerald" : "text-crimson")}>
                    {formatResultBB(hand.result, hand.stakes)}
                  </span>
                  <span className="font-number text-[10px] text-muted-foreground">
                    {formatCurrency(hand.result, hand.currency)}
                  </span>
                  <BroadcastButton
                    type="hand_review"
                    handId={hand.id}
                    handSummary={hand.notes}
                    profitJpy={hand.result * (hand.currency === "JPY" ? 1 : 150)}
                    tags={hand.tags}
                    className="h-7 text-[10px]"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. TWO-COLUMN: Breakdowns + Events ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Breakdowns (2 cols on lg) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Spot Filter */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={spotFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSpotFilter("all")}
            >
              全スポット
            </Badge>
            {OSAKA_SPOTS.map((spot) => (
              <Badge
                key={spot.id}
                variant={spotFilter === spot.id ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSpotFilter(spot.id)}
              >
                <MapPin className="mr-1 h-3 w-3" />
                {spot.shortName}
              </Badge>
            ))}
          </div>

          {/* Breakdown grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Venue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">会場別</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(["live", "online"] as const).map((venue) => {
                    const venueProfit = filteredSessions
                      .filter((s) => s.venue === venue)
                      .reduce((sum, s) => sum + s.profitJpy, 0);
                    const count = filteredSessions.filter(
                      (s) => s.venue === venue,
                    ).length;
                    const label = venue === "live" ? "ライブ" : "オンライン";
                    return (
                      <div
                        key={venue}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {count} セッション
                          </p>
                        </div>
                        <span
                          className={cn(
                            "font-number text-sm font-bold",
                            venueProfit >= 0 ? "text-emerald" : "text-crimson"
                          )}
                        >
                          {formatJpy(venueProfit, privacy)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Game Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ゲーム種別</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(["NLH", "PLO", "PLO5"] as const).map((game) => {
                    const gameProfit = filteredSessions
                      .filter((s) => s.gameType === game)
                      .reduce((sum, s) => sum + s.profitJpy, 0);
                    const count = filteredSessions.filter(
                      (s) => s.gameType === game,
                    ).length;
                    if (count === 0) return null;
                    return (
                      <div
                        key={game}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{game}</p>
                          <p className="text-xs text-muted-foreground">
                            {count} セッション
                          </p>
                        </div>
                        <span
                          className={cn(
                            "font-number text-sm font-bold",
                            gameProfit >= 0 ? "text-emerald" : "text-crimson"
                          )}
                        >
                          {formatJpy(gameProfit, privacy)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Spot Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">スポット別</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(spotMap)
                    .sort(([, a], [, b]) => b.jpyTotal - a.jpyTotal)
                    .map(([key, data]) => {
                      const spot = OSAKA_SPOTS.find((s) => s.id === key);
                      const label = spot ? spot.shortName : "その他";
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">
                              {data.count} セッション
                            </p>
                          </div>
                          <span
                            className={cn(
                              "font-number text-sm font-bold",
                              data.jpyTotal >= 0 ? "text-emerald" : "text-crimson"
                            )}
                          >
                            {formatJpy(data.jpyTotal, privacy)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Currency Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">通貨別サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currencySummary.map(([currency, data]) => {
                  const info = POKER_CURRENCIES[currency as PokerCurrency];
                  const flag = getCurrencyFlag(currency as PokerCurrency);
                  return (
                    <div
                      key={currency}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{flag}</span>
                        <div>
                          <p className="text-sm font-medium">
                            {info.nameJa} ({currency})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {data.count} セッション
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-number text-sm font-bold",
                            data.jpyTotal >= 0 ? "text-emerald" : "text-crimson"
                          )}
                        >
                          {formatJpy(data.jpyTotal, privacy)}
                        </p>
                        {currency !== "JPY" && (
                          <p className="font-number text-xs text-muted-foreground">
                            {privacy
                              ? "***"
                              : `${data.originalTotal >= 0 ? "+" : ""}${info.symbol}${Math.abs(data.originalTotal).toLocaleString()}`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Events Sidebar + Activity (1 col on lg) */}
        <div className="space-y-4">
          {/* Event Intelligence Compact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald" />
                  イベント
                  {registrationOpenTournaments.length > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-emerald/30 bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
                      <Radio className="h-2 w-2 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>
                <Link
                  href="/events"
                  className="flex items-center gap-0.5 text-xs font-normal text-muted-foreground hover:text-emerald transition-colors"
                >
                  詳細 <ChevronRight className="h-3 w-3" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Registration-open tournaments */}
              {registrationOpenTournaments.map((t) => (
                <div
                  key={t.id}
                  className="rounded-md border p-3"
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: t.accentColor,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="h-3 w-3" style={{ color: t.accentColor }} />
                    <span className="text-xs font-bold truncate">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{t.spotName}</span>
                    <span className="font-number">¥{t.buyInJpy.toLocaleString()}</span>
                    {t.guaranteeJpy && (
                      <span className="font-number text-emerald">GTD ¥{t.guaranteeJpy.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Upcoming tournaments compact */}
              {tournamentCountdowns.slice(0, 3).map(({ tournament: t, countdown }) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-md border p-2"
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: t.accentColor,
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.spotName} · ¥{t.buyInJpy.toLocaleString()}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-bold shrink-0 ml-2",
                    countdown.isUrgent ? "text-crimson" : "text-muted-foreground"
                  )}>
                    {countdown.isUrgent ? `あと${countdown.hoursUntil}h` : `あと${countdown.daysUntil}日`}
                  </span>
                </div>
              ))}

              {/* Today's events compact */}
              <div className="border-t pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  本日のイベント
                </p>
                <div className="space-y-1.5">
                  {mockDailyEvents.slice(0, 6).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-2 rounded border p-2"
                    >
                      <span className="font-number text-[10px] font-bold w-10 shrink-0">{e.startTime}</span>
                      <span className="spot-badge">{e.spotName}</span>
                      <span className="text-[10px] truncate flex-1">{e.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald" />
                アクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {mockActivities.slice(0, 6).map((activity) => {

                  const refNow = new Date("2025-02-07T18:00:00Z");
                  const then = new Date(activity.createdAt);
                  const diffMs = refNow.getTime() - then.getTime();
                  const diffMin = Math.floor(diffMs / 60000);
                  const diffHr = Math.floor(diffMin / 60);
                  const diffDay = Math.floor(diffHr / 24);
                  const timeStr = diffDay > 0 ? `${diffDay}日前` : diffHr > 0 ? `${diffHr}時間前` : `${diffMin}分前`;

                  return (
                    <div key={activity.id} className="flex items-start gap-2.5 py-2.5 border-b border-border/50 last:border-0">
                      <div
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                        style={{ backgroundColor: activity.userColor }}
                      >
                        {activity.userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium">{activity.userName}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground">{timeStr}</span>
                        </div>
                        {activity.detail && (
                          <p className="text-[10px] text-muted-foreground truncate">{activity.detail}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
