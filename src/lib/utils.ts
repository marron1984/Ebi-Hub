import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PokerCurrency } from "@/lib/currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** @deprecated Use formatOriginal / formatJpy / formatDualCurrency from lib/currency */
export function formatCurrency(
  amount: number,
  currency: PokerCurrency = "USD",
  privacy: boolean = false
): string {
  if (privacy) return "***";
  const prefix = amount >= 0 ? "+" : "";
  const symbols: Record<string, string> = {
    JPY: "¥", USD: "$", PHP: "₱", KRW: "₩", EUR: "€",
  };
  const sym = symbols[currency] ?? "$";
  return `${prefix}${sym}${Math.abs(amount).toLocaleString()}`;
}

/** Parse big blind value from stakes string like "1/2" → 2, "100/200" → 200 */
export function parseBBFromStakes(stakes: string): number {
  const parts = stakes.split("/");
  return parseFloat(parts[parts.length - 1]) || 1;
}

/** Convert a raw amount to BB count */
export function amountToBB(amount: number, stakes: string): number {
  const bb = parseBBFromStakes(stakes);
  return amount / bb;
}

/** Format a number as BB string: "+3.0BB" */
export function formatBB(bb: number): string {
  return `${bb >= 0 ? "+" : ""}${bb.toFixed(1)}BB`;
}

/** Convert amount to BB and format: amountToBBStr(6, "1/2") → "3.0BB" */
export function amountToBBStr(amount: number, stakes: string): string {
  return `${amountToBB(amount, stakes).toFixed(1)}BB`;
}

/** Format result as signed BB string: "+12.5BB" or "-3.0BB" */
export function formatResultBB(amount: number, stakes: string): string {
  const bb = amountToBB(amount, stakes);
  return formatBB(bb);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}分`;
  return `${hours}時間${mins > 0 ? `${mins}分` : ""}`;
}

export function calculateWinRate(sessions: { profit: number }[]): number {
  if (sessions.length === 0) return 0;
  const wins = sessions.filter((s) => s.profit > 0).length;
  return Math.round((wins / sessions.length) * 100);
}

export function renderMarkdown(text: string): string {
  return text
    // LaTeX inline math: $...$  → rendered with class for styling
    .replace(/\$\$(.+?)\$\$/g, '<div class="math-block">$1</div>')
    .replace(/\$(.+?)\$/g, '<span class="math-inline">$1</span>')
    // Images: ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />')
    // Standard markdown
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br />");
}
