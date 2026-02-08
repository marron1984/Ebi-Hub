import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/** GET /api/opponents — list all opponent notes with encounters */
export async function GET() {
  try {
    const opponents = await prisma.opponentNote.findMany({
      include: { encounters: true },
      orderBy: { updatedAt: "desc" },
    });

    const parsed = opponents.map((opp) => ({
      ...opp,
      tags: JSON.parse(opp.tags || "[]") as string[],
      createdAt: opp.createdAt.toISOString(),
      updatedAt: opp.updatedAt.toISOString(),
      encounters: opp.encounters.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[GET /api/opponents]", err);
    return NextResponse.json(
      { error: "対戦相手データの取得に失敗しました" },
      { status: 500 },
    );
  }
}

/** POST /api/opponents — create a new opponent note */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      opponentName,
      spotId,
      tags,
      notes,
      stakes,
      skillRating,
      physicalDescription,
      betSizingNotes,
      photoUrl,
      createdBy,
    } = body;

    if (!opponentName || !opponentName.trim()) {
      return NextResponse.json(
        { error: "opponentName is required" },
        { status: 400 },
      );
    }

    // Validate spotId exists
    const targetSpotId = spotId || "roots";
    const spotExists = await prisma.spot.findUnique({ where: { id: targetSpotId } });
    if (!spotExists) {
      return NextResponse.json(
        { error: `スポット "${targetSpotId}" が見つかりません。先にデータベースをシードしてください。` },
        { status: 400 },
      );
    }

    // Validate createdBy user exists
    const targetUserId = createdBy || "p1";
    const userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!userExists) {
      return NextResponse.json(
        { error: `ユーザー "${targetUserId}" が見つかりません。先にデータベースをシードしてください。` },
        { status: 400 },
      );
    }

    const opponent = await prisma.opponentNote.create({
      data: {
        opponentName: opponentName.trim(),
        spotId: targetSpotId,
        tags: JSON.stringify(tags || []),
        notes: notes || "",
        stakes: stakes || "100/200",
        skillRating: skillRating ?? 3,
        physicalDescription: physicalDescription || null,
        betSizingNotes: betSizingNotes || null,
        photoUrl: photoUrl || null,
        lastSeen: new Date().toISOString().split("T")[0],
        createdBy: targetUserId,
      },
      include: { encounters: true },
    });

    revalidatePath("/intelligence");

    return NextResponse.json(
      {
        ...opponent,
        tags: JSON.parse(opponent.tags || "[]"),
        createdAt: opponent.createdAt.toISOString(),
        updatedAt: opponent.updatedAt.toISOString(),
        encounters: [],
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/opponents]", err);
    return NextResponse.json(
      { error: "対戦相手の登録に失敗しました" },
      { status: 500 },
    );
  }
}
