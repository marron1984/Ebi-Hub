"use client";

import { useState, useEffect, useCallback, useOptimistic, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PhotoUpload } from "@/components/hand-recorder/photo-upload";
import {
  getSpot,
  OPPONENT_TAG_LABELS,
  OPPONENT_TAG_COLORS,
  OSAKA_SPOTS,
} from "@/lib/poker-spots";
import type { OpponentNote, OpponentTag } from "@/lib/poker-spots";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-pakkiri";
import {
  Search, MapPin, Eye, ChevronDown, ChevronUp,
  Clock, TrendingUp, TrendingDown, Minus,
  Crosshair, User, Plus, X, Camera,
  Loader2, UserCircle, AlertCircle,
} from "lucide-react";

// ─── Skill level: colored square blocks (1=fish red → 5=shark green) ───
const SKILL_COLORS = [
  "bg-crimson",      // 1 — Fish
  "bg-orange-500",   // 2 — Weak
  "bg-gold",         // 3 — Average
  "bg-blue-500",     // 4 — Strong
  "bg-emerald",      // 5 — Shark
];
const SKILL_LABELS = ["Fish", "Weak", "Average", "Strong", "Shark"];

function SkillBlocks({ rating, interactive, onChange, size = "sm" }: {
  rating: number; interactive?: boolean; onChange?: (r: number) => void; size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            dim, "rounded-[2px] border transition-all duration-100",
            i <= rating
              ? cn(SKILL_COLORS[rating - 1], "border-transparent")
              : "border-muted-foreground/20 bg-muted",
            interactive && "cursor-pointer hover:scale-125",
          )}
          onClick={() => interactive && onChange?.(i)}
        />
      ))}
      {size === "md" && (
        <span className="ml-1.5 text-[10px] font-bold text-muted-foreground font-number">
          Lv.{rating} {SKILL_LABELS[rating - 1]}
        </span>
      )}
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

// ─── Main content ─────────────────────────────────────────────────

function IntelligenceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [spotFilter, setSpotFilter] = useState("all");
  const [opponents, setOpponents] = useState<OpponentNote[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Optimistic state ──
  const [optimisticOpponents, addOptimistic] = useOptimistic(
    opponents,
    (state: OpponentNote[], newOpp: OpponentNote) => [newOpp, ...state]
  );

  // ── Fetch from API ──
  const fetchOpponents = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/opponents");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: OpponentNote[] = await res.json();
      setOpponents(data);
    } catch {
      setFetchError("対戦相手データの読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpponents();
  }, [fetchOpponents]);

  // Open form when navigated with ?register=true
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);

  // ── Registration form state ──
  const [formName, setFormName] = useState("");
  const [formSpot, setFormSpot] = useState("");
  const [formStakes, setFormStakes] = useState("100/200");
  const [formSkill, setFormSkill] = useState(3);
  const [formTags, setFormTags] = useState<OpponentTag[]>([]);
  const [formNotes, setFormNotes] = useState("");
  const [formPhysical, setFormPhysical] = useState("");
  const [formBetSizing, setFormBetSizing] = useState("");
  const [formPhoto, setFormPhoto] = useState<string | undefined>();
  const [formSaving, setFormSaving] = useState(false);

  const toggleFormTag = (tag: OpponentTag) => {
    setFormTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const resetForm = () => {
    setFormName("");
    setFormSpot("");
    setFormStakes("100/200");
    setFormSkill(3);
    setFormTags([]);
    setFormNotes("");
    setFormPhysical("");
    setFormBetSizing("");
    setFormPhoto(undefined);
  };

  const handleFormSave = async () => {
    if (!formName.trim() || formSaving) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticEntry: OpponentNote = {
      id: tempId,
      opponentName: formName.trim(),
      spotId: formSpot || "roots",
      tags: formTags,
      notes: formNotes,
      stakes: formStakes,
      skillRating: formSkill,
      physicalDescription: formPhysical || undefined,
      betSizingNotes: formBetSizing || undefined,
      photoUrl: formPhoto || null,
      encounters: [],
      lastSeen: new Date().toISOString().split("T")[0],
      createdBy: "p1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    startTransition(() => {
      addOptimistic(optimisticEntry);
    });

    setFormSaving(true);
    resetForm();
    setShowForm(false);

    try {
      const res = await fetch("/api/opponents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opponentName: optimisticEntry.opponentName,
          spotId: optimisticEntry.spotId,
          tags: optimisticEntry.tags,
          notes: optimisticEntry.notes,
          stakes: optimisticEntry.stakes,
          skillRating: optimisticEntry.skillRating,
          physicalDescription: optimisticEntry.physicalDescription || null,
          betSizingNotes: optimisticEntry.betSizingNotes || null,
          photoUrl: optimisticEntry.photoUrl || null,
          createdBy: "p1",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const newOpponent: OpponentNote = await res.json();
      setOpponents((prev) => [newOpponent, ...prev]);
      setExpandedId(newOpponent.id);
      toast(`${newOpponent.opponentName} を登録しました`, "success");
      router.refresh();
    } catch {
      setOpponents((prev) => prev.filter((o) => o.id !== tempId));
      toast("登録に失敗しました。再度お試しください。", "error");
    } finally {
      setFormSaving(false);
    }
  };

  const displayList = isPending ? optimisticOpponents : opponents;

  const filtered = displayList.filter((note) => {
    if (spotFilter !== "all" && note.spotId !== spotFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        note.opponentName.toLowerCase().includes(q) ||
        note.notes.toLowerCase().includes(q) ||
        note.tags.some((t) =>
          (OPPONENT_TAG_LABELS[t] || t).toLowerCase().includes(q),
        )
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header — WANTED */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-crimson bg-crimson/10">
          <Crosshair className="h-5 w-5 text-crimson" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            WANTED <span className="text-crimson">指名手配</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Opponent Intelligence — チーム共有
          </p>
        </div>
        <Badge variant="outline" className="font-number text-xs border-crimson/30 text-crimson shrink-0">
          {displayList.length}件
        </Badge>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="flex items-center gap-2 rounded-md border-2 border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {fetchError}
          <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs" onClick={fetchOpponents}>
            再読み込み
          </Button>
        </div>
      )}

      {/* New Registration toggle */}
      <Button
        className="w-full h-11"
        variant={showForm ? "outline" : "default"}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
        {showForm ? "閉じる" : "対戦相手を新規登録"}
      </Button>

      {/* Registration Form — mobile-first stacked */}
      {showForm && (
        <Card className="border-2 border-crimson/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-crimson" />
              対戦相手を登録
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photo + Name row */}
            <div className="flex gap-3">
              <PhotoUpload value={formPhoto} onChange={setFormPhoto} />
              <div className="flex-1 space-y-1">
                <Label className="text-xs">名前 *</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="ニックネーム" className="h-11" />
              </div>
            </div>

            {/* Spot + Stakes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">スポット</Label>
                <Select value={formSpot} onValueChange={setFormSpot}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="選択" /></SelectTrigger>
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
                  placeholder="100/200" className="font-number h-11" />
              </div>
            </div>

            {/* Skill */}
            <div className="flex items-center gap-3">
              <Label className="text-xs shrink-0">上手さ</Label>
              <SkillBlocks rating={formSkill} interactive onChange={setFormSkill} size="md" />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs">プレースタイル (タップで選択)</Label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formTags.includes(tag) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] min-h-[28px] px-2",
                      formTags.includes(tag) && OPPONENT_TAG_COLORS[tag],
                    )}
                    onClick={() => toggleFormTag(tag)}
                  >
                    #{OPPONENT_TAG_LABELS[tag]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes — stacked on mobile */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><Eye className="h-3 w-3" />戦略メモ</Label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="プリフロップの傾向、弱点..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[48px] resize-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" />身体的特徴</Label>
                <textarea value={formPhysical} onChange={(e) => setFormPhysical(e.target.value)}
                  placeholder="服装、持ち物、癖..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[48px] resize-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />ベットサイズ傾向</Label>
                <textarea value={formBetSizing} onChange={(e) => setFormBetSizing(e.target.value)}
                  placeholder="3BETサイズが特殊、バリュー67%..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm min-h-[48px] resize-none" />
              </div>
            </div>

            <Button className="w-full h-11" onClick={handleFormSave} disabled={!formName.trim() || formSaving}>
              {formSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />保存中...</>
              ) : (
                "対戦相手を登録"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="名前・メモ・タグで検索..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-11" />
      </div>

      {/* Spot Filter — horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <Badge variant={spotFilter === "all" ? "default" : "outline"}
          className="cursor-pointer min-h-[28px] shrink-0" onClick={() => setSpotFilter("all")}>
          全スポット
        </Badge>
        {OSAKA_SPOTS.filter((s) => s.category !== "online").slice(0, 6).map((spot) => (
          <Badge key={spot.id} variant={spotFilter === spot.id ? "default" : "outline"}
            className="cursor-pointer text-[10px] min-h-[28px] shrink-0" onClick={() => setSpotFilter(spot.id)}>
            {spot.shortName}
          </Badge>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        </div>
      )}

      {/* ─── WANTED Card List — photo-left, tap to expand ─── */}
      {!isLoading && (
        <div className="space-y-2">
          {filtered.length > 0 ? (
            filtered.map((note) => {
              const spot = getSpot(note.spotId);
              const isExpanded = expandedId === note.id;
              const isOptimistic = note.id.startsWith("temp-");
              const wins = note.encounters.filter((e) => e.result === "win").length;
              const losses = note.encounters.filter((e) => e.result === "loss").length;

              return (
                <div
                  key={note.id}
                  className={cn(
                    "rounded-lg border transition-all duration-100",
                    isExpanded ? "border-2 border-crimson" : "hover:border-crimson/30",
                    isOptimistic && "opacity-60 animate-pulse",
                  )}
                >
                  {/* Compact row — photo left, info right */}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 p-3 text-left min-h-[72px]"
                    onClick={() => !isOptimistic && setExpandedId(isExpanded ? null : note.id)}
                  >
                    {/* Photo */}
                    {note.photoUrl ? (
                      <img
                        src={note.photoUrl}
                        alt={note.opponentName}
                        className="h-14 w-14 shrink-0 rounded-lg border-2 border-crimson/40 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-crimson/40 bg-crimson/10 text-xl font-bold text-crimson",
                      note.photoUrl && "hidden",
                    )}>
                      {note.opponentName.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{note.opponentName}</span>
                        <SkillBlocks rating={note.skillRating} />
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className={cn("text-[10px] px-1.5 py-0", OPPONENT_TAG_COLORS[tag])}>
                            #{OPPONENT_TAG_LABELS[tag]}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{note.tags.length - 3}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                        {spot && (<span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{spot.shortName}</span>)}
                        <span className="font-number">{note.stakes}</span>
                        <span className="text-emerald font-bold font-number">W{wins}</span>
                        <span className="text-crimson font-bold font-number">L{losses}</span>
                      </div>
                    </div>

                    {/* Expand indicator */}
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 shrink-0 text-crimson" />
                      : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </button>

                  {/* ─── Expanded detail — 4 intelligence panels ─── */}
                  {isExpanded && (
                    <div className="border-t px-3 pb-3 pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {/* 1. Play style */}
                        <div className="rounded-lg border p-3 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-crimson">プレースタイル</p>
                          <div className="flex flex-wrap gap-1">
                            {note.tags.length > 0 ? note.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className={cn("text-[10px] px-1.5", OPPONENT_TAG_COLORS[tag])}>
                                #{OPPONENT_TAG_LABELS[tag]}
                              </Badge>
                            )) : <p className="text-[10px] text-muted-foreground">未設定</p>}
                          </div>
                        </div>

                        {/* 2. Physical */}
                        <div className="rounded-lg border p-3 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-crimson flex items-center gap-1">
                            <User className="h-2.5 w-2.5" />身体的特徴
                          </p>
                          <p className="text-xs leading-relaxed">
                            {note.physicalDescription || <span className="text-muted-foreground">未記入</span>}
                          </p>
                        </div>

                        {/* 3. Skill */}
                        <div className="rounded-lg border p-3 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-crimson">上手さ</p>
                          <SkillBlocks rating={note.skillRating} size="md" />
                        </div>

                        {/* 4. Bet sizing */}
                        <div className="rounded-lg border p-3 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-crimson flex items-center gap-1">
                            <Eye className="h-2.5 w-2.5" />ベットサイズ
                          </p>
                          <p className="text-xs leading-relaxed">
                            {note.betSizingNotes || <span className="text-muted-foreground">未記入</span>}
                          </p>
                        </div>
                      </div>

                      {/* Strategy notes */}
                      {note.notes && (
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">戦略メモ</p>
                          <p className="text-xs leading-relaxed">{note.notes}</p>
                        </div>
                      )}

                      {/* Encounter log */}
                      {note.encounters.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />同卓ログ ({note.encounters.length}件)
                          </p>
                          {note.encounters.slice(0, 5).map((enc, i) => {
                            const encSpot = getSpot(enc.spotId);
                            return (
                              <div key={`${enc.date}-${i}`}
                                className="flex items-center gap-2 py-1 border-b border-border/50 last:border-0 text-xs min-h-[32px]">
                                <ResultIcon result={enc.result} />
                                <span className="font-number text-muted-foreground w-18 shrink-0">{enc.date}</span>
                                {encSpot && <span className="text-[10px] text-muted-foreground">{encSpot.shortName}</span>}
                                <span className="font-number text-[10px] text-muted-foreground">{enc.stakes}</span>
                                {enc.note && <span className="truncate text-muted-foreground">{enc.note}</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>最終: {note.lastSeen}</span>
                        {spot && <span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{spot.name}</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : displayList.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-crimson/30 p-12 text-center space-y-3">
              <UserCircle className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-bold text-muted-foreground">指名手配リストは空です</p>
              <p className="text-xs text-muted-foreground/70">
                「新規登録」から最初の対戦相手を登録しましょう
              </p>
              <Button variant="outline" size="sm" className="min-h-[44px] border-crimson/30 text-crimson"
                onClick={() => setShowForm(true)}>
                <Plus className="mr-1 h-3.5 w-3.5" />最初の対戦相手を登録
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">該当する対戦相手がいません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page export with Suspense boundary ───────────────────────────

export default function IntelligencePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-crimson" />
      </div>
    }>
      <IntelligenceContent />
    </Suspense>
  );
}
