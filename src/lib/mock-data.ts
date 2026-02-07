import type {
  Session,
  HandHistory,
  Player,
  PlayerStats,
  HandComment,
  RangeChart,
} from "@/types/poker";
import type { PokerCurrency } from "@/lib/currency";

// ===== Players =====

export const mockPlayers: Player[] = [
  { id: "p1", name: "武 (Takeshi)", role: "leader", joinedAt: "2024-01-15" },
  { id: "p2", name: "優希 (Yuki)", role: "member", joinedAt: "2024-02-01" },
  { id: "p3", name: "涼 (Ryo)", role: "member", joinedAt: "2024-03-10" },
  { id: "p4", name: "陽斗 (Haruto)", role: "member", joinedAt: "2024-04-20" },
];

// ===== Sessions (multi-currency) =====

export const mockSessions: Session[] = [
  {
    id: "s1", sessionDate: "2025-02-01", date: "2025-02-01", startTime: "20:00", endTime: "02:30",
    venue: "live", location: "東京ポーカークラブ", gameType: "NLH", stakes: "1/2",
    buyIn: 300, cashOut: 785, profit: 485, currency: "USD",
    exchangeRate: 150, buyInJpy: 45000, cashOutJpy: 117750, profitJpy: 72750,
    status: "SETTLED", durationMinutes: 390,
    notes: "テーブルが非常にルースだった。バリューベットを多めに。",
    playerId: "p1", createdAt: "2025-02-01T20:00:00Z", updatedAt: "2025-02-02T02:30:00Z",
  },
  {
    id: "s2", sessionDate: "2025-01-28", date: "2025-01-28", startTime: "19:00", endTime: "23:45",
    venue: "online", location: "PokerStars", gameType: "NLH", stakes: "0.5/1",
    buyIn: 200, cashOut: 142, profit: -58, currency: "USD",
    exchangeRate: 150, buyInJpy: 30000, cashOutJpy: 21300, profitJpy: -8700,
    status: "SETTLED", durationMinutes: 285,
    notes: "ティルト気味だった。ブレイクをもっと取るべきだった。",
    playerId: "p1", createdAt: "2025-01-28T19:00:00Z", updatedAt: "2025-01-29T00:00:00Z",
  },
  {
    id: "s3", sessionDate: "2025-01-25", date: "2025-01-25", startTime: "21:00", endTime: "03:00",
    venue: "live", location: "横浜カジノバー", gameType: "PLO", stakes: "1/2",
    buyIn: 500, cashOut: 1230, profit: 730, currency: "USD",
    exchangeRate: 150, buyInJpy: 75000, cashOutJpy: 184500, profitJpy: 109500,
    status: "SETTLED", durationMinutes: 360,
    notes: "PLOでナッツを引き続けた。非常に良いセッション。",
    playerId: "p1", createdAt: "2025-01-25T21:00:00Z", updatedAt: "2025-01-26T03:00:00Z",
  },
  {
    id: "s4", sessionDate: "2025-01-22", date: "2025-01-22", startTime: "22:00", endTime: "01:30",
    venue: "online", location: "GGPoker", gameType: "NLH", stakes: "0.25/0.5",
    buyIn: 100, cashOut: 88, profit: -12, currency: "USD",
    exchangeRate: 150, buyInJpy: 15000, cashOutJpy: 13200, profitJpy: -1800,
    status: "SETTLED", durationMinutes: 210,
    notes: "ショートセッション。特に大きなハンドなし。",
    playerId: "p1", createdAt: "2025-01-22T22:00:00Z", updatedAt: "2025-01-23T01:30:00Z",
  },
  {
    id: "s5", sessionDate: "2025-01-18", date: "2025-01-18", startTime: "20:00", endTime: "04:00",
    venue: "live", location: "東京ポーカークラブ", gameType: "NLH", stakes: "2/5",
    buyIn: 500, cashOut: 1450, profit: 950, currency: "USD",
    exchangeRate: 150, buyInJpy: 75000, cashOutJpy: 217500, profitJpy: 142500,
    status: "SETTLED", durationMinutes: 480,
    notes: "キープレイヤーのリークを特定。3BETレンジを広げて成功。",
    playerId: "p1", createdAt: "2025-01-18T20:00:00Z", updatedAt: "2025-01-19T04:00:00Z",
  },
  {
    id: "s6", sessionDate: "2025-01-15", date: "2025-01-15", startTime: "19:30", endTime: "00:30",
    venue: "live", location: "大阪カードルーム", gameType: "NLH", stakes: "1/2",
    buyIn: 300, cashOut: 195, profit: -105, currency: "USD",
    exchangeRate: 150, buyInJpy: 45000, cashOutJpy: 29250, profitJpy: -15750,
    status: "SETTLED", durationMinutes: 300,
    notes: "クーラーが多かった。セットオーバーセットで大きくロスト。",
    playerId: "p1", createdAt: "2025-01-15T19:30:00Z", updatedAt: "2025-01-16T00:30:00Z",
  },
  {
    id: "s7", sessionDate: "2025-01-12", date: "2025-01-12", startTime: "21:00", endTime: "02:00",
    venue: "online", location: "PokerStars", gameType: "NLH", stakes: "0.5/1",
    buyIn: 200, cashOut: 365, profit: 165, currency: "USD",
    exchangeRate: 150, buyInJpy: 30000, cashOutJpy: 54750, profitJpy: 24750,
    status: "SETTLED", durationMinutes: 300,
    notes: "堅実にプレイ。ブラフキャッチが上手くいった。",
    playerId: "p1", createdAt: "2025-01-12T21:00:00Z", updatedAt: "2025-01-13T02:00:00Z",
  },
  {
    id: "s8", sessionDate: "2025-01-08", date: "2025-01-08", startTime: "20:00", endTime: "01:00",
    venue: "live", location: "東京ポーカークラブ", gameType: "NLH", stakes: "1/2",
    buyIn: 300, cashOut: 520, profit: 220, currency: "USD",
    exchangeRate: 150, buyInJpy: 45000, cashOutJpy: 78000, profitJpy: 33000,
    status: "SETTLED", durationMinutes: 300,
    notes: "ポジションを意識したプレイが奏功。",
    playerId: "p1", createdAt: "2025-01-08T20:00:00Z", updatedAt: "2025-01-09T01:00:00Z",
  },
  {
    id: "s9", sessionDate: "2025-01-05", date: "2025-01-05", startTime: "18:00", endTime: "22:30",
    venue: "online", location: "GGPoker", gameType: "PLO", stakes: "0.5/1",
    buyIn: 200, cashOut: 310, profit: 110, currency: "USD",
    exchangeRate: 150, buyInJpy: 30000, cashOutJpy: 46500, profitJpy: 16500,
    status: "SETTLED", durationMinutes: 270,
    notes: "PLOの練習セッション。ハンドセレクションを改善。",
    playerId: "p1", createdAt: "2025-01-05T18:00:00Z", updatedAt: "2025-01-05T22:30:00Z",
  },
  {
    id: "s10", sessionDate: "2025-01-02", date: "2025-01-02", startTime: "21:00", endTime: "03:30",
    venue: "live", location: "東京ポーカークラブ", gameType: "NLH", stakes: "2/5",
    buyIn: 500, cashOut: 320, profit: -180, currency: "USD",
    exchangeRate: 150, buyInJpy: 75000, cashOutJpy: 48000, profitJpy: -27000,
    status: "SETTLED", durationMinutes: 390,
    notes: "新年で酔ったプレイヤーが多かったが、自分もコンディション悪かった。",
    playerId: "p1", createdAt: "2025-01-02T21:00:00Z", updatedAt: "2025-01-03T03:30:00Z",
  },
  {
    id: "s11", sessionDate: "2024-12-28", date: "2024-12-28", startTime: "20:00", endTime: "02:00",
    venue: "live", location: "秋葉原ポーカーバー", gameType: "NLH", stakes: "100/200",
    buyIn: 30000, cashOut: 52000, profit: 22000, currency: "JPY",
    exchangeRate: 1, buyInJpy: 30000, cashOutJpy: 52000, profitJpy: 22000,
    status: "SETTLED", durationMinutes: 360,
    notes: "円建てライブ。テーブルのレベルが低く、安定して勝てた。",
    playerId: "p1", createdAt: "2024-12-28T20:00:00Z", updatedAt: "2024-12-29T02:00:00Z",
  },
  {
    id: "s12", sessionDate: "2025-02-05", date: "2025-02-05", startTime: "20:00", endTime: "01:00",
    venue: "live", location: "マニラ遠征", gameType: "NLH", stakes: "100/200",
    buyIn: 50000, cashOut: 78000, profit: 28000, currency: "PHP",
    exchangeRate: 2.65, buyInJpy: 132500, cashOutJpy: 206700, profitJpy: 74200,
    status: "SETTLED", durationMinutes: 300,
    notes: "マニラ遠征。ルースなテーブルで安定して利益を出せた。フィリピンのライブポーカーシーンは活気がある。",
    playerId: "p1", createdAt: "2025-02-05T20:00:00Z", updatedAt: "2025-02-06T01:00:00Z",
  },
  {
    id: "s13", sessionDate: "2025-02-08", date: "2025-02-08", startTime: "19:00", endTime: "01:00",
    venue: "live", location: "ソウルポーカークラブ", gameType: "NLH", stakes: "5K/10K",
    buyIn: 500000, cashOut: 720000, profit: 220000, currency: "KRW",
    exchangeRate: 0.11, buyInJpy: 55000, cashOutJpy: 79200, profitJpy: 24200,
    status: "SETTLED", durationMinutes: 360,
    notes: "ソウル遠征。韓国のレギュラーは堅いが、ポジションプレイで勝ち越し。",
    playerId: "p1", createdAt: "2025-02-08T19:00:00Z", updatedAt: "2025-02-09T01:00:00Z",
  },
];

