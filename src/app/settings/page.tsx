"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-pakkiri";
import { compressAndEncode } from "@/lib/upload";
import { cn } from "@/lib/utils";
import {
  Settings, User, Key, Camera, Loader2,
  CheckCircle, Shield, Crown, Eye, EyeOff,
  DollarSign, Clock, Target, MapPin, Crosshair,
} from "lucide-react";

interface UserStats {
  totalSessions: number;
  totalProfitJpy: number;
  totalHours: number;
  hourlyJpy: number;
  winRate: number;
  recentSpots: string[];
  opponentCount: number;
}

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string | null;
  avatar: string | null;
  role: string;
  status: string;
  joinedAt: string;
  primarySpotName: string | null;
  stats: UserStats;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetch("/api/settings/profile")
      .then((res) => res.json())
      .then((data: UserProfile) => {
        setProfile(data);
        setUsername(data.username);
        setDisplayName(data.name);
      })
      .catch(() => toast("プロフィールの読み込みに失敗しました", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  // Username validation
  const validateUsername = (value: string) => {
    setUsernameError("");
    if (value.length < 2) {
      setUsernameError("2文字以上で入力してください");
      return;
    }
    if (value.length > 30) {
      setUsernameError("30文字以内で入力してください");
      return;
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (profileSaving) return;
    setProfileSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), name: displayName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error || "保存に失敗しました");
        toast(data.error || "保存に失敗しました", "error");
        return;
      }
      setProfile((prev) => prev ? { ...prev, ...data } : prev);
      toast("プロフィールを更新しました", "success");
    } catch {
      toast("保存に失敗しました", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (pwSaving) return;
    if (newPw.length < 6) {
      toast("パスワードは6文字以上で設定してください", "error");
      return;
    }
    if (newPw !== confirmPw) {
      toast("確認用パスワードが一致しません", "error");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "パスワード変更に失敗しました", "error");
        return;
      }
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast("パスワードを変更しました", "success");
    } catch {
      toast("パスワード変更に失敗しました", "error");
    } finally {
      setPwSaving(false);
    }
  };

  // Upload avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const result = await compressAndEncode(file);
      const res = await fetch("/api/settings/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: result.dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "アップロードに失敗しました", "error");
        return;
      }
      setProfile((prev) => prev ? { ...prev, avatar: data.avatar } : prev);
      toast("アイコンを更新しました", "success");
    } catch {
      toast("アップロードに失敗しました", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <User className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">
          プロフィールの読み込みに失敗しました
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
          再読み込み
        </Button>
      </div>
    );
  }

  const isAdmin = profile.role === "admin";
  const stats = profile.stats;
  const formatJpy = (n: number) => `${n >= 0 ? "+" : ""}¥${Math.abs(n).toLocaleString()}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">設定</h1>
          <p className="text-sm text-muted-foreground">プロフィール・セキュリティ・マイステータス</p>
        </div>
        {isAdmin && (
          <Badge className="ml-auto">
            <Crown className="mr-1 h-3 w-3" />Admin
          </Badge>
        )}
      </div>

      {/* ─── My Status Section ─── */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald" />
            マイステータス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border p-3 text-center">
              <DollarSign className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-[10px] text-muted-foreground">通算収支</p>
              <p className={cn(
                "font-number text-sm font-bold",
                stats.totalProfitJpy >= 0 ? "text-emerald" : "text-crimson"
              )}>
                {formatJpy(stats.totalProfitJpy)}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Clock className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-[10px] text-muted-foreground">時給</p>
              <p className="font-number text-sm font-bold">
                {stats.totalHours > 0 ? `¥${Math.abs(stats.hourlyJpy).toLocaleString()}/h` : "-"}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Target className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-[10px] text-muted-foreground">勝率</p>
              <p className="font-number text-sm font-bold">{stats.winRate}%</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Crosshair className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-[10px] text-muted-foreground">登録対戦相手</p>
              <p className="font-number text-sm font-bold">{stats.opponentCount}人</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-number">{stats.totalSessions} セッション / {stats.totalHours}h</span>
            {stats.recentSpots.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                主な稼働: {stats.recentSpots.join(", ")}
              </span>
            )}
            {profile.primarySpotName && (
              <Badge variant="outline" className="text-[10px]">
                <MapPin className="mr-1 h-2.5 w-2.5" />ホーム: {profile.primarySpotName}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Avatar Section ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4" />
            プロフィールアイコン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Avatar preview */}
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full border-2 border-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-muted text-2xl font-bold text-muted-foreground">
                  {profile.name.charAt(0)}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                JPG / PNG（最大2MB）
              </p>
              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
                <span className="inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-all duration-100 hover:bg-accent">
                  <Camera className="h-3.5 w-3.5" />
                  写真を変更
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Profile Section ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            プロフィール情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">ログインID</Label>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                placeholder="ログインID"
                className={cn("h-11 font-number", usernameError && "border-crimson")}
              />
              {usernameError && (
                <p className="text-xs text-crimson">{usernameError}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">表示名</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名"
                className="h-11"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            権限: {isAdmin ? "Admin (リーダー)" : "メンバー"}
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={profileSaving || !username.trim() || !displayName.trim() || !!usernameError}
            className="w-full h-11"
          >
            {profileSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />保存中...</>
            ) : (
              <><CheckCircle className="mr-2 h-4 w-4" />プロフィールを保存</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ─── Password Section ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            パスワード変更
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">現在のパスワード</Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="現在のパスワード（初回は空欄OK）"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">新しいパスワード</Label>
              <Input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="6文字以上"
                className={cn("h-11", newPw.length > 0 && newPw.length < 6 && "border-crimson")}
              />
              {newPw.length > 0 && newPw.length < 6 && (
                <p className="text-xs text-crimson">6文字以上で入力してください</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">パスワード確認</Label>
              <Input
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="もう一度入力"
                className={cn("h-11", confirmPw.length > 0 && confirmPw !== newPw && "border-crimson")}
              />
              {confirmPw.length > 0 && confirmPw !== newPw && (
                <p className="text-xs text-crimson">パスワードが一致しません</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={pwSaving || newPw.length < 6 || newPw !== confirmPw}
            className="w-full h-11"
          >
            {pwSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />変更中...</>
            ) : (
              <><Key className="mr-2 h-4 w-4" />パスワードを変更</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
