// @/app/api/submit-flag/route.ts

import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";
import { flags, users } from "@/db/schema";
import { db } from "@/db/db";
import { getCurrentUser, getHighestCompletedLevel } from "@/lib/auth";
import { decryptFlag } from "@/lib/decryption";

interface RequestBody {
  level: number;
  flag: string;
}

export async function POST(request: Request) {
  try {
    // Get user from JWT session
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request data
    const { level, flag }: RequestBody = await request.json();
    
    // Validate level number
    if (typeof level !== 'number' || level < 0 || level > 6) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }

    // Check if user has completed previous level (except for level 0)
    if (level > 0) {
      const highestLevel = await getHighestCompletedLevel(user);
      if (highestLevel < level - 1) {
        return NextResponse.json(
          { error: "Complete previous level first" }, 
          { status: 403 }
        );
      }
    }

    // Check if level is already completed
    const levelKey = `level${level}` as keyof typeof user;
    if (user[levelKey]) {
      return NextResponse.json(
        { error: "Level already completed" }, 
        { status: 400 }
      );
    }

    // Validate flag format
    const flagFormat = /^[A-Z0-9]{6}-IE-[A-Z0-9]{6}$/;
    if (!flagFormat.test(flag)) {
      return NextResponse.json({ error: "Invalid flag format" }, { status: 400 });
    }

    // Get stored flag data
    const [flagData] = await db
      .select()
      .from(flags)
      .where(eq(flags.level, level))
      .limit(1);

    if (!flagData) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    // Decrypt the stored flag parts
    const decryptedFlag = decryptFlag(
      flagData.obfuscatedPart1,
      flagData.obfuscatedPart2,
      'ctfkey' // XOR decryption key
    );
    
    // Compare decrypted flag with submitted flag
    if (flag !== decryptedFlag) {
      return NextResponse.json({ error: "Incorrect flag" }, { status: 400 });
    }

    // Update user progress
    const updateData: Partial<typeof users.$inferSelect> = {
      [`level${level}`]: true,
    };

    // If it's the final level, update submission time
    if (level === 6) {
      updateData.finalSubmissionTime = new Date();
    }

    // Update the user's progress
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id));

    // Get new highest level for response
    const newHighestLevel = await getHighestCompletedLevel({
      ...user,
      [`level${level}`]: true
    });

    return NextResponse.json({ 
      success: true,
      message: `Level ${level} completed successfully!`,
      highestLevel: newHighestLevel
    });

  } catch (error) {
    console.error("Flag submission error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your submission" },
      { status: 500 }
    );
  }
}