// ===== Hand Comments =====

const mockComments: HandComment[] = [
  {
    id: "c1", handId: "h1", playerId: "p2", playerName: "優希 (Yuki)",
    content: "フロップのCBサイズは2/3より1/2の方がGTO的には良いかも。ドライボードだしポラライズする必要ないよね。",
    createdAt: "2025-02-02T10:00:00Z",
  },
  {
    id: "c2", handId: "h1", playerId: "p1", playerName: "武 (Takeshi)",
    content: "確かに。ソルバーだとこのボードテクスチャーでは33%ベットが多いね。次回から意識する。",
    parentId: "c1", createdAt: "2025-02-02T10:30:00Z",
  },
  {
    id: "c3", handId: "h1", playerId: "p3", playerName: "涼 (Ryo)",
    content: "リバーのベットサイズはもっと大きくても良かったかも。相手のAx系はかなりインエラスティックだし。",
    createdAt: "2025-02-02T11:00:00Z",
  },
  {
    id: "c4", handId: "h2", playerId: "p4", playerName: "陽斗 (Haruto)",
    content: "ターンでのスロープレイは最高の判断。相手にリバーでオーバーベットさせる余地を残したのが良い。",
    createdAt: "2025-02-02T12:00:00Z",
  },
  {
    id: "c5", handId: "h3", playerId: "p2", playerName: "優希 (Yuki)",
    content: "セットオーバーセットはどうしようもないけど、ターンのチェックレイズサイズは2.5xより3xの方がいいかも。",
    createdAt: "2025-01-29T09:00:00Z",
  },
];

