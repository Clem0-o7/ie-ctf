/*// @/scripts/generate-store-flags.ts
import { db } from "@/db/db";
import { flags } from "@/db/schema";
import { hash } from "bcrypt";
import { config } from "dotenv";

config({ path: ".env.local" });

function generateFlag(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const generateRandom = (length: number) => {
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  };

  return `${generateRandom(6)}-IE-${generateRandom(6)}`;
}

async function generateAndStoreFlags() {
  try {
    // Clear existing flags
    await db.delete(flags);

    // Tutorial level flag is fixed
    const tutorialFlag = "123456-IE-ABCDEF";
    
    // Generate and hash flags for all levels
    const flagsData = await Promise.all([
      // Level 0 (Tutorial)
      {
        level: 0,
        flag: await hash(tutorialFlag, 10),
        originalFlag: tutorialFlag // For display purposes only
      },
      // Generate random flags for levels 1-6
      ...Array.from({ length: 6 }, async (_, i) => {
        const flag = generateFlag();
        return {
          level: i + 1,
          flag: await hash(flag, 10),
          originalFlag: flag // For display purposes only
        };
      })
    ]);

    // Insert flags into database
    await db.insert(flags).values(
      flagsData.map(({ level, flag }) => ({ level, flag }))
    );

    // Display the generated flags for reference
    console.log("\n=== Generated Flags ===");
    console.log("Store these flags securely - they won't be retrievable in plain text from the database:\n");
    flagsData.forEach(({ level, originalFlag }) => {
      console.log(`Level ${level}: ${originalFlag}`);
    });
    
    console.log("\nFlags have been successfully generated and stored in hashed form.");
    console.log("Make sure to save these flags in a secure location for reference.");
    console.log("You can now build each level's unique challenge around revealing these flags.");

    process.exit(0);
  } catch (error) {
    console.error("Error generating and storing flags:", error);
    process.exit(1);
  }
}

// Run the script
generateAndStoreFlags();

*/