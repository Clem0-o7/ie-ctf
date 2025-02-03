//@/api/flags/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { flags } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const levelParam = url.searchParams.get("level");

  try {
    const level = levelParam ? Number(levelParam) : 1;
    if (isNaN(level)) {
      return NextResponse.json(
        { error: "Invalid level parameter" },
        { status: 400 }
      );
    }

    // Fetch the obfuscated flag parts for the given level
    const flagRecord = await db
      .select()
      .from(flags)
      .where(eq(flags.level, level))
      .limit(1)
      .execute();

    if (!flagRecord || flagRecord.length === 0) {
      return NextResponse.json(
        { error: "Flag not found for this level" },
        { status: 404 }
      );
    }

    const { obfuscatedPart1, obfuscatedPart2 } = flagRecord[0];

    if (!obfuscatedPart1 || !obfuscatedPart2) {
      return NextResponse.json(
        { error: "Obfuscated flag data is corrupted" },
        { status: 500 }
      );
    }

    // Return the raw obfuscated parts to the client for decryption
    return NextResponse.json({
      obfuscatedPart1,
      obfuscatedPart2,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
