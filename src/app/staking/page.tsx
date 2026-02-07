"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockPlayers, mockSessions } from "@/lib/mock-data";
import {
  calculateStakingDistribution,
  calculateTotalProfitJpy,
  formatJpy,
  formatJpyCompact,
  toJpy,
  type StakingMember,
  type StakingResult,
} from "@/lib/currency";
import {
  Users,
  Calculator,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  PieChart,
} from "lucide-react";

const PLAYER_COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const DEFAULT_STAKE_PERCENTS: Record<string, number> = {
  p1: 40,
  p2: 20,
  p3: 20,
  p4: 20,
};

const DEFAULT_MAKEUPS: Record<string, number> = {
  p1: 0,
  p2: 0,
  p3: 48000,
  p4: 0,
};

function buildInitialMembers(): StakingMember[] {
  return mockPlayers.map((player) => ({
    playerId: player.id,
    playerName: player.name,
    stakePercent: DEFAULT_STAKE_PERCENTS[player.id] ?? 25,
    makeup: DEFAULT_MAKEUPS[player.id] ?? 0,
  }));
}

export default function StakingPage() {
  const [members, setMembers] = useState<StakingMember[]>(buildInitialMembers);
  const [results, setResults] = useState<StakingResult[] | null>(null);

  // Convert mock sessions to SessionCurrencyData with profitJpy
  const sessionsWithJpy = mockSessions.map((s) => ({
    profit: s.profit,
    profitJpy: toJpy(s.profit, s.currency),
    currency: s.currency,
  }));

  const totalProfitJpy = calculateTotalProfitJpy(sessionsWithJpy);
  const totalHours = Math.round(
    mockSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60
  );
  const totalStakePercent = members.reduce((sum, m) => sum + m.stakePercent, 0);

  const handleStakeChange = (playerId: string, value: string) => {
    const num = parseFloat(value);
    setMembers((prev) =>
      prev.map((m) =>
        m.playerId === playerId
          ? { ...m, stakePercent: isNaN(num) ? 0 : num }
          : m
      )
    );
    setResults(null);
  };

  const handleMakeupChange = (playerId: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9-]/g, ""), 10);
    setMembers((prev) =>
      prev.map((m) =>
        m.playerId === playerId
          ? { ...m, makeup: isNaN(num) ? 0 : Math.max(0, num) }
          : m
      )
    );
    setResults(null);
  };

  const handleCalculate = () => {
    setResults(calculateStakingDistribution(totalProfitJpy, members));
  };

  const handleReset = () => {
    setMembers(buildInitialMembers());
    setResults(null);
  };

  // Totals for the verification row
  const resultTotals = results
    ? {
        grossShare: results.reduce((s, r) => s + r.grossShare, 0),
        makeupDeduction: results.reduce((s, r) => s + r.makeupDeduction, 0),
        netPayout: results.reduce((s, r) => s + r.netPayout, 0),
        remainingMakeup: results.reduce((s, r) => s + r.remainingMakeup, 0),
      }
    : null;

  // Build pie chart segments (CSS conic-gradient)
  const pieSegments = members.reduce<string[]>((acc, member, i) => {
    const startDeg =
      i === 0
        ? 0
        : members
            .slice(0, i)
            .reduce((s, m) => s + (m.stakePercent / totalStakePercent) * 360, 0);
    const endDeg = startDeg + (member.stakePercent / totalStakePercent) * 360;
    acc.push(`${PLAYER_COLORS[i]} ${startDeg}deg ${endDeg}deg`);
    return acc;
  }, []);

  const conicGradient =
    totalStakePercent > 0
      ? `conic-gradient(${pieSegments.join(", ")})`
      : "conic-gradient(#374151 0deg 360deg)";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          ステーキング・シミュレーター
        </h1>
        <p className="text-sm text-muted-foreground">
          出資比率に応じた利益分配とメイクアップ計算
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* A. Team Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                チーム収支サマリー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    チーム合計収支 (JPY換算)
                  </p>
                  <p
                    className={cn(
                      "font-number text-3xl font-bold tracking-tight",
                      totalProfitJpy >= 0 ? "text-emerald" : "text-crimson"
                    )}
                  >
                    {formatJpy(totalProfitJpy)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatJpyCompact(totalProfitJpy)}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">セッション数</p>
                    <p className="font-number text-lg font-bold">
                      {mockSessions.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">合計プレイ時間</p>
                    <p className="font-number text-lg font-bold">
                      {totalHours}時間
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. Stake Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                出資比率の設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member, i) => {
                  const player = mockPlayers.find(
                    (p) => p.id === member.playerId
                  );
                  return (
                    <div
                      key={member.playerId}
                      className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      style={{
                        borderLeftWidth: "3px",
                        borderLeftColor: PLAYER_COLORS[i],
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: PLAYER_COLORS[i] }}
                        >
                          {member.playerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {member.playerName}
                          </p>
                          {player?.role === "leader" && (
                            <Badge
                              variant="outline"
                              className="mt-0.5 text-[10px]"
                            >
                              リーダー
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            出資比率 (%)
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={member.stakePercent}
                              onChange={(e) =>
                                handleStakeChange(
                                  member.playerId,
                                  e.target.value
                                )
                              }
                              className="font-number w-24 pr-6 text-right"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            メイクアップ (JPY)
                          </Label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              ¥
                            </span>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={
                                member.makeup === 0
                                  ? "0"
                                  : member.makeup.toLocaleString()
                              }
                              onChange={(e) =>
                                handleMakeupChange(
                                  member.playerId,
                                  e.target.value
                                )
                              }
                              className="font-number w-32 pl-6 text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Total & Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      合計出資比率:
                    </span>
                    <span
                      className={cn(
                        "font-number text-sm font-bold",
                        totalStakePercent === 100
                          ? "text-emerald"
                          : "text-crimson"
                      )}
                    >
                      {totalStakePercent}%
                    </span>
                    {totalStakePercent !== 100 && (
                      <Badge variant="destructive" className="text-[10px]">
                        100%にしてください
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      リセット
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCalculate}
                      disabled={totalStakePercent !== 100}
                      className="gap-1"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      計算する
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C. Distribution Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PieChart className="h-4 w-4" />
                  分配結果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Header row */}
                <div className="hidden sm:grid sm:grid-cols-6 sm:gap-2 sm:border-b sm:pb-2 sm:text-xs sm:text-muted-foreground">
                  <span>メンバー</span>
                  <span className="text-right">出資比率</span>
                  <span className="text-right">粗利配分</span>
                  <span className="text-right">メイクアップ控除</span>
                  <span className="text-right">実配当</span>
                  <span className="text-right">残メイクアップ</span>
                </div>

                {/* Result rows */}
                <div className="space-y-1 sm:space-y-0">
                  {results.map((result, i) => (
                    <div
                      key={result.playerId}
                      className={cn(
                        "flex flex-col gap-2 rounded-lg p-3 sm:grid sm:grid-cols-6 sm:items-center sm:gap-2",
                        i % 2 === 0
                          ? "bg-muted/30"
                          : "bg-transparent"
                      )}
                    >
                      {/* Name */}
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: PLAYER_COLORS[i] }}
                        >
                          {result.playerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">
                          {result.playerName}
                        </span>
                      </div>

                      {/* Stake % */}
                      <div className="flex justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          出資比率
                        </span>
                        <span className="font-number text-sm">
                          {result.stakePercent}%
                        </span>
                      </div>

                      {/* Gross share */}
                      <div className="flex justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          粗利配分
                        </span>
                        <span
                          className={cn(
                            "font-number text-sm",
                            result.grossShare >= 0
                              ? "text-foreground"
                              : "text-crimson"
                          )}
                        >
                          {formatJpy(result.grossShare)}
                        </span>
                      </div>

                      {/* Makeup deduction */}
                      <div className="flex justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          メイクアップ控除
                        </span>
                        <span
                          className={cn(
                            "font-number text-sm",
                            result.makeupDeduction > 0
                              ? "text-crimson font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {result.makeupDeduction > 0
                            ? `-¥${result.makeupDeduction.toLocaleString()}`
                            : "-"}
                        </span>
                      </div>

                      {/* Net payout */}
                      <div className="flex justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          実配当
                        </span>
                        <span
                          className={cn(
                            "font-number text-sm font-bold",
                            result.netPayout > 0
                              ? "text-emerald"
                              : result.netPayout < 0
                                ? "text-crimson"
                                : "text-muted-foreground"
                          )}
                        >
                          {result.netPayout === 0
                            ? "¥0"
                            : formatJpy(result.netPayout)}
                        </span>
                      </div>

                      {/* Remaining makeup */}
                      <div className="flex justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          残メイクアップ
                        </span>
                        <span
                          className={cn(
                            "font-number text-sm",
                            result.remainingMakeup > 0
                              ? "text-crimson"
                              : "text-muted-foreground"
                          )}
                        >
                          {result.remainingMakeup > 0
                            ? `¥${result.remainingMakeup.toLocaleString()}`
                            : "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals verification row */}
                {resultTotals && (
                  <div className="mt-2 grid grid-cols-6 items-center gap-2 border-t pt-3 text-sm font-bold">
                    <span>合計</span>
                    <span className="font-number text-right">100%</span>
                    <span
                      className={cn(
                        "font-number text-right",
                        resultTotals.grossShare >= 0
                          ? "text-foreground"
                          : "text-crimson"
                      )}
                    >
                      {formatJpy(resultTotals.grossShare)}
                    </span>
                    <span
                      className={cn(
                        "font-number text-right",
                        resultTotals.makeupDeduction > 0
                          ? "text-crimson"
                          : "text-muted-foreground"
                      )}
                    >
                      {resultTotals.makeupDeduction > 0
                        ? `-¥${resultTotals.makeupDeduction.toLocaleString()}`
                        : "-"}
                    </span>
                    <span
                      className={cn(
                        "font-number text-right",
                        resultTotals.netPayout > 0
                          ? "text-emerald"
                          : resultTotals.netPayout < 0
                            ? "text-crimson"
                            : "text-muted-foreground"
                      )}
                    >
                      {formatJpy(resultTotals.netPayout)}
                    </span>
                    <span
                      className={cn(
                        "font-number text-right",
                        resultTotals.remainingMakeup > 0
                          ? "text-crimson"
                          : "text-muted-foreground"
                      )}
                    >
                      {resultTotals.remainingMakeup > 0
                        ? `¥${resultTotals.remainingMakeup.toLocaleString()}`
                        : "-"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pie Chart Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4" />
                出資比率チャート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div
                  className="h-40 w-40 rounded-full shadow-inner"
                  style={{ background: conicGradient }}
                />
                <div className="space-y-2 text-sm">
                  {members.map((member, i) => (
                    <div
                      key={member.playerId}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: PLAYER_COLORS[i] }}
                      />
                      <span className="text-muted-foreground">
                        {member.playerName}
                      </span>
                      <span className="font-number ml-auto font-medium">
                        {member.stakePercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* D. Makeup Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">メイクアップとは？</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  メイクアップとは、ステーキングにおける「負債の繰り越し」です。
                </p>
                <p>
                  プレイヤーが損失を出した場合、その損失額がメイクアップとして蓄積されます。
                </p>
                <p>
                  次に利益が出た際、まずメイクアップの返済に充てられ、残りが実際の配当となります。
                </p>
                <div className="mt-4 rounded-lg border border-dashed p-3">
                  <p className="text-xs font-medium text-foreground">
                    計算フロー
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald">1.</span>
                      <span>利益 x 出資比率 = 粗利配分</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-crimson">2.</span>
                      <span>粗利配分 - メイクアップ = 実配当</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-amber-500">3.</span>
                      <span>未返済分 = 残メイクアップ</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E. Simulation Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">シミュレーション例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Example 1 */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald/30 bg-emerald/10 text-emerald"
                    >
                      全員プラス
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    合計{" "}
                    <span className="font-number font-medium text-emerald">
                      +¥500,000
                    </span>
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                    <p>
                      40%出資者{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      <span className="font-number text-emerald">+¥200,000</span>
                    </p>
                    <p>
                      20%出資者{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      <span className="font-number text-emerald">+¥100,000</span>{" "}
                      (各)
                    </p>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-amber-500"
                    >
                      メイクアップあり
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    合計{" "}
                    <span className="font-number font-medium text-emerald">
                      +¥300,000
                    </span>
                    、P3にメイクアップ ¥48,000
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                    <p>
                      P3の粗利: ¥60,000{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      控除 ¥48,000{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      <span className="font-number text-emerald">
                        実配当 ¥12,000
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      メイクアップは完済
                    </p>
                  </div>
                </div>

                {/* Example 3 */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-crimson/30 bg-crimson/10 text-crimson"
                    >
                      マイナスの場合
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    合計{" "}
                    <span className="font-number font-medium text-crimson">
                      -¥100,000
                    </span>
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                    <p>
                      配当なし。各メンバーの出資比率分がメイクアップに加算。
                    </p>
                    <p>
                      40%出資者{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      <span className="font-number text-crimson">
                        メイクアップ +¥40,000
                      </span>
                    </p>
                    <p>
                      20%出資者{" "}
                      <ArrowRight className="inline h-3 w-3" />{" "}
                      <span className="font-number text-crimson">
                        メイクアップ +¥20,000
                      </span>{" "}
                      (各)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
