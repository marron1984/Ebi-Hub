// ===== Team Broadcast System =====
// Handles sharing hand reviews and session results to all team members.
// Supports Discord webhook integration and in-app activity feed.

import { mockPlayers } from "@/lib/mock-data";

export interface BroadcastPayload {
  type: "hand_review" | "session_result" | "opponent_note" | "announcement";
  title: string;
  body: string;
  senderId: string;
  senderName: string;
  metadata?: {
    handId?: string;
    sessionId?: string;
    profitJpy?: number;
    tags?: string[];
    spotName?: string;
  };
  timestamp: string;
}

export interface BroadcastResult {
  success: boolean;
  recipientCount: number;
  discordSent: boolean;
  error?: string;
}

export interface DiscordWebhookConfig {
  url: string;
  enabled: boolean;
}

// Team recipients (all members except sender)
export function getTeamRecipients(excludeId?: string) {
  return mockPlayers.filter((p) => p.id !== excludeId);
}

// Format Discord embed for hand review
function formatHandEmbed(payload: BroadcastPayload) {
  const profitStr = payload.metadata?.profitJpy
    ? payload.metadata.profitJpy >= 0
      ? `+¥${payload.metadata.profitJpy.toLocaleString()}`
      : `-¥${Math.abs(payload.metadata.profitJpy).toLocaleString()}`
    : null;

  const tagStr = payload.metadata?.tags?.length
    ? payload.metadata.tags.map((t) => `\`#${t}\``).join(" ")
    : null;

  return {
    embeds: [
      {
        title: `📢 ${payload.title}`,
        description: payload.body,
        color: payload.metadata?.profitJpy && payload.metadata.profitJpy >= 0 ? 0x00ff9f : 0xdc2626,
        fields: [
          ...(profitStr ? [{ name: "結果", value: profitStr, inline: true }] : []),
          ...(payload.metadata?.spotName ? [{ name: "スポット", value: payload.metadata.spotName, inline: true }] : []),
          ...(tagStr ? [{ name: "タグ", value: tagStr, inline: false }] : []),
        ],
        footer: { text: `${payload.senderName} via Ebi-Hub` },
        timestamp: payload.timestamp,
      },
    ],
  };
}

// Format Discord embed for session result
function formatSessionEmbed(payload: BroadcastPayload) {
  const profitStr = payload.metadata?.profitJpy
    ? payload.metadata.profitJpy >= 0
      ? `+¥${payload.metadata.profitJpy.toLocaleString()}`
      : `-¥${Math.abs(payload.metadata.profitJpy).toLocaleString()}`
    : "N/A";

  return {
    embeds: [
      {
        title: `🎰 ${payload.title}`,
        description: payload.body,
        color: payload.metadata?.profitJpy && payload.metadata.profitJpy >= 0 ? 0x00ff9f : 0xdc2626,
        fields: [
          { name: "収支", value: profitStr, inline: true },
          ...(payload.metadata?.spotName ? [{ name: "スポット", value: payload.metadata.spotName, inline: true }] : []),
        ],
        footer: { text: `${payload.senderName} via Ebi-Hub` },
        timestamp: payload.timestamp,
      },
    ],
  };
}

// Send to Discord webhook (stub — ready for real integration)
async function sendToDiscord(
  config: DiscordWebhookConfig,
  payload: BroadcastPayload
): Promise<boolean> {
  if (!config.enabled || !config.url) return false;

  const embed =
    payload.type === "hand_review"
      ? formatHandEmbed(payload)
      : formatSessionEmbed(payload);

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });
    return res.ok;
  } catch {
    console.error("[Broadcast] Discord webhook failed");
    return false;
  }
}

// Main broadcast function
export async function broadcastToTeam(
  payload: BroadcastPayload,
  discordConfig?: DiscordWebhookConfig
): Promise<BroadcastResult> {
  const recipients = getTeamRecipients(payload.senderId);

  // In-app notification (mock: would normally write to DB)
  console.log(
    `[Broadcast] Sending "${payload.title}" to ${recipients.length} members:`,
    recipients.map((r) => r.name).join(", ")
  );

  // Discord webhook
  let discordSent = false;
  if (discordConfig?.enabled) {
    discordSent = await sendToDiscord(discordConfig, payload);
  }

  return {
    success: true,
    recipientCount: recipients.length,
    discordSent,
  };
}

// Helper to create hand review broadcast payload
export function createHandReviewBroadcast(
  senderName: string,
  senderId: string,
  handId: string,
  summary: string,
  profitJpy?: number,
  tags?: string[],
): BroadcastPayload {
  return {
    type: "hand_review",
    title: `${senderName} がハンドレビューを共有`,
    body: summary,
    senderId,
    senderName,
    metadata: { handId, profitJpy, tags },
    timestamp: new Date().toISOString(),
  };
}

// Helper to create session result broadcast payload
export function createSessionBroadcast(
  senderName: string,
  senderId: string,
  sessionId: string,
  spotName: string,
  profitJpy: number,
  duration: string,
): BroadcastPayload {
  const profitStr = profitJpy >= 0
    ? `+¥${profitJpy.toLocaleString()}`
    : `-¥${Math.abs(profitJpy).toLocaleString()}`;

  return {
    type: "session_result",
    title: `${senderName} のセッション結果`,
    body: `${spotName} — ${profitStr} (${duration})`,
    senderId,
    senderName,
    metadata: { sessionId, profitJpy, spotName },
    timestamp: new Date().toISOString(),
  };
}
