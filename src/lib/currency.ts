// ===== Multi-Currency System for Poker Live Expeditions =====
// Base currency: JPY (日本円)
// Supported poker currencies: JPY, USD, PHP, KRW, EUR

export type PokerCurrency = "JPY" | "USD" | "PHP" | "KRW" | "EUR";

export type SessionStatus = "OPEN" | "SETTLED";

export interface CurrencyInfo {
  code: PokerCurrency;
  symbol: string;
  name: string;
  nameJa: string;
  flag: string;
  defaultRate: number; // rate to JPY (1 unit = X JPY)
  decimalPlaces: number;
}

export const POKER_CURRENCIES: Record<PokerCurrency, CurrencyInfo> = {
  JPY: {
    code: "JPY", symbol: "¥", name: "Japanese Yen", nameJa: "日本円",
    flag: "🇯🇵", defaultRate: 1, decimalPlaces: 0,
  },
  USD: {
    code: "USD", symbol: "$", name: "US Dollar", nameJa: "米ドル",
    flag: "🇺🇸", defaultRate: 150.0, decimalPlaces: 2,
  },
  PHP: {
    code: "PHP", symbol: "₱", name: "Philippine Peso", nameJa: "フィリピンペソ",
    flag: "🇵🇭", defaultRate: 2.65, decimalPlaces: 0,
  },
  KRW: {
    code: "KRW", symbol: "₩", name: "Korean Won", nameJa: "韓国ウォン",
    flag: "🇰🇷", defaultRate: 0.11, decimalPlaces: 0,
  },
  EUR: {
    code: "EUR", symbol: "€", name: "Euro", nameJa: "ユーロ",
    flag: "🇪🇺", defaultRate: 163.0, decimalPlaces: 2,
  },
};

export const CURRENCY_LIST: PokerCurrency[] = ["JPY", "USD", "PHP", "KRW", "EUR"];

// ===== Exchange Rate Management =====

export interface ExchangeRateEntry {
  from: PokerCurrency;
  to: "JPY";
  rate: number;
  updatedAt: string;
  source: "manual" | "api";
}

// In-memory rates (defaults from POKER_CURRENCIES)
const rateStore: Record<PokerCurrency, number> = {
  JPY: 1,
  USD: 150.0,
  PHP: 2.65,
  KRW: 0.11,
  EUR: 163.0,
};

export function getRate(currency: PokerCurrency): number {
  return rateStore[currency];
}

export function setRate(currency: PokerCurrency, rate: number): void {
  rateStore[currency] = rate;
}

// ===== Conversion Functions =====

/** Convert from any currency to JPY */
export function toJpy(amount: number, currency: PokerCurrency, rate?: number): number {
  if (currency === "JPY") return amount;
  return Math.round(amount * (rate ?? rateStore[currency]));
}

/** Convert from JPY to any currency */
export function fromJpy(amountJpy: number, currency: PokerCurrency, rate?: number): number {
  if (currency === "JPY") return amountJpy;
  const r = rate ?? rateStore[currency];
  if (r === 0) return 0;
  const raw = amountJpy / r;
  const info = POKER_CURRENCIES[currency];
  return info.decimalPlaces === 0 ? Math.round(raw) : Math.round(raw * 100) / 100;
}

// ===== Formatting =====

export function getCurrencySymbol(currency: PokerCurrency): string {
  return POKER_CURRENCIES[currency].symbol;
}

export function getCurrencyFlag(currency: PokerCurrency): string {
  return POKER_CURRENCIES[currency].flag;
}

/** Format in original currency: +$1,200 or +¥180,000 */
export function formatOriginal(
  amount: number,
  currency: PokerCurrency,
  privacy: boolean = false
): string {
  if (privacy) return "***";
  const prefix = amount >= 0 ? "+" : "";
  const sym = POKER_CURRENCIES[currency].symbol;
  return `${prefix}${sym}${Math.abs(amount).toLocaleString()}`;
}

