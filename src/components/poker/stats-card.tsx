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

const accentStyles = {
  emerald: "from-emerald/20 to-emerald/5 border-emerald/20",
  crimson: "from-crimson/20 to-crimson/5 border-crimson/20",
  gold: "from-gold/20 to-gold/5 border-gold/20",
  default: "from-primary/10 to-primary/5 border-border",
};

const iconBgStyles = {
  emerald: "bg-emerald/20 text-emerald",
  crimson: "bg-crimson/20 text-crimson",
  gold: "bg-gold/20 text-gold",
  default: "bg-primary/20 text-primary",
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
        "glass rounded-xl border p-5 bg-gradient-to-br transition-all hover:scale-[1.02]",
        accentStyles[accentColor]
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
        <div className={cn("rounded-lg p-2.5", iconBgStyles[accentColor])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
