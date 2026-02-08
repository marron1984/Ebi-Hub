"use client";

import { cn } from "@/lib/utils";
import type { RangeChart, RangeAction, RangeActionPure, MixedStrategy } from "@/types/poker";

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

// パッキリ high-contrast action colors (hex for gradient use)
const ACTION_HEX: Record<RangeActionPure, string> = {
  raise: "#00CC7F",
  call: "#F59E0B",
  "3bet": "#DC2626",
  fold: "transparent",
};

const ACTION_CSS: Record<RangeActionPure, string> = {
  raise: "bg-emerald/70 text-white",
  call: "bg-gold/70 text-white",
  "3bet": "bg-crimson/70 text-white",
  fold: "bg-transparent text-muted-foreground",
};

/** Check if a RangeAction is a mixed strategy object */
function isMixed(action: RangeAction): action is MixedStrategy {
  return typeof action === "object";
}

/** Build a CSS linear-gradient for a mixed strategy cell */
function buildMixedGradient(mix: MixedStrategy): string {
  const entries = Object.entries(mix)
    .filter(([, pct]) => pct && pct > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)) as [RangeActionPure, number][];

  if (entries.length === 0) return "transparent";
  if (entries.length === 1) return ACTION_HEX[entries[0][0]];

  // Build gradient stops
  const stops: string[] = [];
  let cursor = 0;
  for (const [action, pct] of entries) {
    const color = ACTION_HEX[action];
    stops.push(`${color} ${cursor}%`);
    cursor += pct;
    stops.push(`${color} ${cursor}%`);
  }

  return `linear-gradient(135deg, ${stops.join(", ")})`;
}

/** Get tooltip text for any action */
function getTooltip(combo: string, action: RangeAction): string {
  if (!isMixed(action)) return `${combo}: ${action}`;
  const parts = Object.entries(action)
    .filter(([, pct]) => pct && pct > 0)
    .map(([a, pct]) => `${a.toUpperCase()} ${pct}%`);
  return `${combo}: ${parts.join(" / ")}`;
}

interface RangeGridProps {
  range: RangeChart;
  compact?: boolean;
}

export function RangeGrid({ range, compact = false }: RangeGridProps) {
  const cellSize = compact ? "h-5 w-5 text-[7px]" : "h-8 w-8 text-[9px]";

  return (
    <div
      className="inline-grid gap-px"
      style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}
    >
      {RANKS.map((r1, i) =>
        RANKS.map((r2, j) => {
          const combo =
            i < j ? `${r1}${r2}s` : i > j ? `${r2}${r1}o` : `${r1}${r2}`;
          const action = range.grid[combo] || "fold";
          const mixed = isMixed(action);
          const label = compact ? "" : combo.length <= 3 ? combo : combo.slice(0, 2);

          if (mixed) {
            return (
              <div
                key={combo}
                className={cn(
                  "flex items-center justify-center rounded-sm font-mono leading-none text-white",
                  cellSize,
                )}
                style={{ background: buildMixedGradient(action) }}
                title={getTooltip(combo, action)}
              >
                {label}
              </div>
            );
          }

          return (
            <div
              key={combo}
              className={cn(
                "flex items-center justify-center rounded-sm font-mono leading-none",
                cellSize,
                ACTION_CSS[action as RangeActionPure],
              )}
              title={getTooltip(combo, action)}
            >
              {label}
            </div>
          );
        }),
      )}
    </div>
  );
}

export function RangeGridLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      <span className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-sm bg-emerald/70" />
        レイズ
      </span>
      <span className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-sm bg-gold/70" />
        コール
      </span>
      <span className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-sm bg-crimson/70" />
        3ベット
      </span>
      <span className="flex items-center gap-1">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ background: "linear-gradient(135deg, #00CC7F 0%, #00CC7F 50%, #F59E0B 50%, #F59E0B 100%)" }}
        />
        ミックス
      </span>
      <span className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-sm border bg-transparent" />
        フォールド
      </span>
    </div>
  );
}
