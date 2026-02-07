"use client";

import type { HandHistory, Street } from "@/types/poker";
import { TAG_LABELS_JA } from "@/types/poker";
import { CardGroup } from "./card-display";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatCurrency, renderMarkdown } from "@/lib/utils";
import { Brain, MessageSquare } from "lucide-react";
import { BroadcastButton } from "@/components/share/broadcast-button";

const streetLabels: Record<Street, string> = {
  preflop: "1. プリフロップ",
  flop: "2. フロップ",
  turn: "3. ターン",
  river: "4. リバー",
  showdown: "5. ショーダウン",
};

const streetColors: Record<Street, string> = {
  preflop: "bg-emerald",
  flop: "bg-gold",
  turn: "bg-crimson-light",
  river: "bg-purple-500",
  showdown: "bg-[#FF6B35]",
};

const actionColors: Record<string, string> = {
  fold: "text-muted-foreground",
  check: "text-muted-foreground",
  call: "text-gold",
  bet: "text-emerald",
  raise: "text-emerald-light",
  "3bet": "text-crimson-light",
  "4bet": "text-crimson",
  "all-in": "text-crimson font-bold",
};

interface HandTimelineProps {
  hand: HandHistory;
}

export function HandTimeline({ hand }: HandTimelineProps) {
  const sym = hand.currency === "JPY" ? "¥" : "$";

  return (
    <div className="space-y-6">
      {/* Hero Cards */}
      <div className="flex items-center gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            ヒーロー ({hand.heroPosition})
          </p>
          <CardGroup cards={hand.heroCards} size="lg" />
        </div>
        {hand.villainCards && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              ヴィラン
            </p>
            <CardGroup cards={hand.villainCards} size="lg" />
          </div>
        )}
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">結果</p>
          <p
            className={cn(
              "font-number text-2xl font-bold",
              hand.result >= 0 ? "text-emerald" : "text-crimson"
            )}
          >
            {formatCurrency(hand.result, hand.currency)}
          </p>
        </div>
      </div>

      {/* Street Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />

        <div className="space-y-0">
          {hand.streets.map((street) => (
            <div key={street.street} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-2.5 top-5 h-3 w-3 rounded-full ring-4 ring-background",
                  streetColors[street.street]
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value={street.street} className="border-none">
                  <div className="rounded-lg border bg-card p-4 mb-3">
                    {/* Street Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-semibold">
                          {streetLabels[street.street]}
                        </Badge>
                        {street.board.length > 0 && (
                          <CardGroup cards={street.board} size="sm" />
                        )}
                      </div>
                      <span className="font-number text-sm text-muted-foreground">
                        ポット: {sym}{street.potSize}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1.5">
                      {street.actions.map((action, i) => (
                        <div
                          key={`${action.position}-${i}`}
                          className={cn(
                            "flex items-center gap-2 rounded px-2 py-1 text-sm",
                            action.isHero && "bg-emerald/5 border border-emerald/20"
                          )}
                        >
                          <span
                            className={cn(
                              "w-12 font-mono text-xs",
                              action.isHero
                                ? "font-bold text-emerald"
                                : "text-muted-foreground"
                            )}
                          >
                            {action.position}
                          </span>
                          <span
                            className={cn(
                              "capitalize",
                              actionColors[action.action]
                            )}
                          >
                            {action.action}
                          </span>
                          {action.amount && (
                            <span className="font-number text-xs text-muted-foreground">
                              {sym}{action.amount}
                            </span>
                          )}
                          {action.isHero && (
                            <span className="ml-auto text-xs text-emerald">
                              HERO
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Thought Process Toggle */}
                    {street.thoughtProcess && (
                      <AccordionTrigger className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground hover:text-foreground hover:no-underline">
                        <span className="flex items-center gap-1.5">
                          <Brain className="h-3.5 w-3.5" />
                          思考プロセス
                        </span>
                      </AccordionTrigger>
                    )}
                  </div>

                  {street.thoughtProcess && (
                    <AccordionContent>
                      <div className="ml-4 mb-3 rounded-lg border border-emerald/20 bg-emerald/5 p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                          <div
                            className="markdown-content text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(street.thoughtProcess) }}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {hand.tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">タグ</p>
          <div className="flex flex-wrap gap-1.5">
            {hand.tags.map((tag) => {
              const strategyTags = [
                "3BET", "4BET", "C-BET", "C-BET_DEFENSE", "SQUEEZE",
                "BLUFF", "VALUE_BET", "SLOW_PLAY", "CHECK_RAISE",
                "DONK_BET", "FLOAT", "BARREL", "OVERBET", "THIN_VALUE",
              ];
              const mentalTags = [
                "TILT_CHECK", "CONFIDENT", "FOCUSED", "TIRED", "RUSHED", "EMOTIONAL",
              ];

              let variant: "strategy" | "mental" | "review" = "review";
              if (strategyTags.includes(tag)) variant = "strategy";
              else if (mentalTags.includes(tag)) variant = "mental";

              return (
                <Badge key={tag} variant={variant}>
                  #{TAG_LABELS_JA[tag]}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      {hand.notes && (
        <div className="rounded-lg border p-4">
          <p className="mb-1 text-xs font-medium text-muted-foreground">メモ</p>
          <div
            className="markdown-content text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(hand.notes) }}
          />
        </div>
      )}

      {/* Broadcast to Team */}
      <div className="flex items-center justify-end border-t pt-4">
        <BroadcastButton
          type="hand_review"
          handId={hand.id}
          handSummary={hand.notes || `${hand.heroPosition} — ${hand.gameType} ${hand.stakes}`}
          profitJpy={hand.result * (hand.currency === "JPY" ? 1 : 150)}
          tags={hand.tags}
        />
      </div>
    </div>
  );
}