// ===== Hand Histories =====

export const mockHands: HandHistory[] = [
  {
    id: "h1", sessionId: "s1", date: "2025-02-01", gameType: "NLH", stakes: "1/2",
    heroPosition: "BTN", currency: "USD",
    heroCards: [{ rank: "A", suit: "s" }, { rank: "K", suit: "h" }],
    streets: [
      {
        street: "preflop",
        actions: [
          { position: "UTG", action: "fold", isHero: false },
          { position: "MP", action: "raise", amount: 6, isHero: false },
          { position: "CO", action: "fold", isHero: false },
          { position: "BTN", action: "3bet", amount: 18, isHero: true },
          { position: "SB", action: "fold", isHero: false },
          { position: "BB", action: "fold", isHero: false },
          { position: "MP", action: "call", amount: 18, isHero: false },
        ],
        potSize: 39, board: [],
        thoughtProcess: "MPのオープンレンジは広め。AKsはBTNから**3BET**してイニシアチブを取る。\n\n4BETされたら：\n- コールかフォールドのミックス戦略\n- SPRを考慮してスタックオフも視野に",
      },
      {
        street: "flop",
        actions: [
          { position: "MP", action: "check", isHero: false },
          { position: "BTN", action: "bet", amount: 25, isHero: true },
          { position: "MP", action: "call", amount: 25, isHero: false },
        ],
        potSize: 89,
        board: [{ rank: "A", suit: "d" }, { rank: "7", suit: "c" }, { rank: "3", suit: "s" }],
        thoughtProcess: "**TPTK**をヒット。ドライボードなのでポットの2/3サイズでバリューベット。\n\n相手のコールレンジ：\n- Ax（AQ, AJ, AT）\n- 77\n- ポケットペア（TT-QQ）",
      },
      {
        street: "turn",
        actions: [
          { position: "MP", action: "check", isHero: false },
          { position: "BTN", action: "bet", amount: 60, isHero: true },
          { position: "MP", action: "call", amount: 60, isHero: false },
        ],
        potSize: 209,
        board: [{ rank: "A", suit: "d" }, { rank: "7", suit: "c" }, { rank: "3", suit: "s" }, { rank: "T", suit: "h" }],
        thoughtProcess: "ターンのTはあまりテクスチャーを変えない。引き続きバリューベット。\n\n> 相手がまだコールしてくるならAQ, AJ, ATあたり。",
      },
      {
        street: "river",
        actions: [
          { position: "MP", action: "check", isHero: false },
          { position: "BTN", action: "bet", amount: 100, isHero: true },
          { position: "MP", action: "call", amount: 100, isHero: false },
        ],
        potSize: 409,
        board: [{ rank: "A", suit: "d" }, { rank: "7", suit: "c" }, { rank: "3", suit: "s" }, { rank: "T", suit: "h" }, { rank: "2", suit: "d" }],
        thoughtProcess: "リバーは`2d`でブランク。3ストリートのバリューベットで相手のAx系からマックスバリューを取る。\n\nオーバーベットも検討したが、相手のコールレンジを考慮してポットの半分程度に。",
      },
    ],
    pot: 409, result: 203,
    tags: ["VALUE_BET", "3BET", "CONFIDENT", "KEY_HAND"],
    notes: "典型的な3BETポットでのバリューライン。全ストリートでバリューを取り切った。",
    comments: mockComments.filter((c) => c.handId === "h1"),
    playerId: "p1", createdAt: "2025-02-01T21:30:00Z", updatedAt: "2025-02-01T21:30:00Z",
  },
  {
    id: "h2", sessionId: "s1", date: "2025-02-01", gameType: "NLH", stakes: "1/2",
    heroPosition: "CO", currency: "USD",
    heroCards: [{ rank: "Q", suit: "h" }, { rank: "J", suit: "h" }],
    streets: [
      {
        street: "preflop",
        actions: [
          { position: "UTG", action: "fold", isHero: false },
          { position: "MP", action: "fold", isHero: false },
          { position: "CO", action: "raise", amount: 6, isHero: true },
          { position: "BTN", action: "call", amount: 6, isHero: false },
          { position: "SB", action: "fold", isHero: false },
          { position: "BB", action: "call", amount: 6, isHero: false },
        ],
        potSize: 19, board: [],
        thoughtProcess: "QJsはCOからスタンダードオープン。マルチウェイになる可能性があるが、ポジションとスートの強みで参加。",
      },
      {
        street: "flop",
        actions: [
          { position: "BB", action: "check", isHero: false },
          { position: "CO", action: "bet", amount: 12, isHero: true },
          { position: "BTN", action: "fold", isHero: false },
          { position: "BB", action: "raise", amount: 35, isHero: false },
          { position: "CO", action: "call", amount: 35, isHero: true },
        ],
        potSize: 89,
        board: [{ rank: "T", suit: "h" }, { rank: "9", suit: "h" }, { rank: "4", suit: "c" }],
        thoughtProcess: "フラッシュドローとOESD。BBのチェックレイズに対して、ドローイングハンドとしてコール。",
      },
      {
        street: "turn",
        actions: [
          { position: "BB", action: "bet", amount: 65, isHero: false },
          { position: "CO", action: "call", amount: 65, isHero: true },
        ],
        potSize: 219,
        board: [{ rank: "T", suit: "h" }, { rank: "9", suit: "h" }, { rank: "4", suit: "c" }, { rank: "K", suit: "d" }],
        thoughtProcess: "Kが落ちてストレートが完成。スロープレイしてリバーでバリューを最大化。",
      },
      {
        street: "river",
        actions: [
          { position: "BB", action: "bet", amount: 90, isHero: false },
          { position: "CO", action: "raise", amount: 220, isHero: true },
          { position: "BB", action: "call", amount: 220, isHero: false },
        ],
        potSize: 659,
        board: [{ rank: "T", suit: "h" }, { rank: "9", suit: "h" }, { rank: "4", suit: "c" }, { rank: "K", suit: "d" }, { rank: "3", suit: "h" }],
        thoughtProcess: "リバーでフラッシュも完成！**ナッツフラッシュ**。相手のベットに対してレイズ。フラッシュに見えにくいラインなのでバリューレイズ。",
      },
    ],
    pot: 659, result: 439,
    tags: ["SLOW_PLAY", "VALUE_BET", "GREAT_PLAY", "TEAM_SHARE"],
    notes: "ストレートからフラッシュに改善したドリームハンド。チーム共有推奨。",
    comments: mockComments.filter((c) => c.handId === "h2"),
    playerId: "p1", createdAt: "2025-02-01T23:15:00Z", updatedAt: "2025-02-01T23:15:00Z",
  },
  {
    id: "h3", sessionId: "s2", date: "2025-01-28", gameType: "NLH", stakes: "0.5/1",
    heroPosition: "BB", currency: "USD",
    heroCards: [{ rank: "8", suit: "d" }, { rank: "8", suit: "c" }],
    streets: [
      {
        street: "preflop",
        actions: [
          { position: "CO", action: "raise", amount: 2.5, isHero: false },
          { position: "BTN", action: "call", amount: 2.5, isHero: false },
          { position: "SB", action: "fold", isHero: false },
          { position: "BB", action: "call", amount: 2.5, isHero: true },
        ],
        potSize: 8, board: [],
        thoughtProcess: "88はBBからマルチウェイでセットマイニング。インプライドオッズは十分。",
      },
      {
        street: "flop",
        actions: [
          { position: "BB", action: "check", isHero: true },
          { position: "CO", action: "bet", amount: 5, isHero: false },
          { position: "BTN", action: "call", amount: 5, isHero: false },
          { position: "BB", action: "call", amount: 5, isHero: true },
        ],
        potSize: 23,
        board: [{ rank: "8", suit: "h" }, { rank: "5", suit: "s" }, { rank: "2", suit: "d" }],
        thoughtProcess: "**セットヒット！**ドライボードなのでスロープレイ。チェックコールでポットをビルド。",
      },
      {
        street: "turn",
        actions: [
          { position: "BB", action: "check", isHero: true },
          { position: "CO", action: "bet", amount: 15, isHero: false },
          { position: "BTN", action: "fold", isHero: false },
          { position: "BB", action: "raise", amount: 42, isHero: true },
          { position: "CO", action: "all-in", amount: 90, isHero: false },
          { position: "BB", action: "call", amount: 90, isHero: true },
        ],
        potSize: 218,
        board: [{ rank: "8", suit: "h" }, { rank: "5", suit: "s" }, { rank: "2", suit: "d" }, { rank: "6", suit: "h" }],
        thoughtProcess: "ターンで6が落ちてストレートの可能性が出てきたが、セットはまだ非常に強い。\n\n`チェックレイズ`でバリューを最大化。相手のオールインは喜んでコール。",
      },
    ],
    pot: 218, result: -100,
    tags: ["CHECK_RAISE", "TILT_CHECK", "MISTAKE", "SOLVER_NEEDED", "GTO_DEVIATION"],
    notes: "セットオーバーセットでバッドビート。相手は55でフロップでセット。ターンのチェックレイズのサイジングを再検討する必要あり。",
    comments: mockComments.filter((c) => c.handId === "h3"),
    playerId: "p1", createdAt: "2025-01-28T20:45:00Z", updatedAt: "2025-01-28T20:45:00Z",
  },
];

