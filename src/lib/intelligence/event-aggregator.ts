// ===== Ebi-Hub Intelligence — Event Aggregator =====
// Real-time event aggregation for Osaka poker scene

export interface EventSource {
  id: string;
  name: string;
  type: "poker_walker" | "x_scrape" | "instagram" | "manual" | "rss";
  url?: string;
  handle?: string;
  reliability: number; // 0-1 confidence score
}

export interface AggregatedEvent {
  id: string;
  title: string;
  spotId: string;
  spotName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  eventType: "tournament" | "cash_game" | "freeroll" | "special" | "league";
  buyInJpy?: number;
  guaranteeJpy?: number;
  detail?: string;
  source: EventSource;
  scrapedAt: string; // ISO datetime
  confidence: number; // 0-1
}

export interface TournamentCountdown {
  id: string;
  name: string;
  series: string;
  spotName: string;
  startDate: string;
  registrationEnd?: string;
  buyInJpy: number;
  guaranteeJpy?: number;
  accentColor: string;
  status: "upcoming" | "registration_open" | "running" | "completed";
  daysUntil: number;
  hoursUntil: number;
  isUrgent: boolean; // < 24h
}

// Source registry for all Osaka spots
export const OSAKA_EVENT_SOURCES: EventSource[] = [
  { id: "pw-roots", name: "ポーカーウォーカー ROOTS", type: "poker_walker", url: "https://pokerwalker.jp/spots/roots-osaka", reliability: 0.9 },
  { id: "pw-ggpl", name: "ポーカーウォーカー GGPL", type: "poker_walker", url: "https://pokerwalker.jp/spots/ggpl-osaka", reliability: 0.9 },
  { id: "pw-plo", name: "ポーカーウォーカー PLO", type: "poker_walker", url: "https://pokerwalker.jp/spots/poker-live-osaka", reliability: 0.9 },
  { id: "pw-blow", name: "ポーカーウォーカー BLOW", type: "poker_walker", url: "https://pokerwalker.jp/spots/blow", reliability: 0.85 },
  { id: "pw-zeus", name: "ポーカーウォーカー ゼウス", type: "poker_walker", url: "https://pokerwalker.jp/spots/zeus", reliability: 0.85 },
  { id: "pw-universe", name: "ポーカーウォーカー UNIVERSE", type: "poker_walker", url: "https://pokerwalker.jp/spots/universe", reliability: 0.85 },
  { id: "pw-jerrys", name: "ポーカーウォーカー Jerrys", type: "poker_walker", url: "https://pokerwalker.jp/spots/jerrys", reliability: 0.8 },
  { id: "pw-white", name: "ポーカーウォーカー WHITE", type: "poker_walker", url: "https://pokerwalker.jp/spots/white", reliability: 0.8 },
  { id: "pw-guild", name: "ポーカーウォーカー ギルド", type: "poker_walker", url: "https://pokerwalker.jp/spots/guild", reliability: 0.85 },
  { id: "pw-cs", name: "ポーカーウォーカー Casino Stadium", type: "poker_walker", url: "https://pokerwalker.jp/spots/casino-stadium", reliability: 0.9 },
  { id: "pw-iris", name: "ポーカーウォーカー IRis", type: "poker_walker", url: "https://pokerwalker.jp/spots/iris", reliability: 0.8 },
  { id: "pw-jp", name: "ポーカーウォーカー Jackpot", type: "poker_walker", url: "https://pokerwalker.jp/spots/jackpot", reliability: 0.85 },
  { id: "pw-bd", name: "ポーカーウォーカー BACKDOOR", type: "poker_walker", url: "https://pokerwalker.jp/spots/backdoor", reliability: 0.8 },
  { id: "x-roots", name: "ROOTS OSAKA (X)", type: "x_scrape", handle: "@roots_osaka", reliability: 0.7 },
  { id: "x-ggpl", name: "GGPL OSAKA (X)", type: "x_scrape", handle: "@ggpl_osaka", reliability: 0.7 },
  { id: "x-kopt", name: "KOPT Official (X)", type: "x_scrape", handle: "@kopt_poker", reliability: 0.8 },
  { id: "x-tpc", name: "TPC Official (X)", type: "x_scrape", handle: "@tpc_poker", reliability: 0.8 },
  { id: "x-jopt", name: "JOPT Official (X)", type: "x_scrape", handle: "@jopt_poker", reliability: 0.8 },
];

// ===== Stub functions (to be wired to real APIs) =====

/** Fetch today's events from ポーカーウォーカー */
export async function fetchPokerWalkerEvents(date: string): Promise<AggregatedEvent[]> {
  // TODO: Wire to real ポーカーウォーカー API/scraper
  console.log(`[Intelligence] Fetching PokerWalker events for ${date}...`);
  return [];
}

/** Fetch tournament schedule from major series */
export async function fetchMajorTournaments(): Promise<TournamentCountdown[]> {
  // TODO: Wire to KOPT, TPC, JGD, JOPT, OSL official sources
  console.log("[Intelligence] Fetching major tournament schedule...");
  return [];
}

/** Fetch latest announcements from X/Twitter */
export async function fetchXAnnouncements(handles: string[]): Promise<AggregatedEvent[]> {
  // TODO: Wire to X API v2
  console.log(`[Intelligence] Fetching X announcements for ${handles.length} accounts...`);
  return [];
}

/** Calculate countdown for a tournament */
export function calculateCountdown(startDate: string, registrationEnd?: string): { daysUntil: number; hoursUntil: number; isUrgent: boolean } {
  const now = new Date();
  const start = new Date(startDate);
  const diffMs = start.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hoursUntil = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  let isUrgent = hoursUntil < 24;
  if (registrationEnd) {
    const regEnd = new Date(registrationEnd);
    const regDiffMs = regEnd.getTime() - now.getTime();
    if (regDiffMs < 24 * 60 * 60 * 1000 && regDiffMs > 0) {
      isUrgent = true;
    }
  }

  return { daysUntil, hoursUntil, isUrgent };
}

/** Deduplicate events by title + date + spotId */
export function deduplicateEvents(events: AggregatedEvent[]): AggregatedEvent[] {
  const seen = new Map<string, AggregatedEvent>();
  for (const event of events) {
    const key = `${event.date}:${event.spotId}:${event.title}`;
    const existing = seen.get(key);
    if (!existing || event.confidence > existing.confidence) {
      seen.set(key, event);
    }
  }
  return Array.from(seen.values());
}

/** Master aggregation: combine all sources for a given date */
export async function aggregateOsakaEvents(date: string): Promise<{
  dailyEvents: AggregatedEvent[];
  tournaments: TournamentCountdown[];
}> {
  const [pwEvents, xEvents, tournaments] = await Promise.all([
    fetchPokerWalkerEvents(date),
    fetchXAnnouncements(OSAKA_EVENT_SOURCES.filter(s => s.type === "x_scrape").map(s => s.handle!)),
    fetchMajorTournaments(),
  ]);

  const allEvents = [...pwEvents, ...xEvents];
  const deduplicated = deduplicateEvents(allEvents);

  return {
    dailyEvents: deduplicated.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    tournaments: tournaments.sort((a, b) => a.daysUntil - b.daysUntil),
  };
}
