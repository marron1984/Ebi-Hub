"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MarkdownEditor } from "@/components/poker/markdown-editor";
import { cn } from "@/lib/utils";
import { Save, Plus, Trash2 } from "lucide-react";
import type {
  GameType, Position, Street, Rank, Suit, HandTag, Card as CardType,
} from "@/types/poker";
import { TAG_LABELS_JA } from "@/types/poker";

const positions: Position[] = ["SB","BB","UTG","UTG+1","MP","MP+1","HJ","CO","BTN"];
const ranks: Rank[] = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const suits: Suit[] = ["s","h","d","c"];
const suitSymbols: Record<Suit, string> = { s: "\u2660", h: "\u2665", d: "\u2666", c: "\u2663" };
const suitColors: Record<Suit, string> = {
  s: "text-foreground", h: "text-crimson", d: "text-crimson", c: "text-emerald",
};

const streets: Street[] = ["preflop", "flop", "turn", "river"];
const streetLabels: Record<Street, string> = {
  preflop: "プリフロップ", flop: "フロップ", turn: "ターン", river: "リバー",
};

const allTags: { label: string; value: HandTag; category: "strategy" | "mental" | "review" }[] = [
  { label: "3ベット", value: "3BET", category: "strategy" },
  { label: "4ベット", value: "4BET", category: "strategy" },
  { label: "Cベット", value: "C-BET", category: "strategy" },
  { label: "Cベット防御", value: "C-BET_DEFENSE", category: "strategy" },
  { label: "ブラフ", value: "BLUFF", category: "strategy" },
  { label: "バリューベット", value: "VALUE_BET", category: "strategy" },
  { label: "スロープレイ", value: "SLOW_PLAY", category: "strategy" },
  { label: "チェックレイズ", value: "CHECK_RAISE", category: "strategy" },
  { label: "オーバーベット", value: "OVERBET", category: "strategy" },
  { label: "ティルト注意", value: "TILT_CHECK", category: "mental" },
  { label: "自信あり", value: "CONFIDENT", category: "mental" },
  { label: "集中", value: "FOCUSED", category: "mental" },
  { label: "疲労", value: "TIRED", category: "mental" },
  { label: "ソルバー確認", value: "SOLVER_NEEDED", category: "review" },
  { label: "チーム共有", value: "TEAM_SHARE", category: "review" },
  { label: "キーハンド", value: "KEY_HAND", category: "review" },
  { label: "ミス", value: "MISTAKE", category: "review" },
  { label: "好プレイ", value: "GREAT_PLAY", category: "review" },
  { label: "GTO乖離", value: "GTO_DEVIATION", category: "review" },
];