// ===== Player Stats (JPY base currency) =====

export const mockStats: PlayerStats = {
  totalSessions: mockSessions.length,
  totalHands: 2847,
  totalProfitJpy: mockSessions.reduce((sum, s) => sum + s.profitJpy, 0),
  totalProfitUsd: Math.round(mockSessions.reduce((sum, s) => sum + s.profitJpy, 0) / 150),
  totalHours: Math.round(mockSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60),
  hourlyRateJpy: Math.round(
    (mockSessions.reduce((sum, s) => sum + s.profitJpy, 0) /
      mockSessions.reduce((sum, s) => sum + s.durationMinutes, 0)) * 60
  ),
  winRate: Math.round(
    (mockSessions.filter((s) => s.profit > 0).length / mockSessions.length) * 100
  ),
  bbPer100: 8.3,
  bestSessionJpy: Math.max(...mockSessions.map((s) => s.profitJpy)),
  worstSessionJpy: Math.min(...mockSessions.map((s) => s.profitJpy)),
  currentStreak: 3,
  profitByGameType: {
    NLH: mockSessions.filter((s) => s.gameType === "NLH").reduce((sum, s) => sum + s.profitJpy, 0),
    PLO: mockSessions.filter((s) => s.gameType === "PLO").reduce((sum, s) => sum + s.profitJpy, 0),
    PLO5: 0,
    Mixed: 0,
  },
  profitByVenue: {
    live: mockSessions.filter((s) => s.venue === "live").reduce((sum, s) => sum + s.profitJpy, 0),
    online: mockSessions.filter((s) => s.venue === "online").reduce((sum, s) => sum + s.profitJpy, 0),
  },
  profitByCurrency: {
    USD: mockSessions.filter((s) => s.currency === "USD").reduce((sum, s) => sum + s.profit, 0),
    JPY: mockSessions.filter((s) => s.currency === "JPY").reduce((sum, s) => sum + s.profit, 0),
    PHP: mockSessions.filter((s) => s.currency === "PHP").reduce((sum, s) => sum + s.profit, 0),
    KRW: mockSessions.filter((s) => s.currency === "KRW").reduce((sum, s) => sum + s.profit, 0),
  },
  monthlyProfitJpy: [
    { month: "2024-08", profitJpy: 48000 },
    { month: "2024-09", profitJpy: -22500 },
    { month: "2024-10", profitJpy: 102000 },
    { month: "2024-11", profitJpy: 67500 },
    { month: "2024-12", profitJpy: mockSessions.filter((s) => s.sessionDate.startsWith("2024-12")).reduce((sum, s) => sum + s.profitJpy, 0) },
    { month: "2025-01", profitJpy: mockSessions.filter((s) => s.sessionDate.startsWith("2025-01")).reduce((sum, s) => sum + s.profitJpy, 0) },
    { month: "2025-02", profitJpy: mockSessions.filter((s) => s.sessionDate.startsWith("2025-02")).reduce((sum, s) => sum + s.profitJpy, 0) },
  ],
};

