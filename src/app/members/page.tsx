"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/poker/stats-card";
import { PrivacyToggle } from "@/components/poker/privacy-toggle";
import { mockPlayers, teamMemberStats, mockMemberActivity } from "@/lib/mock-data";
import { getSpot, getMemberStatus } from "@/lib/poker-spots";
import { formatJpy } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { Crown, MapPin, Users, DollarSign, Clock, Target, Shield, User } from "lucide-react";

const MEMBER_COLORS = ["#00FF9F", "#F59E0B", "#EF4444", "#8B5CF6"];

type RoleFilter = "all" | "leader" | "member";

export default function MembersPage() {
  const [privacy, setPrivacy] = useState(false);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const filteredPlayers = mockPlayers.filter((p) => {
    if (roleFilter === "all") return true;
    return p.role === roleFilter;
  });

  // Team summary calculations
  const totalProfitJpy = mockPlayers.reduce(
    (sum, p) => sum + (teamMemberStats[p.id]?.totalProfitJpy ?? 0),
    0
  );
  const totalHours = mockPlayers.reduce(
    (sum, p) => sum + (teamMemberStats[p.id]?.totalHours ?? 0),
    0
  );
  const avgHourlyJpy = totalHours > 0 ? Math.round(totalProfitJpy / totalHours) : 0;
  const avgWinRate =
    mockPlayers.length > 0
      ? Math.round(
          mockPlayers.reduce((sum, p) => sum + (teamMemberStats[p.id]?.winRate ?? 0), 0) /
            mockPlayers.length
        )
      : 0;
  const activeMemberCount = mockMemberActivity.filter(
    (a) => a.status === "on-fire" || a.status === "active"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">メンバー管理</h1>
          <p className="text-sm text-muted-foreground">
            チームメンバーの管理と権限設定
          </p>
        </div>
        <PrivacyToggle isPrivate={privacy} onToggle={() => setPrivacy(!privacy)} />
      </div>

      {/* Team Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="チーム収支(JPY)"
          value={formatJpy(totalProfitJpy, privacy)}
          subtitle={`${mockPlayers.length} 人のメンバー合算`}
          icon={DollarSign}
          trend={totalProfitJpy >= 0 ? "up" : "down"}
          accentColor={totalProfitJpy >= 0 ? "emerald" : "crimson"}
        />
        <StatsCard
          title="平均時給"
          value={privacy ? "***/h" : `${formatJpy(avgHourlyJpy)}/h`}
          subtitle={`合計 ${totalHours}時間`}
          icon={Clock}
          trend={avgHourlyJpy >= 0 ? "up" : "down"}
          accentColor="gold"
        />
        <StatsCard
          title="平均勝率"
          value={`${avgWinRate}%`}
          subtitle="チーム平均"
          icon={Target}
          trend={avgWinRate >= 50 ? "up" : "down"}
          accentColor="emerald"
        />
        <StatsCard
          title="稼働メンバー"
          value={`${activeMemberCount}`}
          subtitle={`全${mockPlayers.length}名中`}
          icon={Users}
          accentColor="default"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">権限フィルター:</span>
        {(
          [
            { key: "all", label: "全員" },
            { key: "leader", label: "Admin" },
            { key: "member", label: "Member" },
          ] as const
        ).map(({ key, label }) => (
          <Badge
            key={key}
            variant={roleFilter === key ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setRoleFilter(key)}
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* Member Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlayers.map((player) => {
          const colorIndex = mockPlayers.findIndex((p) => p.id === player.id);
          const color = MEMBER_COLORS[colorIndex] ?? MEMBER_COLORS[0];
          const stats = teamMemberStats[player.id];
          const activity = mockMemberActivity.find((a) => a.playerId === player.id);
          const memberStatus = activity ? getMemberStatus(activity) : null;
          const spot = player.primarySpotId ? getSpot(player.primarySpotId) : undefined;

          if (!stats) return null;

          const isOnFire = activity?.status === "on-fire";
          const isAdmin = player.role === "leader";

          return (
            <Card key={player.id} className="border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white",
                      isOnFire && "member-pulse member-pulse-win"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {player.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Name + Crown */}
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {player.name}
                      </CardTitle>
                      {isAdmin && (
                        <Crown className="h-4 w-4 shrink-0 text-gold" />
                      )}
                    </div>

                    {/* Role + Status + Spot */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={isAdmin ? "default" : "outline"} className="text-[10px]">
                        {isAdmin ? (
                          <>
                            <Shield className="mr-1 h-2.5 w-2.5" />
                            Admin (リーダー)
                          </>
                        ) : (
                          <>
                            <User className="mr-1 h-2.5 w-2.5" />
                            メンバー
                          </>
                        )}
                      </Badge>

                      {memberStatus && (
                        <Badge variant="outline" className={cn("text-[10px]", memberStatus.color)}>
                          {memberStatus.label}
                        </Badge>
                      )}

                      {spot && (
                        <span className="spot-badge">
                          <MapPin className="h-2.5 w-2.5" />
                          {spot.shortName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">収支(JPY)</p>
                    <p
                      className={cn(
                        "font-number text-sm font-bold",
                        stats.totalProfitJpy >= 0 ? "text-emerald" : "text-crimson"
                      )}
                    >
                      {formatJpy(stats.totalProfitJpy, privacy)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">時給</p>
                    <p className="font-number text-sm font-medium">
                      {privacy
                        ? "***"
                        : `¥${Math.abs(stats.hourlyRateJpy).toLocaleString()}/h`}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">勝率</p>
                    <p className="font-number text-sm font-medium">{stats.winRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">BB/100</p>
                    <p
                      className={cn(
                        "font-number text-sm font-medium",
                        stats.bbPer100 >= 0 ? "text-emerald" : "text-crimson"
                      )}
                    >
                      {stats.bbPer100}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">セッション数</p>
                    <p className="font-number text-sm font-medium">
                      {stats.totalSessions}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">合計時間</p>
                    <p className="font-number text-sm font-medium">
                      {stats.totalHours}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredPlayers.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            該当するメンバーがいません
          </p>
        </div>
      )}
    </div>
  );
}
