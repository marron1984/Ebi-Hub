"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accentColor?: "emerald" | "crimson" | "gold" | "default";
}

const borderStyles = {
  emerald: "border-emerald/40",
  crimson: "border-crimson/40",
  gold: "border-gold/40",
  default: "border-border",
};

const iconBgStyles = {
  emerald: "bg-emerald/10 text-emerald",
  crimson: "bg-crimson/10 text-crimson",
  gold: "bg-gold/10 text-gold",
  default: "bg-primary/10 text-primary",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 transition-colors",
        borderStyles[accentColor]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p
            className={cn(
              "font-number text-2xl font-bold tracking-tight",
              trend === "up" && "text-emerald",
              trend === "down" && "text-crimson"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-md p-2.5", iconBgStyles[accentColor])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