// ===== Team Member Stats =====

export const teamMemberStats: Record<string, PlayerStats> = {
  p1: mockStats,
  p2: {
    ...mockStats,
    totalProfitJpy: 187500, totalProfitUsd: 1250, hourlyRateJpy: 2700,
    winRate: 55, bbPer100: 5.2,
    bestSessionJpy: 60000, worstSessionJpy: -22500,
    profitByCurrency: { USD: 1250 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 22500 }, { month: "2024-09", profitJpy: 30000 },
      { month: "2024-10", profitJpy: -15000 }, { month: "2024-11", profitJpy: 45000 },
      { month: "2024-12", profitJpy: 27000 }, { month: "2025-01", profitJpy: 63000 },
      { month: "2025-02", profitJpy: 15000 },
    ],
  },
  p3: {
    ...mockStats,
    totalProfitJpy: -48000, totalProfitUsd: -320, hourlyRateJpy: -750,
    winRate: 40, bbPer100: -2.1,
    bestSessionJpy: 15000, worstSessionJpy: -37500,
    profitByCurrency: { USD: -320 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 12000 }, { month: "2024-09", profitJpy: -37500 },
      { month: "2024-10", profitJpy: 15000 }, { month: "2024-11", profitJpy: -27000 },
      { month: "2024-12", profitJpy: -10500 }, { month: "2025-01", profitJpy: 7500 },
      { month: "2025-02", profitJpy: -7500 },
    ],
  },
  p4: {
    ...mockStats,
    totalProfitJpy: 133500, totalProfitUsd: 890, hourlyRateJpy: 1800,
    winRate: 52, bbPer100: 4.5,
    bestSessionJpy: 30000, worstSessionJpy: -15000,
    profitByCurrency: { USD: 890 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 30000 }, { month: "2024-09", profitJpy: 7500 },
      { month: "2024-10", profitJpy: 22500 }, { month: "2024-11", profitJpy: 18000 },
      { month: "2024-12", profitJpy: 12000 }, { month: "2025-01", profitJpy: 28500 },
      { month: "2025-02", profitJpy: 15000 },
    ],
  },
};

