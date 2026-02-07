"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Wallet,
  Plus,
  Banknote,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatJpy, getCurrencyFlag, POKER_CURRENCIES } from "@/lib/currency";
import type { PokerCurrency } from "@/lib/currency";

// ===== Mock asset data =====

interface CashAsset {
  id: string;
  currency: PokerCurrency;
  amount: number;
  jpyValue: number;
  location: string;
  note?: string;
}

interface PrizeAsset {
  id: string;
  title: string;
  description: string;
  estimatedJpy: number;
  source: string;
  date: string;
  status: "claimed" | "pending" | "expired";
}

const mockCashAssets: CashAsset[] = [
  { id: "ca-1", currency: "JPY", amount: 850000, jpyValue: 850000, location: "現金 (手元)", note: "バンクロール" },
  { id: "ca-2", currency: "USD", amount: 3200, jpyValue: 480000, location: "GGPoker", note: "オンラインバンクロール" },
  { id: "ca-3", currency: "USD", amount: 1500, jpyValue: 225000, location: "PokerStars" },
  { id: "ca-4", currency: "JPY", amount: 200000, jpyValue: 200000, location: "銀行口座", note: "予備資金" },
  { id: "ca-5", currency: "PHP", amount: 120000, jpyValue: 318000, location: "マニラ遠征用", note: "次回遠征まで保管" },
];

const mockPrizes: PrizeAsset[] = [
  { id: "pr-1", title: "KOPT #11 入賞プライズ", description: "次回KOPT参加費免除", estimatedJpy: 15000, source: "KOPT", date: "2025-01-20", status: "claimed" },
  { id: "pr-2", title: "OSL Season 4 ポイント", description: "OSLポイント 3,200pt", estimatedJpy: 32000, source: "OSL", date: "2025-01-15", status: "pending" },
  { id: "pr-3", title: "ROOTS 紹介ボーナス", description: "紹介2名達成ボーナスチップ", estimatedJpy: 5000, source: "ROOTS", date: "2024-12-28", status: "claimed" },
  { id: "pr-4", title: "GGPoker $100 NLH入賞", description: "マイルストーン達成ボーナス", estimatedJpy: 7500, source: "GGPoker", date: "2025-02-01", status: "pending" },
];

// ===== Component =====

export default function AssetsPage() {
  const [showAddCash, setShowAddCash] = useState(false);
  const [showAddPrize, setShowAddPrize] = useState(false);

  const totalCashJpy = mockCashAssets.reduce((sum, a) => sum + a.jpyValue, 0);
  const totalPrizeJpy = mockPrizes.reduce((sum, p) => sum + p.estimatedJpy, 0);
  const totalJpy = totalCashJpy + totalPrizeJpy;

  // Group cash by currency
  const cashByCurrency = mockCashAssets.reduce<Record<string, { total: number; jpyTotal: number; items: CashAsset[] }>>(
    (acc, asset) => {
      if (!acc[asset.currency]) acc[asset.currency] = { total: 0, jpyTotal: 0, items: [] };
      acc[asset.currency].total += asset.amount;
      acc[asset.currency].jpyTotal += asset.jpyValue;
      acc[asset.currency].items.push(asset);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">資産管理</h1>
          <p className="text-sm text-muted-foreground">
            現金・オンライン残高・プライズを一元管理
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddCash(!showAddCash)}
          >
            <Banknote className="mr-2 h-4 w-4" />
            現金追加
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddPrize(!showAddPrize)}
          >
            <Trophy className="mr-2 h-4 w-4" />
            プライズ追加
          </Button>
        </div>
      </div>

      {/* Total Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10">
                <Wallet className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">総資産 (JPY換算)</p>
                <p className="font-number text-xl font-bold text-emerald">
                  {formatJpy(totalJpy)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/30 bg-gold/10">
                <Banknote className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">現金・残高</p>
                <p className="font-number text-xl font-bold">
                  {formatJpy(totalCashJpy)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                <Trophy className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">プライズ (推定)</p>
                <p className="font-number text-xl font-bold">
                  {formatJpy(totalPrizeJpy)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Cash Form */}
      {showAddCash && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">現金を追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>通貨</Label>
                <Select defaultValue="JPY">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JPY">JPY (日本円)</SelectItem>
                    <SelectItem value="USD">USD (米ドル)</SelectItem>
                    <SelectItem value="PHP">PHP (フィリピンペソ)</SelectItem>
                    <SelectItem value="KRW">KRW (韓国ウォン)</SelectItem>
                    <SelectItem value="EUR">EUR (ユーロ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>金額</Label>
                <Input type="number" placeholder="0" className="font-number" />
              </div>
              <div className="space-y-2">
                <Label>保管場所</Label>
                <Input placeholder="GGPoker, 手元, 銀行..." />
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Prize Form */}
      {showAddPrize && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">プライズを追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>タイトル</Label>
                <Input placeholder="KOPT入賞プライズ..." />
              </div>
              <div className="space-y-2">
                <Label>推定価値 (JPY)</Label>
                <Input type="number" placeholder="0" className="font-number" />
              </div>
              <div className="space-y-2">
                <Label>ソース</Label>
                <Input placeholder="KOPT, OSL, GGPoker..." />
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash Assets by Currency */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Banknote className="h-4 w-4" />
          現金・残高
        </h2>
        <div className="space-y-3">
          {Object.entries(cashByCurrency).map(([currency, data]) => {
            const flag = getCurrencyFlag(currency as PokerCurrency);
            const info = POKER_CURRENCIES[currency as PokerCurrency];
            return (
              <Card key={currency}>
                <CardContent className="pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{flag}</span>
                      <span className="text-sm font-bold">
                        {info?.nameJa ?? currency} ({currency})
                      </span>
                    </div>
                    <span className="font-number text-sm font-bold text-emerald">
                      {formatJpy(data.jpyTotal)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.items.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{asset.location}</p>
                          {asset.note && (
                            <p className="text-xs text-muted-foreground">{asset.note}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-number text-sm font-bold">
                            {info?.symbol}{asset.amount.toLocaleString()}
                          </p>
                          {currency !== "JPY" && (
                            <p className="font-number text-xs text-muted-foreground">
                              ≈ {formatJpy(asset.jpyValue)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Prize Assets */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Trophy className="h-4 w-4" />
          プライズ
        </h2>
        <div className="space-y-2">
          {mockPrizes.map((prize) => {
            const statusConfig = {
              claimed: { label: "獲得済", color: "text-emerald border-emerald/30 bg-emerald/10" },
              pending: { label: "未受取", color: "text-gold border-gold/30 bg-gold/10" },
              expired: { label: "期限切れ", color: "text-muted-foreground border-border" },
            };
            const sc = statusConfig[prize.status];

            return (
              <div
                key={prize.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{prize.title}</p>
                    <Badge variant="outline" className={cn("text-[10px]", sc.color)}>
                      {sc.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{prize.description}</p>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{prize.source}</span>
                    <span>{prize.date}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right ml-4">
                  <p className="font-number text-sm font-bold">
                    {formatJpy(prize.estimatedJpy)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">推定価値</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
