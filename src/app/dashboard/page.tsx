"use client";

import {
  DollarSign,
  Clock,
  TrendingUp,
  Trophy,
  Target,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/poker/stats-card";
import { ProfitChart } from "@/components/poker/profit-chart";
import { SessionTable } from "@/components/poker/session-table";
import { mockSessions, mockStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import type { GameType, Venue } from "@/types/poker";

export default function DashboardPage() {
  const [gameFilter, setGameFilter] = useState<GameType | "all">("all");
  const [venueFilter, setVenueFilter] = useState<Venue | "all">("all");

  const filteredSessions = mockSessions.filter((s) => {
    if (gameFilter !== "all" && s.gameType !== gameFilter) return false;
    if (venueFilter !== "all" && s.venue !== venueFilter) return false;
    return true;
  });

  const filteredProfit = filteredSessions.reduce((sum, s) => sum + s.profit, 0);
  const filteredMinutes = filteredSessions.reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );
  const filteredHourly =
    filteredMinutes > 0
      ? Math.round((filteredProfit / filteredMinutes) * 60)
      : 0;
  const filteredWinRate =
    filteredSessions.length > 0
      ? Math.round(
          (filteredSessions.filter((s) => s.profit > 0).length /
            filteredSessions.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Performance overview and session analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={gameFilter}
            onValueChange={(v) => setGameFilter(v as GameType | "all")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
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
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Profit"
          value={formatCurrency(filteredProfit)}
          subtitle={`${filteredSessions.length} sessions`}
          icon={DollarSign}
          trend={filteredProfit >= 0 ? "up" : "down"}
          accentColor={filteredProfit >= 0 ? "emerald" : "crimson"}
        />
        <StatsCard
          title="Hourly Rate"
          value={`${filteredHourly >= 0 ? "+" : ""}$${Math.abs(filteredHourly)}/hr`}
          subtitle={`${Math.round(filteredMinutes / 60)}h played`}
          icon={Clock}
          trend={filteredHourly >= 0 ? "up" : "down"}
          accentColor="gold"
        />
        <StatsCard
          title="Win Rate"
          value={`${filteredWinRate}%`}
          subtitle={`BB/100: ${mockStats.bbPer100}`}
          icon={Target}
          trend={filteredWinRate >= 50 ? "up" : "down"}
          accentColor="emerald"
        />
        <StatsCard
          title="Streak"
          value={`${mockStats.currentStreak}W`}
          subtitle="Current winning streak"
          icon={Flame}
          trend="up"
          accentColor="gold"
        />
      </div>

      {/* Charts & Session History */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">
            <TrendingUp className="mr-2 h-4 w-4" />
            Profit Chart
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Trophy className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Cumulative Profit</span>
                <div className="flex gap-4 text-xs font-normal text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald" />
                    Best: {formatCurrency(mockStats.bestSession)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3 text-crimson" />
                    Worst: {formatCurrency(mockStats.worstSession)}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfitChart sessions={filteredSessions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTable sessions={filteredSessions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Venue & Game Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Venue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(["live", "online"] as const).map((venue) => {
                const profit = mockStats.profitByVenue[venue];
                const count = mockSessions.filter(
                  (s) => s.venue === venue
                ).length;
                return (
                  <div
                    key={venue}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">{venue}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} sessions
                      </p>
                    </div>
                    <span
                      className={`font-number text-sm font-bold ${
                        profit >= 0 ? "text-emerald" : "text-crimson"
                      }`}
                    >
                      {formatCurrency(profit)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Game Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(["NLH", "PLO"] as const).map((game) => {
                const profit = mockStats.profitByGameType[game];
                const count = mockSessions.filter(
                  (s) => s.gameType === game
                ).length;
                return (
                  <div
                    key={game}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{game}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} sessions
                      </p>
                    </div>
                    <span
                      className={`font-number text-sm font-bold ${
                        profit >= 0 ? "text-emerald" : "text-crimson"
                      }`}
                    >
                      {formatCurrency(profit)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
