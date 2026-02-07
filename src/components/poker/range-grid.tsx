"use client";

import { cn } from "@/lib/utils";
import type { RangeChart } from "@/types/poker";

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const actionColors: Record<string, string> = {
  raise: "bg-emerald/70 text-white",
  call: "bg-gold/70 text-white",
  fold: "bg-transparent text-muted-foreground",
  "3bet": "bg-crimson/70 text-white",
  mixed: "bg-purple-500/70 text-white",
};

interface RangeGridProps {
  range: RangeChart;
  compact?: boolean;
}

export function RangeGrid({ range, compact = false }: RangeGridProps) {
  const cellSize = compact ? "h-5 w-5 text-[7px]" : "h-8 w-8 text-[9px]";

  return (
    <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}>
      {RANKS.map((r1, i) =>
        RANKS.map((r2, j) => {
          const combo =
            i < j ? `${r1}${r2}s` : i > j ? `${r2}${r1}o` : `${r1}${r2}`;
          const action = range.grid[combo] || "fold";
          return (
            <div
              key={combo}
              className={cn(
                "flex items-center justify-center rounded-sm font-mono leading-none",
                cellSize,
                actionColors[action]
              )}
              title={`${combo}: ${action}`}
            >
              {compact ? "" : combo.length <= 3 ? combo : combo.slice(0, 2)}
            </div>
          );
        })
      )}
    </div>
  );
}

export function RangeGridLegend() {
  return (
    <div className="flex gap-3 text-xs">
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
        <div className="h-3 w-3 rounded-sm bg-purple-500/70" />
        ミックス
      </span>
      <span className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-sm border bg-transparent" />
        フォールド
      </span>
    </div>
  );
}
