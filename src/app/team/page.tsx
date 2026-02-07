"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/poker/stats-card";
import { PrivacyToggle } from "@/components/poker/privacy-toggle";
import { mockPlayers, teamMemberStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatJpy } from "@/lib/currency";
import {
  Users, DollarSign, Clock, Target, TrendingUp, Crown, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
} from "recharts";

export default function TeamPage() {
  const [showAggregated, setShowAggregated] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(mockPlayers.map((p) => p.id));

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const activeMembers = mockPlayers.filter((p) => selectedMembers.includes(p.id));

  const aggregatedProfitJpy = activeMembers.reduce((sum, p) => sum + (teamMemberStats[p.id]?.totalProfitJpy ?? 0), 0);
  const aggregatedHours = activeMembers.reduce((sum, p) => sum + (teamMemberStats[p.id]?.totalHours ?? 0), 0);
  const avgWinRate = activeMembers.length > 0
    ? Math.round(activeMembers.reduce((sum, p) => sum + (teamMemberStats[p.id]?.winRate ?? 0), 0) / activeMembers.length)
    : 0;
  const avgHourlyJpy = aggregatedHours > 0 ? Math.round(aggregatedProfitJpy / aggregatedHours) : 0;

  const months = ["2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02"];
  const monthlyComparisonData = months.map((month) => {
    const entry: Record<string, string | number> = {
      month: month.replace("2024-", "").replace("2025-", ""),
    };
    activeMembers.forEach((p) => {
      const stats = teamMemberStats[p.id];
      const monthData = stats?.monthlyProfitJpy.find((m) => m.month === month);
      entry[p.name] = monthData?.profitJpy ?? 0;
    });
    if (showAggregated) {
      entry["チーム合計"] = activeMembers.reduce((sum, p) => {
        const stats = teamMemberStats[p.id];
        const monthData = stats?.monthlyProfitJpy.find((m) => m.month === month);
        return sum + (monthData?.profitJpy ?? 0);
      }, 0);
    }
    return entry;
  });

  const colors = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const fmtAxis = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 10000) return `¥${(v / 10000).toFixed(0)}万`;
    return `¥${v.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">チーム</h1>
          <p className="text-sm text-muted-foreground">チームパフォーマンスとメンバー比較</p>
        </div>
        <div className="flex items-center gap-3">
          <PrivacyToggle isPrivate={privacy} onToggle={() => setPrivacy(!privacy)} />
          <Label htmlFor="aggregate" className="text-sm">合算表示</Label>
          <Switch id="aggregate" checked={showAggregated} onCheckedChange={setShowAggregated} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {mockPlayers.map((player, i) => (
          <Button key={player.id}
            variant={selectedMembers.includes(player.id) ? "default" : "outline"} size="sm"
            onClick={() => toggleMember(player.id)}
            className={cn(selectedMembers.includes(player.id) && "border-2")}
            style={selectedMembers.includes(player.id) ? { borderColor: colors[i] } : undefined}>
            {player.role === "leader" && <Crown className="mr-1 h-3 w-3" />}
            {player.name}
          </Button>
        ))}
      </div>

      {showAggregated && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="チーム収支(JPY)" value={formatJpy(aggregatedProfitJpy, privacy)}
            subtitle={`${activeMembers.length} 人のメンバー`} icon={DollarSign}
            trend={aggregatedProfitJpy >= 0 ? "up" : "down"}
            accentColor={aggregatedProfitJpy >= 0 ? "emerald" : "crimson"} />
          <StatsCard title="平均時給(JPY)"
            value={privacy ? "***/h" : `${formatJpy(avgHourlyJpy)}/h`}
            subtitle={`合計 ${aggregatedHours}時間`} icon={Clock}
            trend={avgHourlyJpy >= 0 ? "up" : "down"} accentColor="gold" />
          <StatsCard title="平均勝率" value={`${avgWinRate}%`} subtitle="チーム平均"
            icon={Target} trend={avgWinRate >= 50 ? "up" : "down"} accentColor="emerald" />
          <StatsCard title="メンバー" value={`${activeMembers.length}`}
            subtitle={`全${mockPlayers.length}名中`} icon={Users} accentColor="default" />
        </div>
      )}

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison"><BarChart3 className="mr-2 h-4 w-4" />月別比較</TabsTrigger>
          <TabsTrigger value="trend"><TrendingUp className="mr-2 h-4 w-4" />推移</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card>
            <CardHeader><CardTitle className="text-base">月別収支比較 (JPY)</CardTitle></CardHeader>
            <CardContent>
              <div className={privacy ? "privacy-blur" : ""}>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={11} />
                      <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickFormatter={fmtAxis} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.95)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: "8px", color: "#F8FAFC", fontSize: "12px" }}
                        formatter={(value) => [`¥${Number(value).toLocaleString()}`]} />
                      <Legend />
                      {activeMembers.map((p, i) => (
                        <Bar key={p.id} dataKey={p.name} fill={colors[i]} radius={[4, 4, 0, 0]} opacity={0.8} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader><CardTitle className="text-base">累積収支推移 (JPY)</CardTitle></CardHeader>
            <CardContent>
              <div className={privacy ? "privacy-blur" : ""}>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={11} />
                      <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickFormatter={fmtAxis} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.95)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: "8px", color: "#F8FAFC", fontSize: "12px" }}
                        formatter={(value) => [`¥${Number(value).toLocaleString()}`]} />
                      <Legend />
                      {activeMembers.map((p, i) => (
                        <Line key={p.id} type="monotone" dataKey={p.name} stroke={colors[i]} strokeWidth={2} dot={{ r: 4 }} />
                      ))}
                      {showAggregated && (
                        <Line type="monotone" dataKey="チーム合計" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader><CardTitle className="text-base">メンバー成績</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeMembers.map((player, i) => {
              const stats = teamMemberStats[player.id];
              if (!stats) return null;
              return (
                <div key={player.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderLeftWidth: "3px", borderLeftColor: colors[i] }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: colors[i] }}>
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{player.name}</p>
                        {player.role === "leader" && (
                          <Badge variant="outline" className="text-[10px]">
                            <Crown className="mr-1 h-2.5 w-2.5" />リーダー
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalSessions} セッション | {stats.totalHours}時間
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">収支(JPY)</p>
                      <p className={cn("font-number font-bold", stats.totalProfitJpy >= 0 ? "text-emerald" : "text-crimson")}>
                        {formatJpy(stats.totalProfitJpy, privacy)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">時給</p>
                      <p className="font-number font-medium">
                        {privacy ? "***" : `¥${Math.abs(stats.hourlyRateJpy).toLocaleString()}/h`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">勝率</p>
                      <p className="font-number font-medium">{stats.winRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">BB/100</p>
                      <p className={cn("font-number font-medium", stats.bbPer100 >= 0 ? "text-emerald" : "text-crimson")}>
                        {stats.bbPer100}
                      </p>
                    </div>
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
