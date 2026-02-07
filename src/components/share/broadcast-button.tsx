"use client";

import { useState } from "react";
import { Send, Check, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  broadcastToTeam,
  createHandReviewBroadcast,
  createSessionBroadcast,
  getTeamRecipients,
} from "@/lib/broadcast";
import { cn } from "@/lib/utils";

interface BroadcastButtonProps {
  type: "hand_review" | "session_result";
  senderName?: string;
  senderId?: string;
  // Hand review props
  handId?: string;
  handSummary?: string;
  profitJpy?: number;
  tags?: string[];
  // Session props
  sessionId?: string;
  spotName?: string;
  duration?: string;
  className?: string;
}

export function BroadcastButton({
  type,
  senderName = "おにく",
  senderId = "p1",
  handId,
  handSummary,
  profitJpy,
  tags,
  sessionId,
  spotName,
  duration,
  className,
}: BroadcastButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const recipients = getTeamRecipients(senderId);

  const handleBroadcast = async () => {
    setStatus("sending");

    try {
      const payload =
        type === "hand_review"
          ? createHandReviewBroadcast(
              senderName,
              senderId,
              handId ?? "",
              handSummary ?? "",
              profitJpy,
              tags,
            )
          : createSessionBroadcast(
              senderName,
              senderId,
              sessionId ?? "",
              spotName ?? "",
              profitJpy ?? 0,
              duration ?? "",
            );

      await broadcastToTeam(payload);
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBroadcast}
      disabled={status === "sending"}
      className={cn(
        "gap-2 transition-all",
        status === "sent" && "border-emerald/40 text-emerald",
        status === "error" && "border-crimson/40 text-crimson",
        className,
      )}
    >
      {status === "idle" && (
        <>
          <Send className="h-3.5 w-3.5" />
          <span>チームに共有</span>
          <span className="flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Users className="h-2.5 w-2.5" />
            {recipients.length}
          </span>
        </>
      )}
      {status === "sending" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>送信中...</span>
        </>
      )}
      {status === "sent" && (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>{recipients.length}人に送信完了</span>
        </>
      )}
      {status === "error" && (
        <>
          <Send className="h-3.5 w-3.5" />
          <span>送信失敗 — 再試行</span>
        </>
      )}
    </Button>
  );
}
