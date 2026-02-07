// ===== Core Enums =====

export type GameType = "NLH" | "PLO" | "PLO5" | "Mixed";

export type Venue = "live" | "online";

export type Street = "preflop" | "flop" | "turn" | "river";

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

// ===== Card =====

export interface Card {
  rank: Rank;
  suit: Suit;
}

// ===== Tags =====

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
  | "GREAT_PLAY";

export type HandTag = StrategyTag | MentalTag | ReviewTag;

// ===== Session =====

export interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: Venue;
  location: string;
  gameType: GameType;
  stakes: string;
  buyIn: number;
  cashOut: number;
  profit: number;
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
}

export interface PlayerAction {
  position: Position;
  action: Action;
  amount?: number;
  isHero: boolean;
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
  tags: HandTag[];
  notes: string;
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
}

export interface Team {
  id: string;
  name: string;
  members: Player[];
  createdAt: string;
}

// ===== Stats =====

export interface PlayerStats {
  totalSessions: number;
  totalHands: number;
  totalProfit: number;
  totalHours: number;
  hourlyRate: number;
  winRate: number;
  bbPer100: number;
  bestSession: number;
  worstSession: number;
  currentStreak: number;
  profitByGameType: Record<GameType, number>;
  profitByVenue: Record<Venue, number>;
  monthlyProfit: { month: string; profit: number }[];
}

// ===== Dashboard Filters =====

export interface DashboardFilters {
  dateRange: { from: string; to: string } | null;
  gameType: GameType | "all";
  venue: Venue | "all";
  stakes: string | "all";
}