function CardSelector({ label, selectedCards, onChange, maxCards }: {
  label: string; selectedCards: CardType[]; onChange: (cards: CardType[]) => void; maxCards: number;
}) {
  const [selectingRank, setSelectingRank] = useState<Rank | null>(null);

  const addCard = (rank: Rank, suit: Suit) => {
    if (selectedCards.length < maxCards) onChange([...selectedCards, { rank, suit }]);
    setSelectingRank(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {selectedCards.map((card, i) => (
          <button key={`${card.rank}${card.suit}-${i}`} type="button"
            onClick={() => onChange(selectedCards.filter((_, idx) => idx !== i))}
            className={cn("flex h-12 w-9 flex-col items-center justify-center rounded-md border bg-white dark:bg-slate-800 font-bold shadow-sm cursor-pointer hover:border-crimson", suitColors[card.suit])}>
            <span className="text-sm leading-none">{card.rank}</span>
            <span className="text-[8px] leading-none">{suitSymbols[card.suit]}</span>
          </button>
        ))}
        {selectedCards.length < maxCards && (
          <div className="relative">
            {selectingRank ? (
              <div className="flex gap-1">
                {suits.map((suit) => (
                  <button key={suit} type="button" onClick={() => addCard(selectingRank, suit)}
                    className={cn("flex h-12 w-9 items-center justify-center rounded-md border cursor-pointer hover:bg-accent text-lg", suitColors[suit])}>
                    {suitSymbols[suit]}
                  </button>
                ))}
                <button type="button" onClick={() => setSelectingRank(null)}
                  className="flex h-12 w-9 items-center justify-center rounded-md border cursor-pointer text-xs text-muted-foreground hover:bg-accent">
                  戻る
                </button>
              </div>
            ) : (
              <Select onValueChange={(v) => setSelectingRank(v as Rank)}>
                <SelectTrigger className="h-12 w-16"><Plus className="h-4 w-4" /></SelectTrigger>
                <SelectContent>
                  {ranks.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewHandPage() {
  const [gameType, setGameType] = useState<GameType>("NLH");
  const [stakesVal, setStakesVal] = useState("1/2");
  const [heroPosition, setHeroPosition] = useState<Position>("BTN");
  const [heroCards, setHeroCards] = useState<CardType[]>([]);
  const [activeStreets, setActiveStreets] = useState<Street[]>(["preflop"]);
  const [streetData, setStreetData] = useState<Record<Street, { pot: string; thought: string; board: CardType[] }>>({
    preflop: { pot: "", thought: "", board: [] },
    flop: { pot: "", thought: "", board: [] },
    turn: { pot: "", thought: "", board: [] },
    river: { pot: "", thought: "", board: [] },
  });
  const [result, setResult] = useState("");
  const [selectedTags, setSelectedTags] = useState<HandTag[]>([]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleTag = (tag: HandTag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const addStreet = () => {
    const nextStreet = streets.find((s) => !activeStreets.includes(s));
    if (nextStreet) setActiveStreets([...activeStreets, nextStreet]);
  };

  const removeStreet = (street: Street) => {
    if (street === "preflop") return;
    setActiveStreets(activeStreets.filter((s) => s !== street));
  };

  const updateStreetData = (street: Street, field: string, value: string | CardType[]) => {
    setStreetData((prev) => ({ ...prev, [street]: { ...prev[street], [field]: value } }));
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ハンド記録</h1>
        <p className="text-sm text-muted-foreground">ハンドの記録と思考プロセスの記述</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">ハンド情報</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>ゲーム種別</Label>
                  <Select value={gameType} onValueChange={(v) => setGameType(v as GameType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NLH">NLH</SelectItem>
                      <SelectItem value="PLO">PLO</SelectItem>
                      <SelectItem value="PLO5">PLO5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ステークス</Label>
                  <Input value={stakesVal} onChange={(e) => setStakesVal(e.target.value)} placeholder="1/2" className="font-number" />
                </div>
                <div className="space-y-2">
                  <Label>ヒーローポジション</Label>
                  <Select value={heroPosition} onValueChange={(v) => setHeroPosition(v as Position)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardSelector label="ヒーローカード" selectedCards={heroCards} onChange={setHeroCards}
                maxCards={gameType === "PLO" ? 4 : gameType === "PLO5" ? 5 : 2} />
            </CardContent>
          </Card>

          {activeStreets.map((street) => (
            <Card key={street}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{streetLabels[street]}</span>
                  {street !== "preflop" && (
                    <Button variant="ghost" size="sm" onClick={() => removeStreet(street)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {street !== "preflop" && (
                  <CardSelector label="ボード" selectedCards={streetData[street].board}
                    onChange={(cards) => updateStreetData(street, "board", cards)}
                    maxCards={street === "flop" ? 3 : street === "turn" ? 4 : 5} />
                )}
                <div className="space-y-2">
                  <Label>ポットサイズ ($)</Label>
                  <Input type="number" placeholder="0" value={streetData[street].pot}
                    onChange={(e) => updateStreetData(street, "pot", e.target.value)} className="font-number" />
                </div>
                <div className="space-y-2">
                  <Label>思考プロセス (Markdown対応)</Label>
                  <MarkdownEditor
                    value={streetData[street].thought}
                    onChange={(v) => updateStreetData(street, "thought", v)}
                    placeholder="このストリートでの思考を記述... レンジ、エクイティ、戦略判断など"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {activeStreets.length < 4 && (
            <Button variant="outline" className="w-full" onClick={addStreet}>
              <Plus className="mr-2 h-4 w-4" />
              {streetLabels[streets.find((s) => !activeStreets.includes(s))!]}を追加
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">結果</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>損益 ($)</Label>
                <Input type="number" placeholder="0" value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className={cn("font-number text-lg font-bold", result && parseFloat(result) >= 0 ? "text-emerald" : "text-crimson")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">スマートタグ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">戦略</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.filter((t) => t.category === "strategy").map((tag) => (
                    <Badge key={tag.value} variant={selectedTags.includes(tag.value) ? "strategy" : "outline"}
                      className="cursor-pointer" onClick={() => toggleTag(tag.value)}>
                      #{tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">メンタル</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.filter((t) => t.category === "mental").map((tag) => (
                    <Badge key={tag.value} variant={selectedTags.includes(tag.value) ? "mental" : "outline"}
                      className="cursor-pointer" onClick={() => toggleTag(tag.value)}>
                      #{tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">レビュー</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.filter((t) => t.category === "review").map((tag) => (
                    <Badge key={tag.value} variant={selectedTags.includes(tag.value) ? "review" : "outline"}
                      className="cursor-pointer" onClick={() => toggleTag(tag.value)}>
                      #{tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">メモ</CardTitle></CardHeader>
            <CardContent>
              <MarkdownEditor value={notes} onChange={setNotes}
                placeholder="ハンド全体の分析、反省点、学び..." rows={4} />
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {saved ? "保存しました！" : "ハンドを保存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
