"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Save,
  Clock,
  MapPin,
  DollarSign,
  TrendingUp,
  Building2,
  Globe,
} from "lucide-react";
import type { GameType, Venue } from "@/types/poker";

export default function NewSessionPage() {
  const [venue, setVenue] = useState<Venue>("live");
  const [gameType, setGameType] = useState<GameType>("NLH");
  const [location, setLocation] = useState("");
  const [stakes, setStakes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const profit =
    buyIn && cashOut ? parseFloat(cashOut) - parseFloat(buyIn) : null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Session</h1>
        <p className="text-sm text-muted-foreground">
          Record your poker session details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Venue Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-emerald" />
                Venue & Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Venue Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={venue === "live" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setVenue("live")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Live
                </Button>
                <Button
                  variant={venue === "online" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setVenue("online")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Online
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder={
                      venue === "live"
                        ? "Tokyo Poker Club"
                        : "PokerStars"
                    }
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameType">Game Type</Label>
                  <Select
                    value={gameType}
                    onValueChange={(v) => setGameType(v as GameType)}
                  >
                    <SelectTrigger id="gameType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NLH">No-Limit Hold&apos;em</SelectItem>
                      <SelectItem value="PLO">Pot-Limit Omaha</SelectItem>
                      <SelectItem value="PLO5">PLO5</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stakes">Stakes</Label>
                <div className="flex gap-2">
                  {["0.25/0.5", "0.5/1", "1/2", "2/5", "5/10"].map((s) => (
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
            </CardContent>
          </Card>

          {/* Time & Money */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-emerald" />
                Time & Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyIn">Buy-in ($)</Label>
                  <Input
                    id="buyIn"
                    type="number"
                    placeholder="300"
                    value={buyIn}
                    onChange={(e) => setBuyIn(e.target.value)}
                    className="font-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashOut">Cash-out ($)</Label>
                  <Input
                    id="cashOut"
                    type="number"
                    placeholder="500"
                    value={cashOut}
                    onChange={(e) => setCashOut(e.target.value)}
                    className="font-number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your session notes here... (table dynamics, key decisions, mental state, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-emerald" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium capitalize">{venue}</span>
                </div>
                {location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{location}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Game</span>
                  <span className="font-medium">{gameType}</span>
                </div>
                {stakes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stakes</span>
                    <span className="font-number font-medium">{stakes}</span>
                  </div>
                )}
                {buyIn && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Buy-in</span>
                    <span className="font-number font-medium">
                      ${parseFloat(buyIn).toLocaleString()}
                    </span>
                  </div>
                )}
                {cashOut && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash-out</span>
                    <span className="font-number font-medium">
                      ${parseFloat(cashOut).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {profit !== null && (
                <>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Result</span>
                      <span
                        className={cn(
                          "font-number text-xl font-bold",
                          profit >= 0 ? "text-emerald" : "text-crimson"
                        )}
                      >
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleSave}
                disabled={!buyIn || !cashOut}
              >
                <Save className="mr-2 h-4 w-4" />
                {saved ? "Saved!" : "Save Session"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <DollarSign className="mr-2 inline h-4 w-4 text-emerald" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>Record sessions immediately after playing for accuracy</li>
                <li>Include mental state notes for pattern analysis</li>
                <li>Note table dynamics and key player tendencies</li>
                <li>Tag important hands for later review</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
