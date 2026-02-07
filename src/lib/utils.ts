import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const prefix = amount >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(amount).toLocaleString()}`;
}

export function formatBB(bb: number): string {
  return `${bb >= 0 ? "+" : ""}${bb.toFixed(1)} BB`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatHourlyRate(totalProfit: number, totalMinutes: number): string {
  if (totalMinutes === 0) return "$0/hr";
  const hourly = (totalProfit / totalMinutes) * 60;
  return `${hourly >= 0 ? "+" : "-"}$${Math.abs(hourly).toFixed(0)}/hr`;
}

export function calculateWinRate(sessions: { profit: number }[]): number {
  if (sessions.length === 0) return 0;
  const wins = sessions.filter((s) => s.profit > 0).length;
  return Math.round((wins / sessions.length) * 100);
}
