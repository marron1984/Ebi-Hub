"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RangeGrid, RangeGridLegend } from "@/components/poker/range-grid";
import { mockRanges } from "@/lib/mock-data";
import type { RangeChart } from "@/types/poker";
import { BookOpen } from "lucide-react";

export default function RangesPage() {
  const [selectedRange, setSelectedRange] = useState<RangeChart>(mockRanges[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">レンジライブラリ</h1>
        <p className="text-sm text-muted-foreground">
          チーム共通のレンジ表を管理・閲覧
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Range List */}
        <div className="space-y-3">
          {mockRanges.map((range) => (
            <button
              type="button"
              key={range.id}
              className={`w-full rounded-lg border p-4 text-left transition-all hover:border-emerald/30 cursor-pointer ${
                selectedRange.id === range.id ? "border-emerald bg-emerald/5" : ""
              }`}
              onClick={() => setSelectedRange(range)}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald/10 p-2">
                  <BookOpen className="h-4 w-4 text-emerald" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{range.title}</p>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="text-[10px]">{range.position}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{range.situation}</Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Range Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{selectedRange.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedRange.description}</p>
              <div className="flex gap-2 pt-1">
                <Badge variant="outline">{selectedRange.position}</Badge>
                <Badge variant="secondary">{selectedRange.situation}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RangeGridLegend />
              <div className="overflow-x-auto">
                <RangeGrid range={selectedRange} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
