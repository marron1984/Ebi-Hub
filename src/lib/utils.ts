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

export function formatBB(bb: number): string {
  return `${bb >= 0 ? "+" : ""}${bb.toFixed(1)} BB`;
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
