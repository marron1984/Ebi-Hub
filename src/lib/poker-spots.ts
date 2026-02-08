// ===== Osaka Poker Spots & Opponent Intelligence =====

export interface PokerSpot {
  id: string;
  name: string;
  shortName: string;
  area: string;
  address?: string;
  stakes: string[];
  gameTypes: ("NLH" | "PLO" | "PLO5" | "Mixed")[];
  category: "amusement" | "tournament" | "cash" | "online";
  playerPool: "tight" | "loose" | "mixed";
  notes?: string;
}

export interface OpponentEncounter {
  date: string;
  spotId: string;
  stakes: string;
  result: "win" | "loss" | "neutral";
  note?: string;
  createdAt: string;
}

export interface OpponentNote {
  id: string;
  opponentName: string;
  spotId: string;
  tags: OpponentTag[];
  notes: string;
  stakes: string;
  /** Skill rating 1-5 */
  skillRating: number;
  /** Physical description (appearance, items, habits) */
  physicalDescription?: string;
  /** Bet sizing tendencies */
  betSizingNotes?: string;
  /** Uploaded photo for visual ID (Base64 data URL) */
  photoUrl?: string | null;
  /** Encounter log entries */
  encounters: OpponentEncounter[];
  lastSeen: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type OpponentTag =
  | "FISH"
  | "REG"
  | "NITS"
  | "LAG"
  | "TAG"
  | "MANIAC"
  | "CALLING_STATION"
  | "TILT_PRONE"
  | "SLOW_PLAY_HEAVY"
  | "OVERBET_FREQ"
  | "WEAK_POSTFLOP"
  | "STRONG_PREFLOP"
  | "BLUFF_HEAVY"
  | "POSITIONAL_AWARE";

export const OPPONENT_TAG_LABELS: Record<OpponentTag, string> = {
  FISH: "フィッシュ",
  REG: "レギュラー",
  NITS: "ニッツ",
  LAG: "LAG",
  TAG: "TAG",
  MANIAC: "マニアック",
  CALLING_STATION: "コーリングステーション",
  TILT_PRONE: "ティルトしやすい",
  SLOW_PLAY_HEAVY: "スロープレイ多用",
  OVERBET_FREQ: "オーバーベット多",
  WEAK_POSTFLOP: "ポストフロップ弱い",
  STRONG_PREFLOP: "プリフロップ強い",
  BLUFF_HEAVY: "ブラフ多い",
  POSITIONAL_AWARE: "ポジション意識高い",
};

export const OPPONENT_TAG_COLORS: Record<OpponentTag, string> = {
  FISH: "text-emerald",
  REG: "text-crimson",
  NITS: "text-muted-foreground",
  LAG: "text-gold",
  TAG: "text-emerald-dark",
  MANIAC: "text-crimson-light",
  CALLING_STATION: "text-gold-light",
  TILT_PRONE: "text-crimson",
  SLOW_PLAY_HEAVY: "text-muted-foreground",
  OVERBET_FREQ: "text-crimson-light",
  WEAK_POSTFLOP: "text-emerald",
  STRONG_PREFLOP: "text-crimson",
  BLUFF_HEAVY: "text-gold",
  POSITIONAL_AWARE: "text-crimson",
};

// ===== Osaka Poker Spots =====

export const OSAKA_SPOTS: PokerSpot[] = [
  {
    id: "roots",
    name: "ROOTS OSAKA",
    shortName: "ROOTS",
    area: "心斎橋",
    stakes: ["100/200", "200/400", "500/1000"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "mixed",
    notes: "大阪の定番。フロアが広く、レギュラーが多い。深夜帯はルースプレイヤーが増える。",
  },
  {
    id: "poker-live",
    name: "POKER LIVE OSAKA",
    shortName: "PLO",
    area: "難波",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH"],
    category: "cash",
    playerPool: "loose",
    notes: "初心者やカジュアルプレイヤーが多い。バリューベットが効きやすい環境。",
  },
  {
    id: "ggpl",
    name: "GGPL OSAKA",
    shortName: "GGPL",
    area: "梅田",
    stakes: ["100/200", "200/400", "500/1000"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "mixed",
    notes: "梅田エリアの大型店。トーナメントも定期開催。",
  },
  {
    id: "blow",
    name: "BLOW",
    shortName: "BLOW",
    area: "心斎橋",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "loose",
    notes: "アミューズメント。初心者が多くテーブルセレクション次第で稼ぎやすい。",
  },
  {
    id: "zeus",
    name: "ゼウス",
    shortName: "ゼウス",
    area: "難波",
    stakes: ["50/100", "100/200"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "loose",
    notes: "低ステークスが中心。ビギナーフレンドリー。練習に最適。",
  },
  {
    id: "universe",
    name: "UNIVERSE",
    shortName: "UNI",
    area: "梅田",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "tight",
    notes: "レギュラーが多くタイトなテーブル。エクスプロイトしにくいが良い練習環境。",
  },
  {
    id: "jerrys",
    name: "Jerrys",
    shortName: "Jerry",
    area: "心斎橋",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "mixed",
    notes: "落ち着いた雰囲気。常連客とのコミュニケーションが取りやすい。",
  },
  {
    id: "white",
    name: "WHITE",
    shortName: "WHITE",
    area: "難波",
    stakes: ["100/200"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "loose",
    notes: "小規模だがアットホーム。週末は混雑する。",
  },
  {
    id: "guild",
    name: "ギルド",
    shortName: "ギルド",
    area: "心斎橋",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "mixed",
    notes: "トーナメントシリーズの開催実績あり。イベント時は特に盛り上がる。",
  },
  {
    id: "casino-stadium",
    name: "Casino Stadium",
    shortName: "CS",
    area: "心斎橋",
    stakes: ["100/200", "200/400", "500/1000"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "mixed",
    notes: "大型店舗。ハイステークスも常設。トーナメントシリーズのホスト実績多数。",
  },
  {
    id: "iris",
    name: "IRis",
    shortName: "IRis",
    area: "梅田",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "loose",
    notes: "梅田の隠れ家的スポット。カジュアルプレイヤーが多い。雰囲気が良い。",
  },
  {
    id: "jackpot",
    name: "Jackpot",
    shortName: "JP",
    area: "難波",
    stakes: ["100/200", "200/400"],
    gameTypes: ["NLH", "PLO"],
    category: "cash",
    playerPool: "mixed",
    notes: "難波エリアの老舗。常連プレイヤーのコミュニティが強い。",
  },
  {
    id: "backdoor",
    name: "BACKDOOR",
    shortName: "BD",
    area: "心斎橋",
    stakes: ["100/200"],
    gameTypes: ["NLH"],
    category: "amusement",
    playerPool: "loose",
    notes: "バー併設のアミューズメントポーカー。お酒を楽しみながらプレイ。初心者にも優しい。",
  },
];

export function getSpot(id: string): PokerSpot | undefined {
  return OSAKA_SPOTS.find((s) => s.id === id);
}

export function findSpotByName(query: string): PokerSpot[] {
  const q = query.toLowerCase();
  return OSAKA_SPOTS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.area.includes(query)
  );
}

export function getSpotNames(): { id: string; label: string }[] {
  return OSAKA_SPOTS.map((s) => ({
    id: s.id,
    label: `${s.name} (${s.area})`,
  }));
}

// ===== Member Activity (Pulse) =====

export interface MemberActivity {
  playerId: string;
  lastSessionDate: string;
  lastSpotId?: string;
  currentStreak: number;
  weeklyHours: number;
  weeklyProfit: number;
  status: "active" | "resting" | "on-fire" | "cooling-down";
}

export function getMemberStatus(activity: MemberActivity): {
  label: string;
  color: string;
} {
  switch (activity.status) {
    case "on-fire":
      return { label: "絶好調", color: "text-emerald" };
    case "active":
      return { label: "活動中", color: "text-foreground" };
    case "cooling-down":
      return { label: "調整中", color: "text-gold" };
    case "resting":
      return { label: "休養中", color: "text-muted-foreground" };
  }
}
