import type {
  Session,
  HandHistory,
  Player,
  PlayerStats,
  HandComment,
  RangeChart,
  RangeAction,
} from "@/types/poker";
import type { PokerCurrency } from "@/lib/currency";
import type { OpponentNote, MemberActivity } from "@/lib/poker-spots";

// ===== Players =====

export const mockPlayers: Player[] = [
  { id: "p1", name: "おにく", role: "leader", joinedAt: "2024-01-15", primarySpotId: "roots" },
  { id: "p2", name: "タカ", role: "member", joinedAt: "2024-02-01", primarySpotId: "ggpl" },
  { id: "p3", name: "バスロもっちバイヤグラ", role: "member", joinedAt: "2024-02-20", primarySpotId: "casino-stadium" },
  { id: "p4", name: "ノセ", role: "member", joinedAt: "2024-03-10", primarySpotId: "poker-live" },
  { id: "p5", name: "便座", role: "member", joinedAt: "2024-04-01", primarySpotId: "blow" },
  { id: "p6", name: "ロキソニン陸斗", role: "member", joinedAt: "2024-05-15", primarySpotId: "jackpot" },
  { id: "p7", name: "だーふく", role: "member", joinedAt: "2024-06-01", primarySpotId: "universe" },
  { id: "p8", name: "コロッケ", role: "member", joinedAt: "2024-07-20", primarySpotId: "guild" },
  { id: "p9", name: "ぱいぱんコニー", role: "member", joinedAt: "2024-09-01", primarySpotId: "iris" },
];

// ===== Sessions (multi-currency) =====

