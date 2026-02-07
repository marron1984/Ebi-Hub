"use client";

import {
  DollarSign, Clock, TrendingUp, Trophy, Target, Flame,
  ArrowUpRight, ArrowDownRight, MapPin,
  Play, Square, BookOpen, MessageSquare, Eye,
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
import { mockSessions, mockStats, mockActivities } from "@/lib/mock-data";
import {
  formatJpy,
  calculateTotalProfitJpy,
  POKER_CURRENCIES,
  getCurrencyFlag,
} from "@/lib/currency";
import type { PokerCurrency } from "@/lib/currency";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { GameType, Venue } from "@/types/poker";
import { OSAKA_SPOTS } from "@/lib/poker-spots";

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

      {/* ===== Spot Filter ===== */}
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

      {/* ===== Stats Cards ===== */}
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

      {/* ===== Charts & Session History ===== */}
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

      {/* ===== Breakdown Grid ===== */}
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

      {/* ===== Currency Summary ===== */}
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
      {/* ===== Activity Feed ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">アクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {mockActivities.slice(0, 8).map((activity, i) => {
              const iconMap = {
                session_start: Play,
                session_end: Square,
                hand_review: BookOpen,
                opponent_note: Eye,
                comment: MessageSquare,
              };
              const Icon = iconMap[activity.type];
              const isProfit = activity.metadata?.profitJpy !== undefined && activity.metadata.profitJpy >= 0;
              const isLoss = activity.metadata?.profitJpy !== undefined && activity.metadata.profitJpy < 0;

              // Relative time
              const now = new Date("2025-02-07T18:00:00Z");
              const then = new Date(activity.createdAt);
              const diffMs = now.getTime() - then.getTime();
              const diffMin = Math.floor(diffMs / 60000);
              const diffHr = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHr / 24);
              const timeStr = diffDay > 0 ? `${diffDay}日前` : diffHr > 0 ? `${diffHr}時間前` : `${diffMin}分前`;

              return (
                <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                  <div className="relative mt-0.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: activity.userColor }}
                    >
                      {activity.userInitial}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background",
                      activity.type === "session_start" ? "bg-emerald/20 text-emerald" :
                      activity.type === "session_end" ? (isLoss ? "bg-crimson/20 text-crimson" : "bg-emerald/20 text-emerald") :
                      "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate">{activity.userName.split(" ")[0]}</span>
                      <span className="text-[10px] text-muted-foreground">{activity.title}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{timeStr}</span>
                    </div>
                    {activity.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.detail}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
