"use client";

import {
  DollarSign, Clock, TrendingUp, Trophy, Target, Flame,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/poker/stats-card";
import { ProfitChart } from "@/components/poker/profit-chart";
import { SessionTable } from "@/components/poker/session-table";
import { PrivacyToggle } from "@/components/poker/privacy-toggle";
import { mockSessions, mockStats } from "@/lib/mock-data";
import {
  formatJpy,
  formatJpyCompact,
  formatDualCurrency,
  calculateTotalProfitJpy,
  POKER_CURRENCIES,
  getCurrencyFlag,
} from "@/lib/currency";
import type { PokerCurrency } from "@/lib/currency";
import { formatDuration } from "@/lib/utils";
import { useState } from "react";
import type { GameType, Venue } from "@/types/poker";

export default function DashboardPage() {
  const [gameFilter, setGameFilter] = useState<GameType | "all">("all");
  const [venueFilter, setVenueFilter] = useState<Venue | "all">("all");
  const [privacy, setPrivacy] = useState(false);

  // ---------- Filtered sessions ----------
  const filteredSessions = mockSessions.filter((s) => {
    if (gameFilter !== "all" && s.gameType !== gameFilter) return false;
    if (venueFilter !== "all" && s.venue !== venueFilter) return false;
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

  // Approximate USD equivalent for sub-display
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
        <div className="flex items-center gap-2">
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

      {/* ===== Venue & Game Breakdown ===== */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">会場別</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} セッション
                      </p>
                    </div>
                    <span
                      className={`font-number text-sm font-bold ${
                        venueProfit >= 0 ? "text-emerald" : "text-crimson"
                      }`}
                    >
                      {formatJpy(venueProfit, privacy)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ゲーム種別</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{game}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} セッション
                      </p>
                    </div>
                    <span
                      className={`font-number text-sm font-bold ${
                        gameProfit >= 0 ? "text-emerald" : "text-crimson"
                      }`}
                    >
                      {formatJpy(gameProfit, privacy)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Currency Summary (通貨別サマリー) ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">通貨別サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currencySummary.map(([currency, data]) => {
              const info = POKER_CURRENCIES[currency as PokerCurrency];
              const flag = getCurrencyFlag(currency as PokerCurrency);
              return (
                <div
                  key={currency}
                  className="flex items-center justify-between rounded-lg border p-3"
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
                      className={`font-number text-sm font-bold ${
                        data.jpyTotal >= 0 ? "text-emerald" : "text-crimson"
                      }`}
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
  );
}
