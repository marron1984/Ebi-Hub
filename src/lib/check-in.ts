// ===== Check-in System — Active Spot Tracking =====

import type { PokerSpot } from "@/lib/poker-spots";

export interface CheckIn {
  id: string;
  playerId: string;
  playerName: string;
  playerInitial: string;
  playerColor: string;
  spotId: string;
  spotName: string;
  stakes: string;
  gameType: string;
  startedAt: string; // ISO datetime
  status: "active" | "break" | "ending";
  note?: string;
}

export interface CheckInNotification {
  id: string;
  checkIn: CheckIn;
  message: string;
  createdAt: string;
  read: boolean;
}

// Current active check-ins (mock initial state)
export const mockCheckIns: CheckIn[] = [
  {
    id: "ci-1",
    playerId: "p1",
    playerName: "おにく",
    playerInitial: "お",
    playerColor: "#00FF9F",
    spotId: "roots",
    spotName: "ROOTS OSAKA",
    stakes: "200/400",
    gameType: "NLH",
    startedAt: "2025-02-08T20:00:00Z",
    status: "active",
    note: "3テーブル目。テーブル選択次第。",
  },
  {
    id: "ci-2",
    playerId: "p4",
    playerName: "ノセ",
    playerInitial: "ノ",
    playerColor: "#3B82F6",
    spotId: "poker-live",
    spotName: "POKER LIVE OSAKA",
    stakes: "100/200",
    gameType: "NLH",
    startedAt: "2025-02-08T19:30:00Z",
    status: "active",
  },
  {
    id: "ci-3",
    playerId: "p3",
    playerName: "バスロもっちバイヤグラ",
    playerInitial: "バ",
    playerColor: "#EF4444",
    spotId: "casino-stadium",
    spotName: "Casino Stadium",
    stakes: "500/1000",
    gameType: "NLH",
    startedAt: "2025-02-08T20:30:00Z",
    status: "active",
    note: "ハイステークス卓。魚多め。",
  },
  {
    id: "ci-4",
    playerId: "p8",
    playerName: "コロッケ",
    playerInitial: "コ",
    playerColor: "#A855F7",
    spotId: "guild",
    spotName: "ギルド",
    stakes: "100/200",
    gameType: "NLH",
    startedAt: "2025-02-08T17:00:00Z",
    status: "active",
    note: "リーグ戦参加中",
  },
];

/** Build a shout notification message for a new check-in */
export function buildShoutMessage(checkIn: CheckIn): string {
  return `${checkIn.playerName} が ${checkIn.spotName}（${checkIn.stakes} ${checkIn.gameType}）で稼働開始！`;
}

/** Calculate how long someone has been checked in */
export function getElapsedTime(startedAt: string): string {
  const now = new Date("2025-02-08T22:00:00Z"); // Reference time
  const start = new Date(startedAt);
  const diffMs = now.getTime() - start.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hours > 0) return `${hours}h${mins > 0 ? `${mins}m` : ""}`;
  return `${mins}m`;
}
