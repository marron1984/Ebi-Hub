"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Save, Clock, MapPin, DollarSign, TrendingUp,
  Building2, Globe, Calendar, ArrowRightLeft,
} from "lucide-react";
import {
  POKER_CURRENCIES, CURRENCY_LIST, getDefaultCurrency, getDefaultStakes,
  toJpy, formatOriginal, formatJpy, getCurrencyFlag,
  type PokerCurrency,
} from "@/lib/currency";
import { OSAKA_SPOTS } from "@/lib/poker-spots";
import type { GameType, Venue } from "@/types/poker";
import type { SessionStatus } from "@/lib/currency";

// ===== Helpers =====

/** Return today as YYYY-MM-DD */
function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Parse the BB size from a stakes string like "1/2" → 2, "5K/10K" → 10000 */
function parseBBFromStakes(stakes: string): number {
  if (!stakes) return 0;
  const parts = stakes.split("/");
  if (parts.length < 2) return 0;
  const bbStr = parts[1].trim().toUpperCase();
  if (bbStr.endsWith("K")) {
    return parseFloat(bbStr.replace("K", "")) * 1000;
  }
  return parseFloat(bbStr) || 0;
}

const BB_PRESETS = [100, 200, 300, 500] as const;

// ===== Component =====

export default function NewSessionPage() {
  // --- State ---
  const [sessionDate, setSessionDate] = useState(todayString());
  const [venue, setVenue] = useState<Venue>("live");
  const [location, setLocation] = useState("");
  const [spotId, setSpotId] = useState<string>("");
  const [gameType, setGameType] = useState<GameType>("NLH");
  const [currency, setCurrency] = useState<PokerCurrency>(getDefaultCurrency("live"));
  const [exchangeRate, setExchangeRate] = useState<string>(
    String(POKER_CURRENCIES[getDefaultCurrency("live")].defaultRate)
  );
  const [stakes, setStakes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const [status, setStatus] = useState<SessionStatus>("OPEN");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  // --- Derived ---
  const currencyInfo = POKER_CURRENCIES[currency];
  const rate = parseFloat(exchangeRate) || currencyInfo.defaultRate;
  const isJpy = currency === "JPY";
  const stakesOptions = useMemo(() => getDefaultStakes(currency), [currency]);
  const bbSize = useMemo(() => parseBBFromStakes(stakes), [stakes]);

  const buyInNum = parseFloat(buyIn) || 0;
  const cashOutNum = parseFloat(cashOut) || 0;
  const profit = buyIn && cashOut ? cashOutNum - buyInNum : null;

  const buyInJpy = isJpy ? buyInNum : toJpy(buyInNum, currency, rate);
  const cashOutJpy = isJpy ? cashOutNum : toJpy(cashOutNum, currency, rate);
  const profitJpy = profit !== null ? (isJpy ? profit : toJpy(profit, currency, rate)) : null;

  // --- Handlers ---
  function handleVenueChange(v: Venue) {
    setVenue(v);
    const newCurrency = getDefaultCurrency(v);
    setCurrency(newCurrency);
    setExchangeRate(String(POKER_CURRENCIES[newCurrency].defaultRate));
    setStakes("");
    setBuyIn("");
    setCashOut("");
  }

  function handleCurrencyChange(c: PokerCurrency) {
    setCurrency(c);
    setExchangeRate(String(POKER_CURRENCIES[c].defaultRate));
    setStakes("");
    setBuyIn("");
    setCashOut("");
  }

  function handleBBPreset(multiplier: number) {
    if (bbSize <= 0) return;
    const amount = bbSize * multiplier;
    setBuyIn(String(amount));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // ===== Render =====
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">セッション記録</h1>
        <p className="text-sm text-muted-foreground">
          ポーカーセッションの詳細を記録
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ==================== LEFT COLUMN ==================== */}
        <div className="space-y-6 lg:col-span-2">
          {/* ---- Card 1: 日付 & 会場 ---- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-emerald" />
                日付 &amp; 会場
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date input */}
              <div className="space-y-2">
                <Label htmlFor="sessionDate" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  セッション日付
                </Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>

              {/* Venue toggle */}
              <div className="flex gap-2">
                <Button
                  variant={venue === "live" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleVenueChange("live")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  ライブ
                </Button>
                <Button
                  variant={venue === "online" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleVenueChange("online")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  オンライン
                </Button>
              </div>

              {/* Location + Game type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">場所</Label>
                  <Input
                    id="location"
                    placeholder={venue === "live" ? "東京ポーカークラブ" : "PokerStars"}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameType">ゲーム種別</Label>
                  <Select value={gameType} onValueChange={(v) => setGameType(v as GameType)}>
                    <SelectTrigger id="gameType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NLH">ノーリミットホールデム</SelectItem>
                      <SelectItem value="PLO">ポットリミットオマハ</SelectItem>
                      <SelectItem value="PLO5">PLO5</SelectItem>
                      <SelectItem value="Mixed">ミックス</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Spot selector (live only) */}
              {venue === "live" && (
                <div className="space-y-2">
                  <Label>スポット（大阪）</Label>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={spotId === "" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => { setSpotId(""); }}
                    >
                      その他
                    </Badge>
                    {OSAKA_SPOTS.map((spot) => (
                      <Badge
                        key={spot.id}
                        variant={spotId === spot.id ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          setSpotId(spot.id);
                          setLocation(spot.name);
                        }}
                      >
                        {spot.shortName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---- Card 2: 通貨 & ステークス ---- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowRightLeft className="h-4 w-4 text-emerald" />
                通貨 &amp; ステークス
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currency grid */}
              <div className="space-y-2">
                <Label>通貨</Label>
                <div className="grid grid-cols-5 gap-2">
                  {CURRENCY_LIST.map((c) => (
                    <Button
                      key={c}
                      variant={currency === c ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex flex-col items-center gap-0.5 py-2 text-xs h-auto",
                        currency === c && "ring-2 ring-offset-1 ring-emerald"
                      )}
                      onClick={() => handleCurrencyChange(c)}
                    >
                      <span className="text-base leading-none">{getCurrencyFlag(c)}</span>
                      <span className="font-medium">{c}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Exchange rate (only when not JPY) */}
              {!isJpy && (
                <div className="space-y-2">
                  <Label htmlFor="exchangeRate" className="flex items-center gap-1.5">
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    為替レート (1{currencyInfo.symbol} = ¥X)
                  </Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="font-number"
                  />
                  <p className="text-xs text-muted-foreground">
                    デフォルト: 1{currencyInfo.symbol} = ¥{currencyInfo.defaultRate}
                  </p>
                </div>
              )}

              {/* Stakes badges */}
              <div className="space-y-2">
                <Label>ステークス</Label>
                <div className="flex flex-wrap gap-2">
                  {stakesOptions.map((s) => (
                    <Badge
                      key={s}
                      variant={stakes === s ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1.5"
                      onClick={() => setStakes(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quick BB input */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  クイックバイイン (BB プリセット)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {BB_PRESETS.map((mult) => {
                    const amount = bbSize > 0 ? bbSize * mult : null;
                    return (
                      <Button
                        key={mult}
                        variant="outline"
                        size="sm"
                        disabled={bbSize <= 0}
                        className="min-w-[5rem]"
                        onClick={() => handleBBPreset(mult)}
                      >
                        <span className="font-medium">{mult}BB</span>
                        {amount !== null && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({currencyInfo.symbol}{amount.toLocaleString()})
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
                {bbSize <= 0 && stakes === "" && (
                  <p className="text-xs text-muted-foreground">
                    ステークスを選択するとBBプリセットが使えます
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ---- Card 3: 時間 & 金額 ---- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-emerald" />
                時間 &amp; 金額
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">開始時刻</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">終了時刻</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Buy-in */}
              <div className="space-y-2">
                <Label htmlFor="buyIn">
                  バイイン ({currencyInfo.symbol})
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="buyIn"
                    type="number"
                    placeholder={isJpy ? "30000" : "300"}
                    value={buyIn}
                    onChange={(e) => setBuyIn(e.target.value)}
                    className="font-number"
                  />
                  {!isJpy && buyInNum > 0 && (
                    <span className="shrink-0 text-sm font-number text-muted-foreground">
                      = ¥{buyInJpy.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Cash-out */}
              <div className="space-y-2">
                <Label htmlFor="cashOut">
                  キャッシュアウト ({currencyInfo.symbol})
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cashOut"
                    type="number"
                    placeholder={isJpy ? "50000" : "500"}
                    value={cashOut}
                    onChange={(e) => setCashOut(e.target.value)}
                    className="font-number"
                  />
                  {!isJpy && cashOutNum > 0 && (
                    <span className="shrink-0 text-sm font-number text-muted-foreground">
                      = ¥{cashOutJpy.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Status toggle */}
              <div className="space-y-2">
                <Label>ステータス</Label>
                <div className="flex gap-2">
                  <Button
                    variant={status === "OPEN" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1",
                      status === "OPEN" && "bg-amber-500 hover:bg-amber-600 text-white"
                    )}
                    onClick={() => setStatus("OPEN")}
                  >
                    OPEN
                    <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                      プレイ中
                    </Badge>
                  </Button>
                  <Button
                    variant={status === "SETTLED" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1",
                      status === "SETTLED" && "bg-emerald hover:bg-emerald/90 text-white"
                    )}
                    onClick={() => setStatus("SETTLED")}
                  >
                    SETTLED
                    <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                      換金済み
                    </Badge>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---- Card 4: セッションメモ ---- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">セッションメモ</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="テーブルの雰囲気、キーとなる判断、メンタル状態など..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* ==================== RIGHT COLUMN ==================== */}
        <div className="space-y-4">
          {/* ---- Session summary ---- */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-emerald" />
                セッション概要
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Date */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">日付</span>
                  <span className="font-medium">{sessionDate}</span>
                </div>

                {/* Venue */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">会場</span>
                  <span className="font-medium">
                    {venue === "live" ? "ライブ" : "オンライン"}
                  </span>
                </div>

                {/* Location */}
                {location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">場所</span>
                    <span className="font-medium">{location}</span>
                  </div>
                )}

                {/* Spot */}
                {spotId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">スポット</span>
                    <span className="spot-badge">
                      {OSAKA_SPOTS.find(s => s.id === spotId)?.shortName}
                    </span>
                  </div>
                )}

                {/* Game type */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ゲーム</span>
                  <span className="font-medium">{gameType}</span>
                </div>

                {/* Currency */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">通貨</span>
                  <span className="font-medium">
                    {getCurrencyFlag(currency)} {currency}
                  </span>
                </div>

                {/* Exchange rate */}
                {!isJpy && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">レート</span>
                    <span className="font-number font-medium">
                      1{currencyInfo.symbol} = ¥{rate}
                    </span>
                  </div>
                )}

                {/* Stakes */}
                {stakes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ステークス</span>
                    <span className="font-number font-medium">{stakes}</span>
                  </div>
                )}

                {/* Time */}
                {(startTime || endTime) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">時間</span>
                    <span className="font-number font-medium">
                      {startTime || "--:--"} ~ {endTime || "--:--"}
                    </span>
                  </div>
                )}

                {/* Status */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ステータス</span>
                  <Badge
                    variant={status === "OPEN" ? "outline" : "default"}
                    className={cn(
                      "text-xs",
                      status === "OPEN"
                        ? "border-amber-500 text-amber-600"
                        : "bg-emerald text-white"
                    )}
                  >
                    {status === "OPEN" ? "プレイ中" : "換金済み"}
                  </Badge>
                </div>

                {/* Buy-in */}
                {buyInNum > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">バイイン</span>
                    <div className="text-right">
                      <span className="font-number font-medium">
                        {currencyInfo.symbol}{buyInNum.toLocaleString()}
                      </span>
                      {!isJpy && (
                        <div className="text-xs font-number text-muted-foreground">
                          ¥{buyInJpy.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cash-out */}
                {cashOutNum > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">キャッシュアウト</span>
                    <div className="text-right">
                      <span className="font-number font-medium">
                        {currencyInfo.symbol}{cashOutNum.toLocaleString()}
                      </span>
                      {!isJpy && (
                        <div className="text-xs font-number text-muted-foreground">
                          ¥{cashOutJpy.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Result */}
              {profit !== null && (
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium">結果</span>
                    <span
                      className={cn(
                        "font-number text-xl font-bold",
                        profit >= 0 ? "text-emerald" : "text-crimson"
                      )}
                    >
                      {formatOriginal(profit, currency)}
                    </span>
                  </div>
                  {!isJpy && profitJpy !== null && (
                    <div className="flex justify-end">
                      <span
                        className={cn(
                          "font-number text-sm",
                          profitJpy >= 0 ? "text-emerald/70" : "text-crimson/70"
                        )}
                      >
                        {formatJpy(profitJpy)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Save button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleSave}
                disabled={!buyIn || !cashOut}
              >
                <Save className="mr-2 h-4 w-4" />
                {saved ? "保存しました！" : "セッションを保存"}
              </Button>
            </CardContent>
          </Card>

          {/* ---- Tips card ---- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <DollarSign className="mr-2 inline h-4 w-4 text-emerald" />
                記録のコツ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>プレイ直後に記録すると正確性が上がります</li>
                <li>メンタル状態のメモはパターン分析に有効です</li>
                <li>テーブルダイナミクスや相手の傾向を記録しましょう</li>
                <li>重要なハンドにはタグを付けて後で復習しましょう</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
