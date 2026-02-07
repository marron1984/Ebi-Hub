import type { PokerCurrency, SessionStatus } from "@/lib/currency";

// ===== Core Enums =====

export type GameType = "NLH" | "PLO" | "PLO5" | "Mixed";

export type Venue = "live" | "online";

export type Street = "preflop" | "flop" | "turn" | "river" | "showdown";

export type Action =
  | "fold"
  | "check"
  | "call"
  | "bet"
  | "raise"
  | "3bet"
  | "4bet"
  | "all-in";

export type Position =
  | "SB"
  | "BB"
  | "UTG"
  | "UTG+1"
  | "MP"
  | "MP+1"
  | "HJ"
  | "CO"
  | "BTN";

export type Suit = "s" | "h" | "d" | "c";
export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

// Re-export for backward compat
export type Currency = PokerCurrency;

// ===== Card =====

export interface Card {
  rank: Rank;
  suit: Suit;
}

// ===== Tags (Bilingual) =====

export type StrategyTag =
  | "3BET"
  | "4BET"
  | "C-BET"
  | "C-BET_DEFENSE"
  | "SQUEEZE"
  | "BLUFF"
  | "VALUE_BET"
  | "SLOW_PLAY"
  | "CHECK_RAISE"
  | "DONK_BET"
  | "FLOAT"
  | "BARREL"
  | "OVERBET"
  | "THIN_VALUE";

export type MentalTag =
  | "TILT_CHECK"
  | "CONFIDENT"
  | "FOCUSED"
  | "TIRED"
  | "RUSHED"
  | "EMOTIONAL";

export type ReviewTag =
  | "SOLVER_NEEDED"
  | "TEAM_SHARE"
  | "REVIEW_LATER"
  | "KEY_HAND"
  | "MISTAKE"
  | "GREAT_PLAY"
  | "GTO_DEVIATION";

export type HandTag = StrategyTag | MentalTag | ReviewTag;

export const TAG_LABELS_JA: Record<HandTag, string> = {
  "3BET": "3ベット",
  "4BET": "4ベット",
  "C-BET": "Cベット",
  "C-BET_DEFENSE": "Cベット防御",
  SQUEEZE: "スクイーズ",
  BLUFF: "ブラフ",
  VALUE_BET: "バリューベット",
  SLOW_PLAY: "スロープレイ",
  CHECK_RAISE: "チェックレイズ",
  DONK_BET: "ドンクベット",
  FLOAT: "フロート",
  BARREL: "バレル",
  OVERBET: "オーバーベット",
  THIN_VALUE: "シンバリュー",
  TILT_CHECK: "ティルト注意",
  CONFIDENT: "自信あり",
  FOCUSED: "集中",
  TIRED: "疲労",
  RUSHED: "焦り",
  EMOTIONAL: "感情的",
  SOLVER_NEEDED: "ソルバー確認",
  TEAM_SHARE: "チーム共有",
  REVIEW_LATER: "後で復習",
  KEY_HAND: "キーハンド",
  MISTAKE: "ミス",
  GREAT_PLAY: "好プレイ",
  GTO_DEVIATION: "GTO乖離",
};

// ===== Session =====

export interface Session {
  id: string;
  /** Session date (YYYY-MM-DD) */
  sessionDate: string;
  /** @deprecated Use sessionDate */
  date: string;
  startTime: string;
  endTime: string;
  venue: Venue;
  location: string;
  /** Osaka spot ID (optional, for live sessions) */
  spotId?: string;
  gameType: GameType;
  stakes: string;
  /** Original currency amounts */
  buyIn: number;
  cashOut: number;
  profit: number;
  /** Currency of the original amounts */
  currency: PokerCurrency;
  /** Exchange rate to JPY at time of session */
  exchangeRate: number;
  /** JPY-converted amounts */
  buyInJpy: number;
  cashOutJpy: number;
  profitJpy: number;
  /** OPEN = still playing / unsettled, SETTLED = converted to JPY */
  status: SessionStatus;
  durationMinutes: number;
  notes: string;
  playerId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Hand History =====

export interface StreetAction {
  street: Street;
  actions: PlayerAction[];
  potSize: number;
  board: Card[];
  thoughtProcess: string;
  /** Optional image URLs (solver screenshots, range charts) */
  images?: string[];
}

export interface PlayerAction {
  position: Position;
  action: Action;
  amount?: number;
  isHero: boolean;
}

export interface HandComment {
  id: string;
  handId: string;
  playerId: string;
  playerName: string;
  content: string;
  parentId?: string;
  createdAt: string;
}

export interface HandHistory {
  id: string;
  sessionId?: string;
  date: string;
  gameType: GameType;
  stakes: string;
  heroPosition: Position;
  heroCards: Card[];
  villainCards?: Card[];
  streets: StreetAction[];
  pot: number;
  result: number;
  currency: PokerCurrency;
  tags: HandTag[];
  notes: string;
  comments: HandComment[];
  playerId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Team =====

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  role: "leader" | "member";
  joinedAt: string;
  /** Primary Osaka spot ID */
  primarySpotId?: string;
}

export interface Team {
  id: string;
  name: string;
  members: Player[];
  createdAt: string;
}

// ===== Range Library =====

export interface RangeChart {
  id: string;
  title: string;
  description: string;
  position: Position;
  situation: string;
  grid: Record<string, "raise" | "call" | "fold" | "3bet" | "mixed">;
  createdBy: string;
  createdAt: string;
}

// ===== Stats =====

export interface PlayerStats {
  totalSessions: number;
  totalHands: number;
  /** Total profit in JPY (base currency) */
  totalProfitJpy: number;
  /** Total profit in USD (for reference) */
  totalProfitUsd: number;
  totalHours: number;
  hourlyRateJpy: number;
  winRate: number;
  bbPer100: number;
  bestSessionJpy: number;
  worstSessionJpy: number;
  currentStreak: number;
  profitByGameType: Record<GameType, number>;
  profitByVenue: Record<Venue, number>;
  /** Profit breakdown by currency (original amounts) */
  profitByCurrency: Partial<Record<PokerCurrency, number>>;
  monthlyProfitJpy: { month: string; profitJpy: number }[];
}

// ===== Dashboard Filters =====

export interface DashboardFilters {
  dateRange: { from: string; to: string } | null;
  gameType: GameType | "all";
  venue: Venue | "all";
  stakes: string | "all";
}
