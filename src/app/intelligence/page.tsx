"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockOpponentNotes } from "@/lib/mock-data";
import {
  getSpot,
  OPPONENT_TAG_LABELS,
  OPPONENT_TAG_COLORS,
  OSAKA_SPOTS,
} from "@/lib/poker-spots";
import type { OpponentNote } from "@/lib/poker-spots";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Star, Eye, ChevronRight,
  Clock, TrendingUp, TrendingDown, Minus,
  Crosshair, User,
} from "lucide-react";

function SkillStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= rating ? "fill-gold text-gold" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function ResultIcon({ result }: { result: "win" | "loss" | "neutral" }) {
  if (result === "win") return <TrendingUp className="h-3.5 w-3.5 text-emerald" />;
  if (result === "loss") return <TrendingDown className="h-3.5 w-3.5 text-crimson" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export default function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [spotFilter, setSpotFilter] = useState("all");
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentNote | null>(
    mockOpponentNotes[0] ?? null,
  );

  const filtered = mockOpponentNotes.filter((note) => {
    if (spotFilter !== "all" && note.spotId !== spotFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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
      {/* Header — 指名手配 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-crimson/10">
          <Crosshair className="h-5 w-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">対戦相手データベース</h1>
          <p className="text-sm text-muted-foreground">
            指名手配リスト — チームの知見を共有
          </p>
        </div>
        <Badge variant="outline" className="ml-auto font-number text-xs">
          {mockOpponentNotes.length} 件登録
        </Badge>
      </div>

      {/* Search + Spot Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="名前・メモ・タグで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={spotFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSpotFilter("all")}
          >
            全スポット
          </Badge>
          {OSAKA_SPOTS.filter((s) => s.category !== "online").slice(0, 6).map((spot) => (
            <Badge
              key={spot.id}
              variant={spotFilter === spot.id ? "default" : "outline"}
              className="cursor-pointer text-[10px]"
              onClick={() => setSpotFilter(spot.id)}
            >
              {spot.shortName}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Wanted List */}
        <div className="space-y-2 lg:col-span-2">
          {filtered.map((note) => {
            const spot = getSpot(note.spotId);
            const isSelected = selectedOpponent?.id === note.id;
            const wins = note.encounters.filter((e) => e.result === "win").length;
            const losses = note.encounters.filter((e) => e.result === "loss").length;

            return (
              <button
                type="button"
                key={note.id}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-crimson bg-crimson/5"
                    : "hover:border-crimson/30",
                )}
                onClick={() => setSelectedOpponent(note)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar — wanted poster style */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-crimson/30 bg-crimson/10 text-lg font-bold text-crimson">
                    {note.opponentName.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {note.opponentName}
                      </span>
                      <SkillStars rating={note.skillRating} />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={cn("text-[10px]", OPPONENT_TAG_COLORS[tag])}
                        >
                          {OPPONENT_TAG_LABELS[tag]}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      {spot && (
                        <span className="inline-flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {spot.shortName}
                        </span>
                      )}
                      <span className="font-number">{note.stakes}</span>
                      <span className="inline-flex items-center gap-0.5 text-emerald">
                        W{wins}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-crimson">
                        L{losses}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                該当する対戦相手がいません
              </p>
            </div>
          )}
        </div>

        {/* Right: Detail — Wanted Poster */}
        <div className="space-y-4 lg:col-span-3">
          {selectedOpponent ? (
            <>
              {/* Profile Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {/* Big wanted avatar */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-crimson/40 bg-crimson/10 text-3xl font-bold text-crimson">
                      {selectedOpponent.opponentName.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">
                          {selectedOpponent.opponentName}
                        </CardTitle>
                        <SkillStars rating={selectedOpponent.skillRating} />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedOpponent.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn("text-[10px]", OPPONENT_TAG_COLORS[tag])}
                          >
                            #{OPPONENT_TAG_LABELS[tag]}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {getSpot(selectedOpponent.spotId) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {getSpot(selectedOpponent.spotId)!.name}
                          </span>
                        )}
                        <span className="font-number">
                          {selectedOpponent.stakes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          最終: {selectedOpponent.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Strategy Notes */}
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      戦略メモ
                    </p>
                    <p className="text-sm leading-relaxed">
                      {selectedOpponent.notes}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Physical Description */}
                    {selectedOpponent.physicalDescription && (
                      <div className="rounded-lg border p-4 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          身体的特徴
                        </p>
                        <p className="text-sm leading-relaxed">
                          {selectedOpponent.physicalDescription}
                        </p>
                      </div>
                    )}

                    {/* Bet Sizing */}
                    {selectedOpponent.betSizingNotes && (
                      <div className="rounded-lg border p-4 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          ベットサイズ傾向
                        </p>
                        <p className="text-sm leading-relaxed">
                          {selectedOpponent.betSizingNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Encounter Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    同卓ログ
                    <Badge variant="secondary" className="font-number text-[10px]">
                      {selectedOpponent.encounters.length} 件
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOpponent.encounters.length > 0 ? (
                    <div className="space-y-0">
                      {selectedOpponent.encounters.map((enc, i) => {
                        const encSpot = getSpot(enc.spotId);
                        return (
                          <div
                            key={`${enc.date}-${i}`}
                            className={cn(
                              "flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0",
                            )}
                          >
                            <ResultIcon result={enc.result} />
                            <span className="font-number text-xs text-muted-foreground w-20 shrink-0">
                              {enc.date}
                            </span>
                            {encSpot && (
                              <span className="spot-badge shrink-0">
                                <MapPin className="h-2 w-2" />
                                {encSpot.shortName}
                              </span>
                            )}
                            <span className="font-number text-[10px] text-muted-foreground shrink-0">
                              {enc.stakes}
                            </span>
                            {enc.note && (
                              <span className="text-xs text-muted-foreground truncate">
                                {enc.note}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      まだ同卓記録がありません
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <Crosshair className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    左のリストから対戦相手を選択してください
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