/** Format as dual currency: $1,200 (¥180,000) */
export function formatDualCurrency(
  amount: number,
  originalCurrency: PokerCurrency,
  rate?: number,
  privacy: boolean = false
): string {
  if (privacy) return "***";

  const sym = POKER_CURRENCIES[originalCurrency].symbol;
  const prefix = amount >= 0 ? "+" : "";

  if (originalCurrency === "JPY") {
    return `${prefix}¥${Math.abs(amount).toLocaleString()}`;
  }

  const jpy = toJpy(amount, originalCurrency, rate);
  const jpyPrefix = jpy >= 0 ? "+" : "";
  return `${prefix}${sym}${Math.abs(amount).toLocaleString()} (${jpyPrefix}¥${Math.abs(jpy).toLocaleString()})`;
}

/** Format JPY with 万 (man) unit for large amounts */
export function formatJpyCompact(amount: number, privacy: boolean = false): string {
  if (privacy) return "***";
  const prefix = amount >= 0 ? "+" : "-";
  const abs = Math.abs(amount);
  if (abs >= 10000) {
    return `${prefix}¥${(abs / 10000).toFixed(1)}万`;
  }
  return `${prefix}¥${abs.toLocaleString()}`;
}

/** Format JPY full */
export function formatJpy(amount: number, privacy: boolean = false): string {
  if (privacy) return "***";
  const prefix = amount >= 0 ? "+" : "";
  return `${prefix}¥${Math.abs(amount).toLocaleString()}`;
}

// ===== Session Aggregation =====

export interface SessionCurrencyData {
  profit: number;
  profitJpy: number;
  currency: PokerCurrency;
  exchangeRate?: number;
}

/** Calculate total profit in JPY across mixed-currency sessions */
export function calculateTotalProfitJpy(sessions: SessionCurrencyData[]): number {
  return sessions.reduce((sum, s) => sum + s.profitJpy, 0);
}

// ===== Staking & Distribution =====

export interface StakingMember {
  playerId: string;
  playerName: string;
  stakePercent: number;
  makeup: number; // accumulated negative balance in JPY
}

export interface StakingResult {
  playerId: string;
  playerName: string;
  stakePercent: number;
  grossShare: number;
  makeupDeduction: number;
  netPayout: number;
  remainingMakeup: number;
}

/**
 * Calculate profit distribution with makeup (メイクアップ) logic.
 *
 * When a player has makeup (accumulated losses), their share of profits
 * first pays off the makeup. Only after makeup is cleared do they receive payouts.
 */
export function calculateStakingDistribution(
  totalProfitJpy: number,
  members: StakingMember[]
): StakingResult[] {
  return members.map((member) => {
    const grossShare = Math.round((totalProfitJpy * member.stakePercent) / 100);

    if (grossShare <= 0) {
      return {
        playerId: member.playerId,
        playerName: member.playerName,
        stakePercent: member.stakePercent,
        grossShare,
        makeupDeduction: 0,
        netPayout: 0,
        remainingMakeup: member.makeup + Math.abs(grossShare),
      };
    }

    if (member.makeup > 0) {
      const deduction = Math.min(grossShare, member.makeup);
      return {
        playerId: member.playerId,
        playerName: member.playerName,
        stakePercent: member.stakePercent,
        grossShare,
        makeupDeduction: deduction,
        netPayout: grossShare - deduction,
        remainingMakeup: member.makeup - deduction,
      };
    }

    return {
      playerId: member.playerId,
      playerName: member.playerName,
      stakePercent: member.stakePercent,
      grossShare,
      makeupDeduction: 0,
      netPayout: grossShare,
      remainingMakeup: 0,
    };
  });
}

// ===== Default currency by venue =====

export function getDefaultCurrency(venue: "live" | "online"): PokerCurrency {
  return venue === "live" ? "JPY" : "USD";
}

/** Get default stakes for a currency */
export function getDefaultStakes(currency: PokerCurrency): string[] {
  switch (currency) {
    case "JPY": return ["50/100", "100/200", "200/400", "500/1000"];
    case "USD": return ["0.25/0.5", "0.5/1", "1/2", "2/5", "5/10"];
    case "PHP": return ["25/50", "50/100", "100/200", "200/400"];
    case "KRW": return ["1K/2K", "2K/5K", "5K/10K", "10K/20K"];
    case "EUR": return ["0.5/1", "1/2", "2/5", "5/10"];
  }
}