export const mockSessions: Session[] = [
  {
    id: "s1", sessionDate: "2025-02-01", date: "2025-02-01", startTime: "20:00", endTime: "02:30",
    venue: "live", location: "ROOTS OSAKA", spotId: "roots", gameType: "NLH", stakes: "100/200",
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
    venue: "live", location: "GGPL OSAKA", spotId: "ggpl", gameType: "NLH", stakes: "200/400",
    buyIn: 500, cashOut: 1450, profit: 950, currency: "USD",
    exchangeRate: 150, buyInJpy: 75000, cashOutJpy: 217500, profitJpy: 142500,
    status: "SETTLED", durationMinutes: 480,
    notes: "キープレイヤーのリークを特定。3BETレンジを広げて成功。",
    playerId: "p1", createdAt: "2025-01-18T20:00:00Z", updatedAt: "2025-01-19T04:00:00Z",
  },
  {
    id: "s6", sessionDate: "2025-01-15", date: "2025-01-15", startTime: "19:30", endTime: "00:30",
    venue: "live", location: "POKER LIVE OSAKA", spotId: "poker-live", gameType: "NLH", stakes: "100/200",
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
    venue: "live", location: "BLOW", spotId: "blow", gameType: "NLH", stakes: "100/200",
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
    venue: "live", location: "UNIVERSE", spotId: "universe", gameType: "NLH", stakes: "200/400",
    buyIn: 500, cashOut: 320, profit: -180, currency: "USD",
    exchangeRate: 150, buyInJpy: 75000, cashOutJpy: 48000, profitJpy: -27000,
    status: "SETTLED", durationMinutes: 390,
    notes: "新年で酔ったプレイヤーが多かったが、自分もコンディション悪かった。",
    playerId: "p1", createdAt: "2025-01-02T21:00:00Z", updatedAt: "2025-01-03T03:30:00Z",
  },
  {
    id: "s11", sessionDate: "2024-12-28", date: "2024-12-28", startTime: "20:00", endTime: "02:00",
    venue: "live", location: "Jerrys", spotId: "jerrys", gameType: "NLH", stakes: "100/200",
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
    id: "c1", handId: "h1", playerId: "p2", playerName: "タカ",
    content: "フロップのCBサイズは2/3より1/2の方がGTO的には良いかも。ドライボードだしポラライズする必要ないよね。",
    createdAt: "2025-02-02T10:00:00Z",
  },
  {
    id: "c2", handId: "h1", playerId: "p1", playerName: "おにく",
    content: "確かに。ソルバーだとこのボードテクスチャーでは33%ベットが多いね。次回から意識する。",
    parentId: "c1", createdAt: "2025-02-02T10:30:00Z",
  },
  {
    id: "c3", handId: "h1", playerId: "p4", playerName: "ノセ",
    content: "リバーのベットサイズはもっと大きくても良かったかも。相手のAx系はかなりインエラスティックだし。",
    createdAt: "2025-02-02T11:00:00Z",
  },
  {
    id: "c4", handId: "h2", playerId: "p5", playerName: "便座",
    content: "ターンでのスロープレイは最高の判断。相手にリバーでオーバーベットさせる余地を残したのが良い。",
    createdAt: "2025-02-02T12:00:00Z",
  },
  {
    id: "c5", handId: "h3", playerId: "p2", playerName: "タカ",
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
    totalProfitJpy: 245000, totalProfitUsd: 1633, hourlyRateJpy: 3200,
    winRate: 62, bbPer100: 7.1,
    bestSessionJpy: 75000, worstSessionJpy: -18000,
    profitByCurrency: { USD: 1633 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 35000 }, { month: "2024-09", profitJpy: 42000 },
      { month: "2024-10", profitJpy: 28000 }, { month: "2024-11", profitJpy: 38000 },
      { month: "2024-12", profitJpy: 32000 }, { month: "2025-01", profitJpy: 45000 },
      { month: "2025-02", profitJpy: 25000 },
    ],
  },
  p4: {
    ...mockStats,
    totalProfitJpy: 310000, totalProfitUsd: 2067, hourlyRateJpy: 4100,
    winRate: 65, bbPer100: 8.8,
    bestSessionJpy: 95000, worstSessionJpy: -12000,
    profitByCurrency: { USD: 2067 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 40000 }, { month: "2024-09", profitJpy: 55000 },
      { month: "2024-10", profitJpy: 38000 }, { month: "2024-11", profitJpy: 52000 },
      { month: "2024-12", profitJpy: 45000 }, { month: "2025-01", profitJpy: 50000 },
      { month: "2025-02", profitJpy: 30000 },
    ],
  },
  p5: {
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
  p6: {
    ...mockStats,
    totalProfitJpy: 95000, totalProfitUsd: 633, hourlyRateJpy: 1500,
    winRate: 52, bbPer100: 3.5,
    bestSessionJpy: 35000, worstSessionJpy: -20000,
    profitByCurrency: { USD: 633 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 18000 }, { month: "2024-09", profitJpy: 8000 },
      { month: "2024-10", profitJpy: 22000 }, { month: "2024-11", profitJpy: -5000 },
      { month: "2024-12", profitJpy: 15000 }, { month: "2025-01", profitJpy: 25000 },
      { month: "2025-02", profitJpy: 12000 },
    ],
  },
  p7: {
    ...mockStats,
    totalProfitJpy: 12000, totalProfitUsd: 80, hourlyRateJpy: 200,
    winRate: 48, bbPer100: 0.5,
    bestSessionJpy: 20000, worstSessionJpy: -25000,
    profitByCurrency: { USD: 80 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 5000 }, { month: "2024-09", profitJpy: -12000 },
      { month: "2024-10", profitJpy: 8000 }, { month: "2024-11", profitJpy: 15000 },
      { month: "2024-12", profitJpy: -8000 }, { month: "2025-01", profitJpy: 4000 },
      { month: "2025-02", profitJpy: 0 },
    ],
  },
  p8: {
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
  p9: {
    ...mockStats,
    totalProfitJpy: 78000, totalProfitUsd: 520, hourlyRateJpy: 1100,
    winRate: 50, bbPer100: 2.8,
    bestSessionJpy: 28000, worstSessionJpy: -18000,
    profitByCurrency: { USD: 520 },
    monthlyProfitJpy: [
      { month: "2024-08", profitJpy: 10000 }, { month: "2024-09", profitJpy: 15000 },
      { month: "2024-10", profitJpy: -5000 }, { month: "2024-11", profitJpy: 20000 },
      { month: "2024-12", profitJpy: 12000 }, { month: "2025-01", profitJpy: 18000 },
      { month: "2025-02", profitJpy: 8000 },
    ],
  },
};

