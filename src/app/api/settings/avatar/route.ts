import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/** POST /api/settings/avatar — upload avatar (Base64) */
export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "p1";
  const body = await request.json();
  const { avatar } = body;

  if (!avatar || !avatar.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "有効な画像データを送信してください" },
      { status: 400 },
    );
  }

  // Check size (Base64 ~1.37x raw, limit 2MB raw → ~2.7MB base64)
  if (avatar.length > 3_000_000) {
    return NextResponse.json(
      { error: "画像サイズが大きすぎます（最大2MB）" },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar },
    select: { id: true, avatar: true },
  });

  revalidatePath("/settings");
  revalidatePath("/members");

  return NextResponse.json(updated);
}
