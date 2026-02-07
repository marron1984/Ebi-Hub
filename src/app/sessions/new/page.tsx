"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { Save, Clock, MapPin, DollarSign, TrendingUp, Building2, Globe } from "lucide-react";
import type { GameType, Venue, Currency } from "@/types/poker";

export default function NewSessionPage() {
  const [venue, setVenue] = useState<Venue>("live");
  const [gameType, setGameType] = useState<GameType>("NLH");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [location, setLocation] = useState("");
  const [stakes, setStakes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const profit = buyIn && cashOut ? parseFloat(cashOut) - parseFloat(buyIn) : null;
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">セッション記録</h1>
        <p className="text-sm text-muted-foreground">ポーカーセッションの詳細を記録</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-emerald" />
                会場 & ゲーム
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant={venue === "live" ? "default" : "outline"} className="flex-1" onClick={() => setVenue("live")}>
                  <Building2 className="mr-2 h-4 w-4" />ライブ
                </Button>
                <Button variant={venue === "online" ? "default" : "outline"} className="flex-1" onClick={() => setVenue("online")}>
                  <Globe className="mr-2 h-4 w-4" />オンライン
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="location">場所</Label>
                  <Input id="location" placeholder={venue === "live" ? "東京ポーカークラブ" : "PokerStars"}
                    value={location} onChange={(e) => setLocation(e.target.value)} />
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
                <div className="space-y-2">
                  <Label>通貨</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stakes">ステークス</Label>
                <div className="flex flex-wrap gap-2">
                  {currency === "USD"
                    ? ["0.25/0.5","0.5/1","1/2","2/5","5/10"].map((s) => (
                        <Badge key={s} variant={stakes === s ? "default" : "outline"} className="cursor-pointer px-3 py-1.5" onClick={() => setStakes(s)}>{s}</Badge>
                      ))
                    : ["50/100","100/200","200/400","500/1000"].map((s) => (
                        <Badge key={s} variant={stakes === s ? "default" : "outline"} className="cursor-pointer px-3 py-1.5" onClick={() => setStakes(s)}>{s}</Badge>
                      ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-emerald" />
                時間 & 金額
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">開始時刻</Label>
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">終了時刻</Label>
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyIn">バイイン ({currency === "JPY" ? "¥" : "$"})</Label>
                  <Input id="buyIn" type="number" placeholder={currency === "JPY" ? "30000" : "300"}
                    value={buyIn} onChange={(e) => setBuyIn(e.target.value)} className="font-number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashOut">キャッシュアウト ({currency === "JPY" ? "¥" : "$"})</Label>
                  <Input id="cashOut" type="number" placeholder={currency === "JPY" ? "50000" : "500"}
                    value={cashOut} onChange={(e) => setCashOut(e.target.value)} className="font-number" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">セッションメモ</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="テーブルの雰囲気、キーとなる判断、メンタル状態など..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-emerald" />
                セッション概要
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">会場</span>
                  <span className="font-medium">{venue === "live" ? "ライブ" : "オンライン"}</span>
                </div>
                {location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">場所</span>
                    <span className="font-medium">{location}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ゲーム</span>
                  <span className="font-medium">{gameType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">通貨</span>
                  <span className="font-medium">{currency}</span>
                </div>
                {stakes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ステークス</span>
                    <span className="font-number font-medium">{stakes}</span>
                  </div>
                )}
                {buyIn && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">バイイン</span>
                    <span className="font-number font-medium">{formatCurrency(parseFloat(buyIn), currency).replace("+","")}</span>
                  </div>
                )}
                {cashOut && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">キャッシュアウト</span>
                    <span className="font-number font-medium">{formatCurrency(parseFloat(cashOut), currency).replace("+","")}</span>
                  </div>
                )}
              </div>
              {profit !== null && (
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">結果</span>
                    <span className={cn("font-number text-xl font-bold", profit >= 0 ? "text-emerald" : "text-crimson")}>
                      {formatCurrency(profit, currency)}
                    </span>
                  </div>
                </div>
              )}
              <Button className="w-full" size="lg" onClick={handleSave} disabled={!buyIn || !cashOut}>
                <Save className="mr-2 h-4 w-4" />
                {saved ? "保存しました！" : "セッションを保存"}
              </Button>
            </CardContent>
          </Card>

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