// ===== Range Library =====

const RANKS = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

function generateRangeGrid(
  raises: string[],
  calls: string[],
  threeBets: string[] = []
): Record<string, "raise" | "call" | "fold" | "3bet" | "mixed"> {
  const grid: Record<string, "raise" | "call" | "fold" | "3bet" | "mixed"> = {};
  for (const r1 of RANKS) {
    for (const r2 of RANKS) {
      const i1 = RANKS.indexOf(r1);
      const i2 = RANKS.indexOf(r2);
      const combo = i1 < i2 ? `${r1}${r2}s` : i1 > i2 ? `${r2}${r1}o` : `${r1}${r2}`;
      if (threeBets.includes(combo)) grid[combo] = "3bet";
      else if (raises.includes(combo)) grid[combo] = "raise";
      else if (calls.includes(combo)) grid[combo] = "call";
      else grid[combo] = "fold";
    }
  }
  return grid;
}

export const mockRanges: RangeChart[] = [
  {
    id: "r1", title: "BTN オープンレンジ", description: "6-maxでのBTNからの標準オープンレンジ。約40%のハンドをレイズ。",
    position: "BTN", situation: "RFI (レイズファーストイン)",
    grid: generateRangeGrid(
      ["AA","KK","QQ","JJ","TT","99","88","77","66","55","44","33","22","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","KQs","KJs","KTs","K9s","K8s","K7s","QJs","QTs","Q9s","Q8s","JTs","J9s","J8s","T9s","T8s","98s","97s","87s","86s","76s","75s","65s","64s","54s","AKo","AQo","AJo","ATo","A9o","KQo","KJo","KTo","QJo","QTo","JTo","J9o","T9o"],
      []
    ),
    createdBy: "p1", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "r2", title: "BB vs BTN 3ベットレンジ", description: "BBからBTNのオープンに対する3ベットレンジ。バリューとブラフのバランス。",
    position: "BB", situation: "3BET vs BTN Open",
    grid: generateRangeGrid(
      [],
      ["ATs","A9s","A8s","A7s","KJs","KTs","K9s","QJs","QTs","JTs","J9s","T9s","98s","87s","76s","65s","AJo","ATo","KQo","KJo","QJo"],
      ["AA","KK","QQ","JJ","TT","AKs","AQs","AJs","A5s","A4s","KQs","AKo","AQo"]
    ),
    createdBy: "p1", createdAt: "2025-01-05T00:00:00Z",
  },
];
