// @/lib/flags.ts
import { db } from "@/db/db";
import { flags, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "./auth";
import { decryptFlag } from "@/lib/crypto";

interface FlagData {
  encryptedFlag: string;
  iv: string;
}

interface User {
  id: string;
}

export async function validateFlag(level: number, submittedFlag: string): Promise<boolean> {
  try {
    const [flagData]: FlagData[] = await db
      .select()
      .from(flags)
      .where(eq(flags.level, level))
      .limit(1);

    if (!flagData) {
      throw new Error("Invalid level");
    }

    // Decrypt the stored flag before comparing
    const decryptedFlag = await decryptFlag(flagData.encryptedFlag, flagData.iv);

    if (!decryptedFlag) {
      throw new Error("Failed to decrypt flag");
    }

    // Compare decrypted flag with the submitted flag
    const isValid = submittedFlag.toUpperCase() === decryptedFlag;

    if (isValid) {
      // Update user progress if flag is valid
      const user: User | null = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      await db
        .update(users)
        .set({ [`level${level}`]: true })
        .where(eq(users.id, user.id));

      // Set completion time if it's the final level
      if (level === 6) {
        await db
          .update(users)
          .set({ finalSubmissionTime: new Date() })
          .where(eq(users.id, user.id));
      }
    }

    return isValid;
  } catch (error) {
    console.error("Flag validation error:", error);
    throw new Error("Failed to validate flag");
  }
}
