"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, X, Users, UserPlus } from "lucide-react";
import { mockOpponentNotes } from "@/lib/mock-data";
import type { OpponentNote } from "@/lib/poker-spots";

interface TablemateSelectorProps {
  selectedOpponents: string[];
  onToggle: (name: string) => void;
  onAddNew: (name: string) => void;
  className?: string;
}

/** Select known opponents or register new ones for the current session */
export function TablemateSelector({
  selectedOpponents,
  onToggle,
  onAddNew,
  className,
}: TablemateSelectorProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  const handleAddNew = () => {
    if (!newName.trim()) return;
    onAddNew(newName.trim());
    setNewName("");
    setShowAdd(false);
  };

  const filtered = search
    ? mockOpponentNotes.filter(
        (o) =>
          o.opponentName.toLowerCase().includes(search.toLowerCase()) ||
          o.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      )
    : mockOpponentNotes;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Users className="h-3.5 w-3.5" />
          同卓者
          {selectedOpponents.length > 0 && (
            <Badge variant="outline" className="font-number text-[10px]">
              {selectedOpponents.length}人
            </Badge>
          )}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? (
            <><X className="mr-1 h-3 w-3" />閉じる</>
          ) : (
            <><UserPlus className="mr-1 h-3 w-3" />新規追加</>
          )}
        </Button>
      </div>

      {/* Quick add new opponent */}
      {showAdd && (
        <div className="flex gap-2">
          <Input
            placeholder="新しい対戦相手の名前..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
          />
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0"
            onClick={handleAddNew}
            disabled={!newName.trim()}
          >
            <Plus className="mr-1 h-3 w-3" />
            追加
          </Button>
        </div>
      )}

      {/* Search existing */}
      <Input
        placeholder="対戦相手を検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 text-xs"
      />

      {/* Opponent list as toggleable badges */}
      <div className="flex flex-wrap gap-1.5">
        {filtered.map((opp) => {
          const isSelected = selectedOpponents.includes(opp.opponentName);
          return (
            <Badge
              key={opp.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-xs py-1 px-2.5",
                isSelected && "ring-1 ring-emerald",
              )}
              onClick={() => onToggle(opp.opponentName)}
            >
              {opp.opponentName}
              {isSelected && <X className="ml-1 h-2.5 w-2.5" />}
            </Badge>
          );
        })}
        {/* Show newly added names that aren't in DB */}
        {selectedOpponents
          .filter(
            (name) => !mockOpponentNotes.some((o) => o.opponentName === name),
          )
          .map((name) => (
            <Badge
              key={name}
              variant="default"
              className="cursor-pointer text-xs py-1 px-2.5 ring-1 ring-emerald"
              onClick={() => onToggle(name)}
            >
              {name}
              <X className="ml-1 h-2.5 w-2.5" />
            </Badge>
          ))}
      </div>
    </div>
  );
}
