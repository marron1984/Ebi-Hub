import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/** GET /api/settings/profile — get current user profile */
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";

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
    },
  });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(user);
}

/** PATCH /api/settings/profile — update username or name */
export async function PATCH(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";
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
}