// ===== Range Library =====

const RANKS = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

function generateRangeGrid(
  raises: string[],
  calls: string[],
  threeBets: string[] = [],
  mixed: Record<string, RangeAction> = {},
): Record<string, RangeAction> {
  const grid: Record<string, RangeAction> = {};
  for (const r1 of RANKS) {
    for (const r2 of RANKS) {
      const i1 = RANKS.indexOf(r1);
      const i2 = RANKS.indexOf(r2);
      const combo = i1 < i2 ? `${r1}${r2}s` : i1 > i2 ? `${r2}${r1}o` : `${r1}${r2}`;
      if (mixed[combo]) grid[combo] = mixed[combo];
      else if (threeBets.includes(combo)) grid[combo] = "3bet";
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
  {
    id: "r3", title: "CO vs BTN 3BET ディフェンス", description: "COオープンに対するBTNの3BETへのディフェンス。GTO混合戦略を含む高精度レンジ。",
    position: "CO", situation: "3BET Defense vs BTN 3BET",
    grid: generateRangeGrid(
      // Pure 4bet (treated as raise for simplicity)
      [],
      // Pure calls
      ["AJs","ATs","KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s","87s","AQo","AJo","KQo"],
      // Pure 3bet/4bet
      ["AA","KK"],
      // Mixed strategies
      {
        "QQ": { raise: 55, call: 45 },
        "JJ": { raise: 35, call: 65 },
        "TT": { raise: 20, call: 80 },
        "99": { call: 70, fold: 30 },
        "88": { call: 55, fold: 45 },
        "77": { call: 40, fold: 60 },
        "AKs": { raise: 60, call: 40 },
        "AQs": { raise: 40, call: 60 },
        "A5s": { raise: 70, fold: 30 },
        "A4s": { raise: 55, fold: 45 },
        "A3s": { fold: 65, raise: 35 },
        "KQo": { call: 65, fold: 35 },
        "AKo": { raise: 50, call: 50 },
        "ATo": { call: 45, fold: 55 },
        "K9s": { call: 50, fold: 50 },
        "Q9s": { call: 35, fold: 65 },
        "J9s": { call: 45, fold: 55 },
        "76s": { call: 40, fold: 60 },
        "65s": { call: 35, fold: 65 },
      },
    ),
    createdBy: "p1", createdAt: "2025-01-10T00:00:00Z",
  },
];

// ===== Opponent Notes (Team Intelligence) =====

export const mockOpponentNotes: OpponentNote[] = [
  {
    id: "opp1",
    opponentName: "山田さん",
    spotId: "roots",
    tags: ["CALLING_STATION", "WEAK_POSTFLOP"],
    notes: "プリフロップは広くコール。フロップ以降はペアがないと降りる。2バレルで落ちやすい。",
    stakes: "100/200",
    skillRating: 2,
    physicalDescription: "30代男性。黒いパーカーにキャップ。ポットを落とすと首を触る癖あり。",
    betSizingNotes: "バリューは常にポット50%。ブラフ時は33%が多い。オーバーベットは皆無。",
    encounters: [
      { date: "2025-02-01", spotId: "roots", stakes: "100/200", result: "win", note: "2バレルで降ろした" },
      { date: "2025-01-20", spotId: "roots", stakes: "100/200", result: "win", note: "リバーバリュー成功" },
      { date: "2025-01-10", spotId: "roots", stakes: "100/200", result: "neutral" },
    ],
    lastSeen: "2025-02-01",
    createdBy: "p1",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "opp2",
    opponentName: "Kenさん",
    spotId: "roots",
    tags: ["REG", "TAG", "POSITIONAL_AWARE"],
    notes: "堅いレギュラー。IPからのCBET頻度が高い。OOPではチェックレイズが多い。3BETレンジは狭い。",
    stakes: "200/400",
    skillRating: 4,
    physicalDescription: "40代。眼鏡、ポロシャツ。落ち着いた雰囲気。サングラスは使わない。",
    betSizingNotes: "CBETは常に67%。3BETサイズは3.5x。リバーはポラライズ寄り（75%か33%）。",
    encounters: [
      { date: "2025-01-25", spotId: "roots", stakes: "200/400", result: "loss", note: "3BETポットでCR食らった" },
      { date: "2025-01-15", spotId: "roots", stakes: "200/400", result: "neutral" },
    ],
    lastSeen: "2025-01-25",
    createdBy: "p1",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-25T00:00:00Z",
  },
  {
    id: "opp3",
    opponentName: "マサ",
    spotId: "poker-live",
    tags: ["FISH", "TILT_PRONE"],
    notes: "ルースパッシブ。大きなポットを負けるとティルト気味になる。ティルト時はブラフキャッチが増える。",
    stakes: "100/200",
    skillRating: 1,
    physicalDescription: "20代後半。赤いスニーカーが目印。負けるとため息が多い。スマホを頻繁に見る。",
    betSizingNotes: "ベットサイズ不安定。強い手で大きく、弱い手で小さくなる傾向。",
    encounters: [
      { date: "2025-01-28", spotId: "poker-live", stakes: "100/200", result: "win", note: "ティルト後にスタック奪取" },
      { date: "2025-01-15", spotId: "poker-live", stakes: "100/200", result: "win" },
      { date: "2025-01-05", spotId: "poker-live", stakes: "100/200", result: "win" },
      { date: "2024-12-28", spotId: "poker-live", stakes: "100/200", result: "neutral" },
    ],
    lastSeen: "2025-01-28",
    createdBy: "p3",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-28T00:00:00Z",
  },
  {
    id: "opp4",
    opponentName: "タツヤ",
    spotId: "ggpl",
    tags: ["LAG", "BLUFF_HEAVY", "OVERBET_FREQ"],
    notes: "アグレッシブなLAG。リバーのオーバーベットが多いがブラフ頻度も高い。コールダウンが有効。",
    stakes: "200/400",
    skillRating: 3,
    physicalDescription: "30代前半。革ジャンにチェーン。ブラフ時にチップを乱暴に投げる。",
    betSizingNotes: "バリューは常に67%ポラライズ。ブラフ時はオーバーベット(150%pot)を好む。",
    encounters: [
      { date: "2025-02-03", spotId: "ggpl", stakes: "200/400", result: "win", note: "リバーOBコールダウン成功" },
      { date: "2025-01-20", spotId: "ggpl", stakes: "200/400", result: "loss", note: "ブラフに降りた" },
    ],
    lastSeen: "2025-02-03",
    createdBy: "p2",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-02-03T00:00:00Z",
  },
  {
    id: "opp5",
    opponentName: "ユウキ先輩",
    spotId: "blow",
    tags: ["NITS", "SLOW_PLAY_HEAVY"],
    notes: "極端にタイト。プリフロップのレンジが非常に狭い。レイズにはモンスター警戒。スロープレイ多用。",
    stakes: "100/200",
    skillRating: 3,
    physicalDescription: "50代。白髪交じり。静かだが手が震える時はナッツ。",
    betSizingNotes: "ベットサイズが極端に小さい（25-33%）。大きいベット=ナッツの可能性高い。",
    encounters: [
      { date: "2025-01-20", spotId: "blow", stakes: "100/200", result: "neutral", note: "同卓2h、直接対決なし" },
    ],
    lastSeen: "2025-01-20",
    createdBy: "p4",
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
];

// ===== Member Activity (Pulse Data) =====

export const mockMemberActivity: MemberActivity[] = [
  { playerId: "p1", lastSessionDate: "2025-02-08", lastSpotId: "roots", currentStreak: 3, weeklyHours: 18, weeklyProfit: 96950, status: "on-fire" },
  { playerId: "p2", lastSessionDate: "2025-02-05", lastSpotId: "ggpl", currentStreak: 1, weeklyHours: 10, weeklyProfit: 15000, status: "active" },
  { playerId: "p3", lastSessionDate: "2025-02-07", lastSpotId: "casino-stadium", currentStreak: 2, weeklyHours: 14, weeklyProfit: 45000, status: "active" },
  { playerId: "p4", lastSessionDate: "2025-02-08", lastSpotId: "poker-live", currentStreak: 4, weeklyHours: 20, weeklyProfit: 72000, status: "on-fire" },
  { playerId: "p5", lastSessionDate: "2025-01-28", lastSpotId: "blow", currentStreak: -2, weeklyHours: 5, weeklyProfit: -7500, status: "cooling-down" },
  { playerId: "p6", lastSessionDate: "2025-02-06", lastSpotId: "jackpot", currentStreak: 1, weeklyHours: 8, weeklyProfit: 12000, status: "active" },
  { playerId: "p7", lastSessionDate: "2025-01-20", lastSpotId: "universe", currentStreak: 0, weeklyHours: 0, weeklyProfit: 0, status: "resting" },
  { playerId: "p8", lastSessionDate: "2025-02-04", lastSpotId: "guild", currentStreak: 1, weeklyHours: 12, weeklyProfit: 28000, status: "active" },
  { playerId: "p9", lastSessionDate: "2025-02-03", lastSpotId: "iris", currentStreak: 0, weeklyHours: 6, weeklyProfit: 8500, status: "active" },
];

// ===== Activity Feed =====

export interface MockActivity {
  id: string;
  type: "session_start" | "session_end" | "hand_review" | "opponent_note" | "comment";
  title: string;
  detail?: string;
  userName: string;
  userInitial: string;
  userColor: string;
  createdAt: string;
  metadata?: {
    profitJpy?: number;
    spotName?: string;
    tags?: string[];
  };
}

export const mockActivities: MockActivity[] = [
  {
    id: "act-1",
    type: "session_end",
    title: "セッション終了",
    detail: "ROOTS OSAKA — +¥72,750 (6.5時間)",
    userName: "おにく",
    userInitial: "お",
    userColor: "#00FF9F",
    createdAt: "2025-02-07T02:30:00Z",
    metadata: { profitJpy: 72750, spotName: "ROOTS" },
  },
  {
    id: "act-2",
    type: "hand_review",
    title: "ハンドレビュー投稿",
    detail: "AKs 3BETポット — バリューライン成功",
    userName: "おにく",
    userInitial: "お",
    userColor: "#00FF9F",
    createdAt: "2025-02-07T10:00:00Z",
    metadata: { tags: ["VALUE_BET", "3BET"] },
  },
  {
    id: "act-3",
    type: "comment",
    title: "コメント追加",
    detail: "「フロップのCBサイズは2/3より1/2の方がGTO的には良いかも」",
    userName: "タカ",
    userInitial: "タ",
    userColor: "#F59E0B",
    createdAt: "2025-02-07T11:30:00Z",
  },
  {
    id: "act-4",
    type: "opponent_note",
    title: "相手メモ更新",
    detail: "タツヤ @ GGPL — LAG, ブラフ多い",
    userName: "タカ",
    userInitial: "タ",
    userColor: "#F59E0B",
    createdAt: "2025-02-06T15:00:00Z",
    metadata: { spotName: "GGPL" },
  },
  {
    id: "act-5",
    type: "session_start",
    title: "セッション開始",
    detail: "GGPL OSAKA — NLH 200/400",
    userName: "おにく",
    userInitial: "お",
    userColor: "#00FF9F",
    createdAt: "2025-02-06T20:00:00Z",
    metadata: { spotName: "GGPL" },
  },
  {
    id: "act-6",
    type: "session_end",
    title: "セッション終了",
    detail: "GGPL OSAKA — +¥142,500 (8時間)",
    userName: "おにく",
    userInitial: "お",
    userColor: "#00FF9F",
    createdAt: "2025-02-06T04:00:00Z",
    metadata: { profitJpy: 142500, spotName: "GGPL" },
  },
  {
    id: "act-7",
    type: "hand_review",
    title: "ハンドレビュー投稿",
    detail: "QJh ナッツフラッシュ — スロープレイ成功",
    userName: "おにく",
    userInitial: "お",
    userColor: "#00FF9F",
    createdAt: "2025-02-05T14:00:00Z",
    metadata: { tags: ["SLOW_PLAY", "GREAT_PLAY"] },
  },
  {
    id: "act-8",
    type: "session_end",
    title: "セッション終了",
    detail: "POKER LIVE OSAKA — -¥15,750 (5時間)",
    userName: "ノセ",
    userInitial: "ノ",
    userColor: "#3B82F6",
    createdAt: "2025-02-05T00:30:00Z",
    metadata: { profitJpy: -15750, spotName: "PLO" },
  },
  {
    id: "act-9",
    type: "session_start",
    title: "セッション開始",
    detail: "BLOW — NLH 100/200",
    userName: "便座",
    userInitial: "便",
    userColor: "#8B5CF6",
    createdAt: "2025-02-04T21:00:00Z",
    metadata: { spotName: "BLOW" },
  },
  {
    id: "act-10",
    type: "comment",
    title: "コメント追加",
    detail: "「ターンのスロープレイは最高の判断」",
    userName: "バスロもっちバイヤグラ",
    userInitial: "バ",
    userColor: "#EF4444",
    createdAt: "2025-02-04T12:00:00Z",
  },
];

// ===== Tournaments (Major Events) =====

export interface MockTournament {
  id: string;
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
  accentColor: string;
  status: "upcoming" | "registration_open" | "running" | "completed";
  notes?: string;
}

export const mockTournaments: MockTournament[] = [
  {
    id: "t-1",
    name: "OSL Season 5 Day 2",
    series: "OSL",
    spotId: "ggpl",
    spotName: "GGPL OSAKA",
    startDate: "2025-02-08",
    registrationEnd: "2025-02-08T18:00",
    buyInJpy: 5000,
    guaranteeJpy: 500000,
    gameType: "NLH",
    format: "bounty",
    accentColor: "#00FF9F",
    status: "registration_open",
    notes: "OSLシーズン5 Day2。バウンティ形式。今夜開催！",
  },
  {
    id: "t-2",
    name: "ROOTS Saturday Deepstack",
    series: "OTHER",
    spotId: "roots",
    spotName: "ROOTS OSAKA",
    startDate: "2025-02-08",
    registrationEnd: "2025-02-08T19:30",
    buyInJpy: 8000,
    guaranteeJpy: 300000,
    gameType: "NLH",
    format: "deepstack",
    accentColor: "#F59E0B",
    status: "registration_open",
    notes: "毎週土曜開催のディープスタック。レイト飛込みOK。",
  },
  {
    id: "t-3",
    name: "ギルド Monthly Championship",
    series: "OTHER",
    spotId: "guild",
    spotName: "ギルド",
    startDate: "2025-02-09",
    registrationEnd: "2025-02-09T14:00",
    buyInJpy: 10000,
    guaranteeJpy: 1000000,
    gameType: "NLH",
    format: "freezeout",
    accentColor: "#8B5CF6",
    status: "upcoming",
    notes: "ギルド月例チャンピオンシップ。フリーズアウト。",
  },
  {
    id: "t-4",
    name: "KOPT #12 Main Event",
    series: "KOPT",
    spotId: "roots",
    spotName: "ROOTS OSAKA",
    startDate: "2025-02-15",
    endDate: "2025-02-16",
    registrationEnd: "2025-02-15T14:00",
    buyInJpy: 15000,
    guaranteeJpy: 5000000,
    gameType: "NLH",
    format: "re-entry",
    accentColor: "#FFD700",
    status: "upcoming",
    notes: "KOPT第12回メインイベント。Day1 3フライト制。",
  },
  {
    id: "t-5",
    name: "TPC Osaka Championship",
    series: "TPC",
    spotId: "ggpl",
    spotName: "GGPL OSAKA",
    startDate: "2025-02-22",
    endDate: "2025-02-23",
    registrationEnd: "2025-02-22T13:00",
    buyInJpy: 20000,
    guaranteeJpy: 8000000,
    gameType: "NLH",
    format: "freezeout",
    accentColor: "#2563EB",
    status: "upcoming",
    notes: "TPC大阪チャンピオンシップ。フリーズアウト形式。",
  },
  {
    id: "t-6",
    name: "JAPAN GOLD DRAGON Osaka Leg",
    series: "JAPAN_GOLD_DRAGON",
    spotId: "roots",
    spotName: "ROOTS OSAKA",
    startDate: "2025-03-01",
    endDate: "2025-03-02",
    registrationEnd: "2025-03-01T15:00",
    buyInJpy: 30000,
    guaranteeJpy: 10000000,
    gameType: "NLH",
    format: "re-entry",
    accentColor: "#DC2626",
    status: "upcoming",
    notes: "ジャパンゴールドドラゴン大阪レッグ。優勝者はグランドファイナル出場権獲得。",
  },
  {
    id: "t-7",
    name: "JOPT Grand Final Osaka Qualifier",
    series: "JOPT",
    spotId: "casino-stadium",
    spotName: "Casino Stadium",
    startDate: "2025-03-08",
    endDate: "2025-03-09",
    registrationEnd: "2025-03-08T12:00",
    buyInJpy: 25000,
    guaranteeJpy: 15000000,
    gameType: "NLH",
    format: "re-entry",
    accentColor: "#FF6B35",
    status: "upcoming",
    notes: "JOPTグランドファイナル大阪予選。優勝者は東京GFへの出場権＋旅費サポート。",
  },
];

// ===== Daily Events (Today's schedule) =====

export interface MockDailyEvent {
  id: string;
  spotId: string;
  spotName: string;
  date: string;
  title: string;
  startTime: string;
  endTime?: string;
  eventType: "tournament" | "cash_game" | "freeroll" | "special" | "league";
  buyInJpy?: number;
  detail?: string;
}

export const mockDailyEvents: MockDailyEvent[] = [
  { id: "de-1", spotId: "roots", spotName: "ROOTS", date: "2025-02-08", title: "NLH キャッシュ 100/200", startTime: "14:00", endTime: "05:00", eventType: "cash_game", detail: "常設キャッシュゲーム。2テーブル開放。" },
  { id: "de-2", spotId: "roots", spotName: "ROOTS", date: "2025-02-08", title: "Saturday Deepstack", startTime: "19:00", endTime: "23:00", eventType: "tournament", buyInJpy: 8000, detail: "毎週土曜のディープスタック。25000チップスタート。" },
  { id: "de-3", spotId: "poker-live", spotName: "PLO", date: "2025-02-08", title: "NLH キャッシュ 100/200", startTime: "15:00", endTime: "03:00", eventType: "cash_game", detail: "アフタヌーンキャッシュ開放。" },
  { id: "de-4", spotId: "ggpl", spotName: "GGPL", date: "2025-02-08", title: "OSL Season 5 Day 2 バウンティ", startTime: "18:00", endTime: "23:00", eventType: "tournament", buyInJpy: 5000, detail: "OSLバウンティトーナメント。1キル500円バック。" },
  { id: "de-5", spotId: "ggpl", spotName: "GGPL", date: "2025-02-08", title: "NLH/PLO ミックスゲーム", startTime: "16:00", endTime: "01:00", eventType: "cash_game", detail: "NLH/PLOローテーション。200/400メイン。" },
  { id: "de-6", spotId: "blow", spotName: "BLOW", date: "2025-02-08", title: "フリーロール土曜大会", startTime: "15:00", endTime: "18:00", eventType: "freeroll", buyInJpy: 0, detail: "参加費無料。優勝者に次回トーナメントシート進呈。" },
  { id: "de-7", spotId: "zeus", spotName: "ゼウス", date: "2025-02-08", title: "ビギナーズNLH 50/100", startTime: "14:00", endTime: "20:00", eventType: "cash_game", detail: "初心者向け低ステークス。" },
  { id: "de-8", spotId: "universe", spotName: "UNI", date: "2025-02-08", title: "PLO キャッシュ 200/400", startTime: "18:00", endTime: "02:00", eventType: "cash_game", detail: "PLO専用テーブル。" },
  { id: "de-9", spotId: "jerrys", spotName: "Jerry", date: "2025-02-08", title: "サタデーナイトNLH 100/200", startTime: "20:00", endTime: "04:00", eventType: "cash_game", detail: "土曜の夜は最も人が集まる時間帯。" },
  { id: "de-10", spotId: "guild", spotName: "ギルド", date: "2025-02-08", title: "ギルド リーグ戦 Week 6", startTime: "17:00", endTime: "22:00", eventType: "league", buyInJpy: 3000, detail: "月間リーグ戦。ポイント上位にプライズ。" },
  { id: "de-11", spotId: "casino-stadium", spotName: "CS", date: "2025-02-08", title: "NLH/PLO ハイステークス 500/1000", startTime: "20:00", endTime: "06:00", eventType: "cash_game", detail: "ハイステークスキャッシュ。常連集合。" },
  { id: "de-12", spotId: "iris", spotName: "IRis", date: "2025-02-08", title: "サタデーNLH 100/200", startTime: "16:00", endTime: "00:00", eventType: "cash_game", detail: "土曜キャッシュゲーム。ビギナー歓迎。" },
  { id: "de-13", spotId: "jackpot", spotName: "JP", date: "2025-02-08", title: "NLH トーナメント + キャッシュ", startTime: "17:00", endTime: "01:00", eventType: "tournament", buyInJpy: 5000, detail: "夕方トーナメント→キャッシュ移行。" },
  { id: "de-14", spotId: "backdoor", spotName: "BD", date: "2025-02-08", title: "カジュアルNLH 100/200", startTime: "19:00", endTime: "03:00", eventType: "cash_game", detail: "バー併設。ドリンク片手にポーカー。" },
  { id: "de-15", spotId: "ggpl", spotName: "GGPoker", date: "2025-02-08", title: "GGPoker $100 NLH Daily", startTime: "21:00", endTime: "23:30", eventType: "tournament", buyInJpy: 15000, detail: "GGPoker $100 NLH。毎日21時開催。GTD $10,000。オンライン参戦推奨。" },
  { id: "de-16", spotId: "ggpl", spotName: "GGPoker", date: "2025-02-08", title: "GGPoker $25 NLH Bounty", startTime: "20:00", endTime: "22:00", eventType: "tournament", buyInJpy: 3750, detail: "GGPoker $25バウンティ。キル$10バック。エントリー練習に最適。" },
];
