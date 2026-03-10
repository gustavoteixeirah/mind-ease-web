import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/utils/users";
import { readDb, writeDb } from "@/utils/db";
import type { UserPreferences } from "@/types";

export async function PATCH(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { preferences }: { preferences: UserPreferences } = await req.json();
  if (!preferences) return NextResponse.json({ error: "Missing preferences" }, { status: 400 });

  const db = await readDb();
  const index = db.users.findIndex((u) => u.id === userId);

  if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

  db.users[index].preferences = preferences;
  await writeDb(db);

  return NextResponse.json(db.users[index]);
}