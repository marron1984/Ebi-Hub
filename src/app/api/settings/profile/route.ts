import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/settings/profile — get current user profile + stats */
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        joinedAt: true,
        primarySpotId: true,
        primarySpot: { select: { shortName: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // Aggregate session stats for this user
    const sessions = await prisma.session.findMany({
      where: { playerId: userId },
      select: {
        profitJpy: true,
        durationMinutes: true,
        spotId: true,
        spot: { select: { shortName: true } },
      },
    });

    const totalSessions = sessions.length;
    const totalProfitJpy = sessions.reduce((sum, s) => sum + s.profitJpy, 0);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const hourlyJpy = totalMinutes > 0 ? Math.round((totalProfitJpy / totalMinutes) * 60) : 0;
    const winRate = totalSessions > 0
      ? Math.round((sessions.filter((s) => s.profitJpy > 0).length / totalSessions) * 100)
      : 0;

    // Recent spots (top 3 by frequency)
    const spotCounts: Record<string, { name: string; count: number }> = {};
    for (const s of sessions) {
      if (s.spotId && s.spot) {
        if (!spotCounts[s.spotId]) spotCounts[s.spotId] = { name: s.spot.shortName, count: 0 };
        spotCounts[s.spotId].count++;
      }
    }
    const recentSpots = Object.values(spotCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((s) => s.name);

    // Opponent count
    const opponentCount = await prisma.opponentNote.count({ where: { createdBy: userId } });

    return NextResponse.json({
      ...user,
      joinedAt: user.joinedAt.toISOString(),
      primarySpotName: user.primarySpot?.shortName || null,
      stats: {
        totalSessions,
        totalProfitJpy,
        totalHours: Math.round(totalMinutes / 60),
        hourlyJpy,
        winRate,
        recentSpots,
        opponentCount,
      },
    });
  } catch (err) {
    console.error("[GET /api/settings/profile]", err);
    return NextResponse.json({ error: "プロフィールの取得に失敗しました" }, { status: 500 });
  }
}

/** PATCH /api/settings/profile — update username or name */
export async function PATCH(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";

  try {
    const body = await request.json();
    const { username, name } = body;

    // Validate
    if (username !== undefined) {
      const trimmed = username.trim();
      if (trimmed.length < 2 || trimmed.length > 30) {
        return NextResponse.json(
          { error: "ログインIDは2〜30文字で設定してください" },
          { status: 400 },
        );
      }

      // Check uniqueness
      const existing = await prisma.user.findUnique({
        where: { username: trimmed },
      });
      if (existing && existing.id !== userId) {
        return NextResponse.json(
          { error: "このログインIDは既に使用されています" },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username: username.trim() }),
        ...(name !== undefined && { name: name.trim() }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/settings/profile]", err);
    return NextResponse.json({ error: "プロフィールの更新に失敗しました" }, { status: 500 });
  }
}
