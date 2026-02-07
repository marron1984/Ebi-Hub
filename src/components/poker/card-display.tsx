"use client";

import type { Card } from "@/types/poker";
import { cn } from "@/lib/utils";

const suitSymbols: Record<string, string> = {
  s: "\u2660",
  h: "\u2665",
  d: "\u2666",
  c: "\u2663",
};

const suitColors: Record<string, string> = {
  s: "text-foreground",
  h: "text-crimson",
  d: "text-crimson",
  c: "text-emerald",
};

export function CardDisplay({
  card,
  size = "md",
}: {
  card: Card;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-6 text-xs",
    md: "h-12 w-9 text-sm",
    lg: "h-16 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-md border bg-white dark:bg-slate-800 font-bold shadow-sm",
        suitColors[card.suit],
        sizeClasses[size]
      )}
    >
      <span className="leading-none">{card.rank}</span>
      <span className="leading-none text-[0.6em]">
        {suitSymbols[card.suit]}
      </span>
    </div>
  );
}

export function CardGroup({
  cards,
  size = "md",
}: {
  cards: Card[];
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="inline-flex gap-1">
      {cards.map((card, i) => (
        <CardDisplay key={`${card.rank}${card.suit}-${i}`} card={card} size={size} />
      ))}
    </div>
  );
}
