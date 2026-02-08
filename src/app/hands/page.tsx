"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardGroup } from "@/components/poker/card-display";
import { HandTimeline } from "@/components/poker/hand-timeline";
import { ThreadedComments } from "@/components/poker/threaded-comments";
import { mockHands } from "@/lib/mock-data";
import { cn, formatResultBB } from "@/lib/utils";
import { Plus, Search, Filter, ChevronRight } from "lucide-react";
import type { HandHistory, HandTag } from "@/types/poker";
import { TAG_LABELS_JA } from "@/types/poker";

const quickTags: HandTag[] = [
  "3BET", "BLUFF", "VALUE_BET", "CHECK_RAISE",
  "TILT_CHECK", "KEY_HAND", "SOLVER_NEEDED", "GTO_DEVIATION", "TEAM_SHARE",
];

export default function HandsPage() {
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);
  const [searchTag, setSearchTag] = useState("");

  const filteredHands = searchTag
    ? mockHands.filter(
        (h) =>
          h.tags.some((t) =>
            t.toLowerCase().includes(searchTag.toLowerCase()) ||
            TAG_LABELS_JA[t].includes(searchTag)
          ) ||
          h.notes.toLowerCase().includes(searchTag.toLowerCase())
      )
    : mockHands;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ハンドレビュー</h1>
          <p className="text-sm text-muted-foreground">
            キーハンドの分析とチームでの議論
          </p>
        </div>
        <Link href="/hands/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            ハンド記録
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="タグやメモで検索..."
            className="pl-9"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Tag Filters (Japanese) */}
      <div className="flex flex-wrap gap-1.5">
        {quickTags.map((tag) => (
          <Badge
            key={tag}
            variant={searchTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSearchTag(searchTag === tag ? "" : tag)}
          >
            #{TAG_LABELS_JA[tag]}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Hand List */}
        <div className="space-y-3 lg:col-span-2">
          {filteredHands.map((hand) => (
            <button
              type="button"
              key={hand.id}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-all hover:border-emerald/30 cursor-pointer",
                selectedHand?.id === hand.id && "border-emerald bg-emerald/5"
              )}
              onClick={() => setSelectedHand(hand)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardGroup cards={hand.heroCards} size="sm" />
                    <Badge variant="outline" className="text-xs">
                      {hand.heroPosition}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(hand.date).toLocaleDateString("ja-JP", {
                        month: "short", day: "numeric",
                      })}
                    </span>
                    <span>{hand.stakes}</span>
                    <span>{hand.gameType}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hand.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                        #{TAG_LABELS_JA[tag]}
                      </Badge>
                    ))}
                    {hand.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{hand.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-number text-sm font-bold", hand.result >= 0 ? "text-emerald" : "text-crimson")}>
                    {formatResultBB(hand.result, hand.stakes)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          ))}

          {filteredHands.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                検索条件に一致するハンドがありません
              </p>
            </div>
          )}
        </div>

        {/* Hand Detail */}
        <div className="lg:col-span-3 space-y-4">
          {selectedHand ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    ハンド詳細 - {new Date(selectedHand.date).toLocaleDateString("ja-JP")} | {selectedHand.stakes} {selectedHand.gameType}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HandTimeline hand={selectedHand} />
                </CardContent>
              </Card>

              {/* Threaded Comments */}
              <Card>
                <CardContent className="pt-6">
                  <ThreadedComments
                    comments={selectedHand.comments}
                    handId={selectedHand.id}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    左のリストからハンドを選択してください
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ストリートごとの詳細とチームの議論が表示されます
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
