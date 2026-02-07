"use client";

import { cn } from "@/lib/utils";
import {
  Clock,
  Play,
  Square,
  BookOpen,
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Activity types that match the Prisma schema */
export type ActivityType =
  | "session_start"
  | "session_end"
  | "hand_review"
  | "opponent_note"
  | "comment";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail?: string;
  userName: string;
  userInitial: string;
  userColor: string;
  createdAt: string;
  metadata?: {
    profitJpy?: number;
    spotName?: string;
    tags?: string[];
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert an ISO date string to a Japanese relative time string.
 *
 * Examples: "たった今", "3分前", "2時間前", "5日前"
 */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  // Guard against future dates
  if (diffMs < 0) return "たった今";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;
  if (weeks < 5) return `${weeks}週間前`;
  return `${months}ヶ月前`;
}

// ---------------------------------------------------------------------------
// Per-type icon & colour configuration
// ---------------------------------------------------------------------------

interface TypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  dotClass: string;
  iconClass: string;
}

const typeConfigs: Record<ActivityType, TypeConfig> = {
  session_start: {
    icon: Play,
    dotClass: "bg-emerald",
    iconClass: "text-emerald",
  },
  session_end: {
    icon: Square,
    dotClass: "bg-emerald",
    iconClass: "text-emerald",
  },
  hand_review: {
    icon: BookOpen,
    dotClass: "bg-[var(--accent-main)]",
    iconClass: "text-[var(--accent-main)]",
  },
  opponent_note: {
    icon: Eye,
    dotClass: "bg-gold",
    iconClass: "text-gold",
  },
  comment: {
    icon: MessageSquare,
    dotClass: "bg-muted-foreground",
    iconClass: "text-muted-foreground",
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProfitIndicator({ profitJpy }: { profitJpy: number }) {
  const isPositive = profitJpy >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const formatted = `${isPositive ? "+" : ""}${"\u00A5"}${Math.abs(profitJpy).toLocaleString()}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-number text-xs font-semibold",
        isPositive
          ? "border-emerald/20 bg-emerald/5 text-emerald"
          : "border-crimson/20 bg-crimson/5 text-crimson"
      )}
    >
      <Icon className="h-3 w-3" />
      {formatted}
    </span>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const config = typeConfigs[activity.type];
  const IconComponent = config.icon;

  // For session_end, override dot colour based on profit
  let dotClass = config.dotClass;
  if (activity.type === "session_end" && activity.metadata?.profitJpy != null) {
    dotClass =
      activity.metadata.profitJpy >= 0 ? "bg-emerald" : "bg-crimson";
  }

  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {/* Timeline connector line (drawn by the parent via CSS) */}

      {/* Dot */}
      <div className="relative z-10 flex shrink-0 items-start pt-1">
        <span
          className={cn(
            "block h-2.5 w-2.5 rounded-full ring-4 ring-background",
            dotClass
          )}
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Header row: icon + title + time */}
        <div className="flex items-center gap-2">
          <IconComponent className={cn("h-3.5 w-3.5 shrink-0", config.iconClass)} />

          {/* User avatar initial */}
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: activity.userColor }}
          >
            {activity.userInitial}
          </span>

          <span className="truncate text-sm font-medium">{activity.title}</span>

          <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>

        {/* Detail text */}
        {activity.detail && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {activity.detail}
          </p>
        )}

        {/* Metadata row */}
        {activity.metadata && (
          <div className="flex flex-wrap items-center gap-2">
            {activity.metadata.profitJpy != null && (
              <ProfitIndicator profitJpy={activity.metadata.profitJpy} />
            )}
            {activity.metadata.spotName && (
              <span className="spot-badge">{activity.metadata.spotName}</span>
            )}
            {activity.metadata.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const visible = activities.slice(0, maxItems);

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        アクティビティはまだありません
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-[4.5px] top-2 -bottom-0 w-px bg-border"
        aria-hidden="true"
      />

      <div className="space-y-0">
        {visible.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
