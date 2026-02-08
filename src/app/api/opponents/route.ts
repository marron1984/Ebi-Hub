import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/** GET /api/opponents — list all opponent notes with encounters */
export async function GET() {
  const opponents = await prisma.opponentNote.findMany({
    include: { encounters: true },
    orderBy: { updatedAt: "desc" },
  });

  // Parse JSON tags field for each opponent
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
}

/** POST /api/opponents — create a new opponent note */
export async function POST(request: NextRequest) {
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

  const opponent = await prisma.opponentNote.create({
    data: {
      opponentName: opponentName.trim(),
      spotId: spotId || "roots",
      tags: JSON.stringify(tags || []),
      notes: notes || "",
      stakes: stakes || "100/200",
      skillRating: skillRating ?? 3,
      physicalDescription: physicalDescription || null,
      betSizingNotes: betSizingNotes || null,
      photoUrl: photoUrl || null,
      lastSeen: new Date().toISOString().split("T")[0],
      createdBy: createdBy || "p1",
    },
    include: { encounters: true },
  });

  // Revalidate the intelligence page so the list refreshes
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
}
