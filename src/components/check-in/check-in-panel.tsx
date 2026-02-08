"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Radio, MapPin, Clock, Zap, Send, ChevronDown, ChevronUp,
} from "lucide-react";
import { OSAKA_SPOTS } from "@/lib/poker-spots";
import {
  mockCheckIns, getElapsedTime, buildShoutMessage,
  type CheckIn,
} from "@/lib/check-in";

/** Active members panel for dashboard */
export function ActiveMembersPanel() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(mockCheckIns);
  const [showForm, setShowForm] = useState(false);
  const [formSpot, setFormSpot] = useState("");
  const [formStakes, setFormStakes] = useState("100/200");
  const [formGame, setFormGame] = useState("NLH");
  const [formNote, setFormNote] = useState("");
  const [shoutMsg, setShoutMsg] = useState<string | null>(null);

  const handleCheckIn = () => {
    const spot = OSAKA_SPOTS.find((s) => s.id === formSpot);
    if (!spot) return;

    const newCheckIn: CheckIn = {
      id: `ci-${Date.now()}`,
      playerId: "p1",
      playerName: "おにく",
      playerInitial: "お",
      playerColor: "#00FF9F",
      spotId: formSpot,
      spotName: spot.name,
      stakes: formStakes,
      gameType: formGame,
      startedAt: new Date().toISOString(),
      status: "active",
      note: formNote || undefined,
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);
    const msg = buildShoutMessage(newCheckIn);
    setShoutMsg(msg);
    setShowForm(false);
    setFormSpot("");
    setFormNote("");
    setTimeout(() => setShoutMsg(null), 4000);
  };

  // Group by spot
  const spotGroups = checkIns.reduce<Record<string, CheckIn[]>>((acc, ci) => {
    if (!acc[ci.spotId]) acc[ci.spotId] = [];
    acc[ci.spotId].push(ci);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 animate-pulse text-emerald" />
            稼働中メンバー
            <Badge variant="outline" className="font-number text-[10px]">
              {checkIns.length}人
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="h-7 text-xs"
          >
            {showForm ? (
              <><ChevronUp className="mr-1 h-3 w-3" />閉じる</>
            ) : (
              <><Zap className="mr-1 h-3 w-3" />稼働開始</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Auto Shout notification */}
        {shoutMsg && (
          <div className="flex items-center gap-2 rounded-md border border-emerald/30 bg-emerald/10 p-2.5 text-xs animate-in fade-in slide-in-from-top-2">
            <Send className="h-3.5 w-3.5 text-emerald shrink-0" />
            <span className="font-medium text-emerald">{shoutMsg}</span>
          </div>
        )}

        {/* Check-in form */}
        {showForm && (
          <div className="space-y-3 rounded-md border p-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-[10px]">スポット</Label>
                <Select value={formSpot} onValueChange={setFormSpot}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {OSAKA_SPOTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.shortName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">ステークス</Label>
                <Select value={formStakes} onValueChange={setFormStakes}>
                  <SelectTrigger className="h-8 text-xs font-number">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50/100">50/100</SelectItem>
                    <SelectItem value="100/200">100/200</SelectItem>
                    <SelectItem value="200/400">200/400</SelectItem>
                    <SelectItem value="500/1000">500/1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">ゲーム</Label>
                <Select value={formGame} onValueChange={setFormGame}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NLH">NLH</SelectItem>
                    <SelectItem value="PLO">PLO</SelectItem>
                    <SelectItem value="PLO5">PLO5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input
              placeholder="メモ（任意）"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              size="sm"
              className="w-full h-8"
              onClick={handleCheckIn}
              disabled={!formSpot}
            >
              <Zap className="mr-1 h-3 w-3" />
              稼働開始を報告
            </Button>
          </div>
        )}

        {/* Active list grouped by spot */}
        {Object.entries(spotGroups).map(([spotId, members]) => {
          const spot = OSAKA_SPOTS.find((s) => s.id === spotId);
          return (
            <div key={spotId} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-emerald" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                  {spot?.shortName || spotId}
                </span>
                <Badge variant="outline" className="text-[9px] h-4 px-1">
                  {members.length}
                </Badge>
              </div>
              {members.map((ci) => (
                <div
                  key={ci.id}
                  className="flex items-center gap-2.5 rounded-md border p-2"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: ci.playerColor }}
                  >
                    {ci.playerInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium truncate member-name-neon">
                        {ci.playerName}
                      </span>
                      <span className="font-number text-[10px] text-muted-foreground">
                        {ci.stakes} {ci.gameType}
                      </span>
                    </div>
                    {ci.note && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {ci.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                    {getElapsedTime(ci.startedAt)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {checkIns.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            現在稼働中のメンバーはいません
          </p>
        )}
      </CardContent>
    </Card>
  );
}
