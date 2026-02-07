"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/poker/stats-card";
import { PrivacyToggle } from "@/components/poker/privacy-toggle";
import { mockPlayers, teamMemberStats, mockOpponentNotes, mockMemberActivity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatJpy } from "@/lib/currency";
import {
  getSpot,
  getMemberStatus,
  OPPONENT_TAG_LABELS,
  OPPONENT_TAG_COLORS,
  OSAKA_SPOTS,
} from "@/lib/poker-spots";
import type { OpponentNote } from "@/lib/poker-spots";
import {
  Users, DollarSign, Clock, Target, TrendingUp, Crown, BarChart3,
  Search, MapPin, AlertTriangle, Eye,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
} from "recharts";

export default function TeamPage() {
  const [showAggregated, setShowAggregated] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(mockPlayers.map((p) => p.id));
  const [opponentSearch, setOpponentSearch] = useState("");
  const [selectedSpotFilter, setSelectedSpotFilter] = useState<string>("all");

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

  const colors = ["#00FF9F", "#F59E0B", "#EF4444", "#8B5CF6"];

  const fmtAxis = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 10000) return `¥${(v / 10000).toFixed(0)}万`;
    return `¥${v.toLocaleString()}`;
  };

  // Filter opponent notes
  const filteredOpponents = mockOpponentNotes.filter((note) => {
    if (selectedSpotFilter !== "all" && note.spotId !== selectedSpotFilter) return false;
    if (opponentSearch) {
      const q = opponentSearch.toLowerCase();
      return (
        note.opponentName.toLowerCase().includes(q) ||
        note.notes.toLowerCase().includes(q) ||
        note.tags.some((t) => OPPONENT_TAG_LABELS[t].toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">チーム</h1>
          <p className="text-sm text-muted-foreground">チームインテリジェンス & パフォーマンス</p>
        </div>
        <div className="flex items-center gap-3">
          <PrivacyToggle isPrivate={privacy} onToggle={() => setPrivacy(!privacy)} />
          <Label htmlFor="aggregate" className="text-sm">合算表示</Label>
          <Switch id="aggregate" checked={showAggregated} onCheckedChange={setShowAggregated} />
        </div>
      </div>

      {/* Member Pulse */}
      <div className="flex flex-wrap gap-3">
        {mockPlayers.map((player, i) => {
          const activity = mockMemberActivity.find((a) => a.playerId === player.id);
          const memberStatus = activity ? getMemberStatus(activity) : null;
          const spot = player.primarySpotId ? getSpot(player.primarySpotId) : undefined;
          const isSelected = selectedMembers.includes(player.id);

          return (
            <Button key={player.id}
              variant={isSelected ? "default" : "outline"} size="sm"
              onClick={() => toggleMember(player.id)}
              className={cn("relative gap-2", isSelected && "border-2")}
              style={isSelected ? { borderColor: colors[i] } : undefined}>
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                activity?.status === "on-fire" && "member-pulse member-pulse-win",
                activity?.status === "cooling-down" && "member-pulse member-pulse-loss",
              )} style={{ backgroundColor: colors[i] }}>
                {player.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {player.role === "leader" && <Crown className="h-3 w-3" />}
                  <span className="text-xs">{player.name.split(" ")[0]}</span>
                </div>
                {memberStatus && (
                  <span className={cn("text-[9px]", memberStatus.color)}>
                    {memberStatus.label}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
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
          <TabsTrigger value="opponents"><Eye className="mr-2 h-4 w-4" />相手メモ</TabsTrigger>
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
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(30,41,59,1)", borderRadius: "6px", color: "#F8FAFC", fontSize: "12px" }}
                        formatter={(value) => [`¥${Number(value).toLocaleString()}`]} />
                      <Legend />
                      {activeMembers.map((p, i) => (
                        <Bar key={p.id} dataKey={p.name} fill={colors[i]} radius={[3, 3, 0, 0]} opacity={0.9} />
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
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(30,41,59,1)", borderRadius: "6px", color: "#F8FAFC", fontSize: "12px" }}
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

        <TabsContent value="opponents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  相手エクスプロイトメモ
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {filteredOpponents.length} 件
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="名前・メモ・タグで検索..."
                    value={opponentSearch}
                    onChange={(e) => setOpponentSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={selectedSpotFilter === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedSpotFilter("all")}
                  >
                    全スポット
                  </Badge>
                  {OSAKA_SPOTS.slice(0, 5).map((spot) => (
                    <Badge
                      key={spot.id}
                      variant={selectedSpotFilter === spot.id ? "default" : "outline"}
                      className="cursor-pointer text-[10px]"
                      onClick={() => setSelectedSpotFilter(spot.id)}
                    >
                      {spot.shortName}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Opponent list */}
              <div className="space-y-2">
                {filteredOpponents.map((note) => {
                  const spot = getSpot(note.spotId);
                  return (
                    <div key={note.id} className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{note.opponentName}</span>
                          {spot && (
                            <span className="spot-badge">
                              <MapPin className="h-2.5 w-2.5" />
                              {spot.shortName}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground font-number">
                            {note.stakes}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          最終: {note.lastSeen}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className={cn("text-[10px]", OPPONENT_TAG_COLORS[tag])}>
                            {OPPONENT_TAG_LABELS[tag]}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {note.notes}
                      </p>
                    </div>
                  );
                })}
                {filteredOpponents.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    該当する相手メモがありません
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Member Stats */}
      <Card>
        <CardHeader><CardTitle className="text-base">メンバー成績</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeMembers.map((player, i) => {
              const stats = teamMemberStats[player.id];
              const activity = mockMemberActivity.find((a) => a.playerId === player.id);
              const spot = player.primarySpotId ? getSpot(player.primarySpotId) : undefined;
              if (!stats) return null;
              return (
                <div key={player.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderLeftWidth: "3px", borderLeftColor: colors[i] }}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                      activity?.status === "on-fire" && "member-pulse member-pulse-win",
                    )} style={{ backgroundColor: colors[i] }}>
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
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {stats.totalSessions} セッション | {stats.totalHours}時間
                        </p>
                        {spot && (
                          <span className="spot-badge">
                            <MapPin className="h-2 w-2" />
                            {spot.shortName}
                          </span>
                        )}
                      </div>
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
