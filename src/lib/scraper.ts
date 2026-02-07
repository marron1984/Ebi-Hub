// ===== Ebi-Hub Scraper Foundation =====
// Aggregates Osaka poker event data from multiple sources.
// This is the foundation layer — actual fetch calls are stubbed
// and ready to be wired to real endpoints.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrapedEvent {
  title: string;
  spotId: string;
  spotName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  eventType: "tournament" | "cash_game" | "freeroll" | "special" | "league";
  buyInJpy?: number;
  detail?: string;
  source: "poker_walker" | "x_scrape" | "manual";
  sourceUrl?: string;
}

export interface ScrapedTournament {
  name: string;
  series: string;
  spotId: string;
  spotName: string;
  startDate: string;
  endDate?: string;
  registrationEnd?: string;
  buyInJpy: number;
  guaranteeJpy?: number;
  gameType: string;
  format: string;
  source: string;
  sourceUrl?: string;
}

// ---------------------------------------------------------------------------
// Osaka Spot URL map (for future scraping)
// ---------------------------------------------------------------------------

export const SPOT_SOURCE_URLS: Record<
  string,
  { pokerWalker?: string; xAccount?: string; website?: string }
> = {
  roots: {
    pokerWalker: "https://pokerwalker.jp/shops/roots-osaka",
    xAccount: "ROOTS_OSAKA",
    website: "https://roots-poker.jp",
  },
  "poker-live": {
    pokerWalker: "https://pokerwalker.jp/shops/poker-live-osaka",
    xAccount: "POKERLIVE_OSAKA",
  },
  ggpl: {
    pokerWalker: "https://pokerwalker.jp/shops/ggpl-osaka",
    xAccount: "GGPL_OSAKA",
  },
  blow: {
    pokerWalker: "https://pokerwalker.jp/shops/blow",
    xAccount: "BLOW_poker",
  },
  zeus: {
    pokerWalker: "https://pokerwalker.jp/shops/zeus",
  },
  universe: {
    pokerWalker: "https://pokerwalker.jp/shops/universe",
    xAccount: "UNIVERSE_poker",
  },
  jerrys: {
    pokerWalker: "https://pokerwalker.jp/shops/jerrys",
  },
  white: {
    pokerWalker: "https://pokerwalker.jp/shops/white",
  },
  guild: {
    pokerWalker: "https://pokerwalker.jp/shops/guild",
    xAccount: "guild_poker",
  },
};

// ---------------------------------------------------------------------------
// Scraper functions (stubs — ready for real API/fetch wiring)
// ---------------------------------------------------------------------------

/**
 * Fetch daily events for a given date from ポーカーウォーカー.
 * Currently returns empty — wire to real API when ready.
 */
export async function fetchPokerWalkerEvents(
  _date: string
): Promise<ScrapedEvent[]> {
  // TODO: Implement real fetch
  // const res = await fetch(`https://pokerwalker.jp/api/events?date=${date}&area=osaka`);
  // const data = await res.json();
  // return data.map(transformPokerWalkerEvent);
  return [];
}

/**
 * Fetch major tournament schedules from tournament series sites.
 * Currently returns empty — wire to real API when ready.
 */
export async function fetchMajorTournaments(): Promise<ScrapedTournament[]> {
  // TODO: Implement real fetch for KOPT, TPC, JGD, OSL
  // Sources:
  //   KOPT: https://kopt.jp/schedule
  //   TPC:  https://tpc-poker.jp/schedule
  //   JGD:  https://japangolddragon.com/schedule
  //   OSL:  (spot-specific)
  return [];
}

/**
 * Scrape X (Twitter) for spot-level event announcements.
 * Currently returns empty — wire to X API when ready.
 */
export async function fetchXAnnouncements(
  _spotId: string
): Promise<ScrapedEvent[]> {
  // TODO: Use X API v2 to search for event posts from spot accounts
  // const account = SPOT_SOURCE_URLS[spotId]?.xAccount;
  // if (!account) return [];
  // const res = await fetch(`https://api.twitter.com/2/tweets/search/recent?query=from:${account}`);
  return [];
}

// ---------------------------------------------------------------------------
// Aggregator — combines all sources
// ---------------------------------------------------------------------------

/**
 * Aggregate events from all sources for a given date.
 * Falls back to manual/mock data when scrapers return empty.
 */
export async function aggregateOsakaEvents(
  date: string
): Promise<ScrapedEvent[]> {
  const [pokerWalker, ...xResults] = await Promise.all([
    fetchPokerWalkerEvents(date),
    ...Object.keys(SPOT_SOURCE_URLS).map((spotId) =>
      fetchXAnnouncements(spotId)
    ),
  ]);

  const allEvents = [...pokerWalker, ...xResults.flat()];

  // Deduplicate by title + spotId + startTime
  const seen = new Set<string>();
  return allEvents.filter((e) => {
    const key = `${e.spotId}:${e.title}:${e.startTime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
