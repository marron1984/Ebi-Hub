"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardGroup } from "@/components/poker/card-display";
import { HandTimeline } from "@/components/poker/hand-timeline";
import { mockHands } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { Plus, Search, Filter, ChevronRight } from "lucide-react";
import type { HandHistory } from "@/types/poker";

export default function HandsPage() {
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);
  const [searchTag, setSearchTag] = useState("");

  const filteredHands = searchTag
    ? mockHands.filter(
        (h) =>
          h.tags.some((t) =>
            t.toLowerCase().includes(searchTag.toLowerCase())
          ) ||
          h.notes.toLowerCase().includes(searchTag.toLowerCase())
      )
    : mockHands;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hand Review</h1>
          <p className="text-sm text-muted-foreground">
            Analyze and review your key hands
          </p>
        </div>
        <Link href="/hands/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Hand
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tag or notes..."
            className="pl-9"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Tag Filters */}
      <div className="flex flex-wrap gap-1.5">
        {[
          "3BET",
          "BLUFF",
          "VALUE_BET",
          "CHECK_RAISE",
          "TILT_CHECK",
          "KEY_HAND",
          "SOLVER_NEEDED",
          "TEAM_SHARE",
        ].map((tag) => (
          <Badge
            key={tag}
            variant={searchTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSearchTag(searchTag === tag ? "" : tag)}
          >
            #{tag}
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
                selectedHand?.id === hand.id &&
                  "border-emerald bg-emerald/5"
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
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>{hand.stakes}</span>
                    <span>{hand.gameType}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hand.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        #{tag}
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
                  <span
                    className={cn(
                      "font-number text-sm font-bold",
                      hand.result >= 0 ? "text-emerald" : "text-crimson"
                    )}
                  >
                    {formatCurrency(hand.result)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          ))}

          {filteredHands.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No hands match your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Hand Detail */}
        <div className="lg:col-span-3">
          {selectedHand ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Hand Detail -{" "}
                  {new Date(selectedHand.date).toLocaleDateString("ja-JP")} |{" "}
                  {selectedHand.stakes} {selectedHand.gameType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HandTimeline hand={selectedHand} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a hand from the list to view details
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click on any hand to see the street-by-street breakdown
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
