import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency } from "@/types/poker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: Currency = "USD",
  privacy: boolean = false
): string {
  if (privacy) return "***";
  const prefix = amount >= 0 ? "+" : "";
  if (currency === "JPY") {
    return `${prefix}\u00A5${Math.abs(amount).toLocaleString()}`;
  }
  return `${prefix}$${Math.abs(amount).toLocaleString()}`;
}

export function formatCurrencyCompact(
  amount: number,
  currency: Currency = "USD"
): string {
  if (currency === "JPY") {
    if (Math.abs(amount) >= 10000) {
      return `\u00A5${(amount / 10000).toFixed(1)}万`;
    }
    return `\u00A5${amount.toLocaleString()}`;
  }
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
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

export function formatHourlyRate(
  totalProfit: number,
  totalMinutes: number,
  currency: Currency = "USD",
  privacy: boolean = false
): string {
  if (privacy) return "***/h";
  if (totalMinutes === 0) return currency === "JPY" ? "\u00A50/h" : "$0/h";
  const hourly = (totalProfit / totalMinutes) * 60;
  const sym = currency === "JPY" ? "\u00A5" : "$";
  return `${hourly >= 0 ? "+" : "-"}${sym}${Math.abs(hourly).toFixed(0)}/h`;
}

export function calculateWinRate(sessions: { profit: number }[]): number {
  if (sessions.length === 0) return 0;
  const wins = sessions.filter((s) => s.profit > 0).length;
  return Math.round((wins / sessions.length) * 100);
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === "JPY" ? "\u00A5" : "$";
}

export function renderMarkdown(text: string): string {
  return text
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
