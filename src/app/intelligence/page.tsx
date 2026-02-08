"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PhotoUpload } from "@/components/hand-recorder/photo-upload";
import { mockOpponentNotes } from "@/lib/mock-data";
import {
  getSpot,
  OPPONENT_TAG_LABELS,
  OPPONENT_TAG_COLORS,
  OSAKA_SPOTS,
} from "@/lib/poker-spots";
import type { OpponentNote, OpponentTag } from "@/lib/poker-spots";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Star, Eye, ChevronRight,
  Clock, TrendingUp, TrendingDown, Minus,
  Crosshair, User, Plus, X, Camera,
} from "lucide-react";

function SkillStars({ rating, interactive, onChange }: {
  rating: number; interactive?: boolean; onChange?: (r: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= rating ? "fill-gold text-gold" : "text-muted-foreground/30",
            interactive && "cursor-pointer hover:text-gold",
          )}
          onClick={() => interactive && onChange?.(i)}
        />
      ))}
    </div>
  );
}

function ResultIcon({ result }: { result: "win" | "loss" | "neutral" }) {
  if (result === "win") return <TrendingUp className="h-3.5 w-3.5 text-emerald" />;
  if (result === "loss") return <TrendingDown className="h-3.5 w-3.5 text-crimson" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

const ALL_TAGS: OpponentTag[] = [
  "FISH", "REG", "NITS", "LAG", "TAG", "MANIAC",
  "CALLING_STATION", "TILT_PRONE", "BLUFF_HEAVY",
  "OVERBET_FREQ", "WEAK_POSTFLOP", "STRONG_PREFLOP", "POSITIONAL_AWARE",
];

export default function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [spotFilter, setSpotFilter] = useState("all");
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentNote | null>(
    mockOpponentNotes[0] ?? null,
  );
  const [showForm, setShowForm] = useState(false);

  // Registration form
  const [formName, setFormName] = useState("");
  const [formSpot, setFormSpot] = useState("");
  const [formStakes, setFormStakes] = useState("100/200");
  const [formSkill, setFormSkill] = useState(3);
  const [formTags, setFormTags] = useState<OpponentTag[]>([]);
  const [formNotes, setFormNotes] = useState("");
  const [formPhysical, setFormPhysical] = useState("");
  const [formBetSizing, setFormBetSizing] = useState("");
  const [formPhoto, setFormPhoto] = useState<string | undefined>();
  const [formSaved, setFormSaved] = useState(false);

  const toggleFormTag = (tag: OpponentTag) => {
    setFormTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleFormSave = () => {
    setFormSaved(true);
    setTimeout(() => { setFormSaved(false); setShowForm(false); }, 1500);
  };

  const filtered = mockOpponentNotes.filter((note) => {
    if (spotFilter !== "all" && note.spotId !== spotFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        note.opponentName.toLowerCase().includes(q) ||
        note.notes.toLowerCase().includes(q) ||
        note.tags.some((t) => OPPONENT_TAG_LABELS[t].toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-crimson/10">
          <Crosshair className="h-5 w-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">対戦相手データベース</h1>
          <p className="text-sm text-muted-foreground">
            指名手配リスト — チームの知見を共有
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="font-number text-xs">
            {mockOpponentNotes.length} 件
          </Badge>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-1 h-3.5 w-3.5" /> : <Plus className="mr-1 h-3.5 w-3.5" />}
            {showForm ? "閉じる" : "新規登録"}
          </Button>
        </div>
      </div>

      {/* Registration Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              対戦相手を登録
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <PhotoUpload value={formPhoto} onChange={setFormPhoto} />

              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">名前</Label>
                    <Input value={formName} onChange={(e) => setFormName(e.target.value)}
                      placeholder="相手の名前・ニックネーム" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">スポット</Label>
                    <Select value={formSpot} onValueChange={setFormSpot}>
                      <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                      <SelectContent>
                        {OSAKA_SPOTS.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.shortName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">ステークス</Label>
                    <Input value={formStakes} onChange={(e) => setFormStakes(e.target.value)}
                      placeholder="100/200" className="font-number" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="text-xs shrink-0">上手さ</Label>
                  <SkillStars rating={formSkill} interactive onChange={setFormSkill} />
                  <span className="text-xs text-muted-foreground font-number">★{formSkill}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs">プレースタイル (タップで選択)</Label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formTags.includes(tag) ? "default" : "outline"}
                    className={cn("cursor-pointer text-[10px]", formTags.includes(tag) && OPPONENT_TAG_COLORS[tag])}
                    onClick={() => toggleFormTag(tag)}
                  >
                    {OPPONENT_TAG_LABELS[tag]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><Eye className="h-3 w-3" />戦略メモ</Label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="プリフロップの傾向、ポストフロップの弱点..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[60px] resize-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" />身体的特徴</Label>
                <textarea value={formPhysical} onChange={(e) => setFormPhysical(e.target.value)}
                  placeholder="服装、持ち物、癖..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[60px] resize-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />ベットサイズ傾向</Label>
                <textarea value={formBetSizing} onChange={(e) => setFormBetSizing(e.target.value)}
                  placeholder="バリュー67%、ブラフ33%..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[60px] resize-none" />
              </div>
            </div>

            <Button className="w-full" onClick={handleFormSave} disabled={!formName}>
              {formSaved ? "登録しました！" : "対戦相手を登録"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="名前・メモ・タグで検索..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant={spotFilter === "all" ? "default" : "outline"}
            className="cursor-pointer" onClick={() => setSpotFilter("all")}>
            全スポット
          </Badge>
          {OSAKA_SPOTS.filter((s) => s.category !== "online").slice(0, 6).map((spot) => (
            <Badge key={spot.id} variant={spotFilter === spot.id ? "default" : "outline"}
              className="cursor-pointer text-[10px]" onClick={() => setSpotFilter(spot.id)}>
              {spot.shortName}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Wanted List */}
        <div className="space-y-2 lg:col-span-2">
          {filtered.map((note) => {
            const spot = getSpot(note.spotId);
            const isSelected = selectedOpponent?.id === note.id;
            const wins = note.encounters.filter((e) => e.result === "win").length;
            const losses = note.encounters.filter((e) => e.result === "loss").length;

            return (
              <button type="button" key={note.id}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all cursor-pointer",
                  isSelected ? "border-crimson bg-crimson/5" : "hover:border-crimson/30",
                )}
                onClick={() => setSelectedOpponent(note)}>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-crimson/30 bg-crimson/10 text-lg font-bold text-crimson">
                    {note.opponentName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{note.opponentName}</span>
                      <SkillStars rating={note.skillRating} />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className={cn("text-[10px]", OPPONENT_TAG_COLORS[tag])}>
                          {OPPONENT_TAG_LABELS[tag]}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      {spot && (<span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{spot.shortName}</span>)}
                      <span className="font-number">{note.stakes}</span>
                      <span className="text-emerald">W{wins}</span>
                      <span className="text-crimson">L{losses}</span>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">該当する対戦相手がいません</p>
            </div>
          )}
        </div>

        {/* Right: Detail */}
        <div className="space-y-4 lg:col-span-3">
          {selectedOpponent ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-crimson/40 bg-crimson/10 text-3xl font-bold text-crimson">
                      {selectedOpponent.opponentName.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{selectedOpponent.opponentName}</CardTitle>
                        <SkillStars rating={selectedOpponent.skillRating} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOpponent.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className={cn("text-[10px]", OPPONENT_TAG_COLORS[tag])}>
                            #{OPPONENT_TAG_LABELS[tag]}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {getSpot(selectedOpponent.spotId) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{getSpot(selectedOpponent.spotId)!.name}
                          </span>
                        )}
                        <span className="font-number">{selectedOpponent.stakes}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />最終: {selectedOpponent.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">戦略メモ</p>
                    <p className="text-sm leading-relaxed">{selectedOpponent.notes}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedOpponent.physicalDescription && (
                      <div className="rounded-lg border p-4 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />身体的特徴
                        </p>
                        <p className="text-sm leading-relaxed">{selectedOpponent.physicalDescription}</p>
                      </div>
                    )}
                    {selectedOpponent.betSizingNotes && (
                      <div className="rounded-lg border p-4 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />ベットサイズ傾向
                        </p>
                        <p className="text-sm leading-relaxed">{selectedOpponent.betSizingNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />同卓ログ
                    <Badge variant="secondary" className="font-number text-[10px]">
                      {selectedOpponent.encounters.length} 件
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOpponent.encounters.length > 0 ? (
                    <div className="space-y-0">
                      {selectedOpponent.encounters.map((enc, i) => {
                        const encSpot = getSpot(enc.spotId);
                        return (
                          <div key={`${enc.date}-${i}`}
                            className="flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0">
                            <ResultIcon result={enc.result} />
                            <span className="font-number text-xs text-muted-foreground w-20 shrink-0">{enc.date}</span>
                            {encSpot && (<span className="spot-badge shrink-0"><MapPin className="h-2 w-2" />{encSpot.shortName}</span>)}
                            <span className="font-number text-[10px] text-muted-foreground shrink-0">{enc.stakes}</span>
                            {enc.note && (<span className="text-xs text-muted-foreground truncate">{enc.note}</span>)}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">まだ同卓記録がありません</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <Crosshair className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">左のリストから対戦相手を選択してください</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
