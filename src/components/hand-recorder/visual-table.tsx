"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Position, Action } from "@/types/poker";

// 6-max table positions arranged as an oval
const TABLE_POSITIONS: { pos: Position; x: number; y: number; label: string }[] = [
  { pos: "SB",    x: 25, y: 82, label: "SB" },
  { pos: "BB",    x: 10, y: 50, label: "BB" },
  { pos: "UTG",   x: 25, y: 18, label: "UTG" },
  { pos: "HJ",    x: 55, y: 10, label: "HJ" },
  { pos: "CO",    x: 80, y: 25, label: "CO" },
  { pos: "BTN",   x: 85, y: 65, label: "BTN" },
];

const FULL_TABLE_POSITIONS: { pos: Position; x: number; y: number; label: string }[] = [
  { pos: "SB",     x: 20, y: 85, label: "SB" },
  { pos: "BB",     x: 5,  y: 60, label: "BB" },
  { pos: "UTG",    x: 8,  y: 35, label: "UTG" },
  { pos: "UTG+1",  x: 22, y: 12, label: "UTG1" },
  { pos: "MP",     x: 42, y: 5,  label: "MP" },
  { pos: "MP+1",   x: 60, y: 8,  label: "MP1" },
  { pos: "HJ",     x: 78, y: 18, label: "HJ" },
  { pos: "CO",     x: 90, y: 38, label: "CO" },
  { pos: "BTN",    x: 88, y: 65, label: "BTN" },
];

const QUICK_ACTIONS: { action: Action; label: string; color: string }[] = [
  { action: "fold",   label: "FOLD",  color: "text-muted-foreground" },
  { action: "check",  label: "CHECK", color: "text-muted-foreground" },
  { action: "call",   label: "CALL",  color: "text-gold" },
  { action: "bet",    label: "BET",   color: "text-emerald" },
  { action: "raise",  label: "RAISE", color: "text-emerald" },
  { action: "3bet",   label: "3BET",  color: "text-crimson-light" },
  { action: "all-in", label: "ALL-IN", color: "text-crimson font-bold" },
];

export interface TableAction {
  position: Position;
  action: Action;
  amount?: number;
  isHero: boolean;
}

interface VisualTableProps {
  heroPosition: Position;
  actions: TableAction[];
  onAddAction: (action: TableAction) => void;
  onRemoveAction: (index: number) => void;
  potBB: number;
  fullTable?: boolean;
}

export function VisualTable({
  heroPosition,
  actions,
  onAddAction,
  onRemoveAction,
  potBB,
  fullTable = false,
}: VisualTableProps) {
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [betAmount, setBetAmount] = useState("");

  const positions = fullTable ? FULL_TABLE_POSITIONS : TABLE_POSITIONS;

  // Get the latest action for each position
  const positionActions = useMemo(() => {
    const map = new Map<Position, TableAction>();
    for (const a of actions) {
      map.set(a.position, a);
    }
    return map;
  }, [actions]);

  const handleAction = (action: Action) => {
    if (!activePosition) return;
    const amount = betAmount ? parseFloat(betAmount) : undefined;
    onAddAction({
      position: activePosition,
      action,
      amount: (action === "bet" || action === "raise" || action === "3bet" || action === "all-in")
        ? amount
        : action === "call"
        ? amount
        : undefined,
      isHero: activePosition === heroPosition,
    });
    setActivePosition(null);
    setBetAmount("");
  };

  return (
    <div className="space-y-3">
      {/* Pot Display */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">POT</span>
        <span className="font-number text-lg font-bold text-primary">
          {potBB.toFixed(1)}BB
        </span>
      </div>

      {/* Table SVG */}
      <div className="relative mx-auto aspect-[16/10] max-w-md">
        {/* Table felt */}
        <div className="absolute inset-[10%] rounded-[50%] border-2 border-primary/20 bg-primary/5" />

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50 font-medium">
            TAP POSITION
          </span>
        </div>

        {/* Position nodes */}
        {positions.map(({ pos, x, y, label }) => {
          const isHero = pos === heroPosition;
          const lastAction = positionActions.get(pos);
          const isActive = activePosition === pos;

          return (
            <button
              key={pos}
              type="button"
              onClick={() => setActivePosition(isActive ? null : pos)}
              className={cn(
                "absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Seat circle */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all",
                  isHero
                    ? "border-primary bg-primary/20 text-primary"
                    : isActive
                    ? "border-gold bg-gold/20 text-gold scale-110"
                    : lastAction
                    ? "border-muted-foreground/50 bg-card text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50",
                )}
              >
                {label}
              </div>

              {/* Action badge */}
              {lastAction && (
                <Badge
                  variant="outline"
                  className={cn(
                    "h-4 px-1 text-[8px] leading-none",
                    lastAction.action === "fold" && "text-muted-foreground",
                    lastAction.action === "call" && "text-gold border-gold/30",
                    (lastAction.action === "bet" || lastAction.action === "raise") && "text-emerald border-emerald/30",
                    (lastAction.action === "3bet" || lastAction.action === "4bet") && "text-crimson border-crimson/30",
                    lastAction.action === "all-in" && "text-crimson border-crimson/30 font-bold",
                  )}
                >
                  {lastAction.action.toUpperCase()}
                  {lastAction.amount ? ` ${lastAction.amount}` : ""}
                </Badge>
              )}

              {/* Hero indicator */}
              {isHero && (
                <span className="text-[8px] font-bold text-primary">HERO</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Picker (when a position is tapped) */}
      {activePosition && (
        <div className="rounded-lg border bg-card p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">
              {activePosition}
              {activePosition === heroPosition && (
                <span className="ml-1 text-primary">(HERO)</span>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => setActivePosition(null)}
            >
              閉じる
            </Button>
          </div>

          {/* BB Amount input */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.5"
              placeholder="BB"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="h-8 w-24 font-number text-sm"
            />
            <span className="text-xs text-muted-foreground">BB</span>
            {/* Quick size presets */}
            {[2.5, 3, 6, 10].map((bb) => (
              <button
                key={bb}
                type="button"
                onClick={() => setBetAmount(String(bb))}
                className="h-7 rounded border px-2 text-xs font-number hover:bg-accent cursor-pointer"
              >
                {bb}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map(({ action, label, color }) => (
              <button
                key={action}
                type="button"
                onClick={() => handleAction(action)}
                className={cn(
                  "rounded border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors hover:bg-accent",
                  color,
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Log */}
      {actions.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            アクションログ
          </p>
          <div className="flex flex-wrap gap-1">
            {actions.map((a, i) => (
              <button
                key={`${a.position}-${a.action}-${i}`}
                type="button"
                onClick={() => onRemoveAction(i)}
                className={cn(
                  "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] cursor-pointer hover:border-crimson/50",
                  a.isHero && "border-primary/30 bg-primary/5",
                )}
                title="クリックで削除"
              >
                <span className="font-mono font-semibold">{a.position}</span>
                <span className={cn(
                  a.action === "fold" && "text-muted-foreground",
                  a.action === "call" && "text-gold",
                  (a.action === "bet" || a.action === "raise") && "text-emerald",
                  (a.action === "3bet" || a.action === "4bet") && "text-crimson",
                  a.action === "all-in" && "text-crimson font-bold",
                )}>
                  {a.action}
                </span>
                {a.amount && (
                  <span className="font-number text-muted-foreground">
                    {a.amount}bb
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
