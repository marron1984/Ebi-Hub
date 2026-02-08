import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/** POST /api/settings/password — change password */
export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";
  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { error: "新しいパスワードは6文字以上で設定してください" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  // If user has existing password, verify current password
  if (user.passwordHash && user.passwordHash.length > 0) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "現在のパスワードを入力してください" },
        { status: 400 },
      );
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "現在のパスワードが正しくありません" },
        { status: 403 },
      );
    }
  }

  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hash },
  });

  return NextResponse.json({ message: "パスワードを更新しました" });
}
