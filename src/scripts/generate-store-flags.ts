// scripts/generate-store-flags.ts
import { flags } from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";

// Initialize database connection
const sql = neon('postgresql://neondb_owner:npg_M1dUc7roXJAV@ep-broad-meadow-a12ma6nz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');
export const db = drizzle({ client: sql });

// Simple XOR encryption function
function xorEncrypt(flagPart: string, key: string): string {
  return Buffer.from(
    flagPart.split("").map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join("")
  ).toString("base64");
}

// Generate random flag parts
function generateRandomPart(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Generate full flag in the format [Part1]-IE-[Part2]
function generateFlag(): string {
  const part1 = generateRandomPart(6);
  const part2 = generateRandomPart(6);
  return `${part1}-IE-${part2}`;
}

// Main function to generate and store flags
async function generateAndStoreFlags() {
  try {
    // Clear existing flags
    await db.delete(flags);

    // Encryption key for XOR
    const ENCRYPTION_KEY = 'ctfkey'; // Simple XOR key

    // Generate and store flags
    const flagsData = Array.from({ length: 7 }, (_, i) => {
      const flag = i === 0 ? "123456-IE-ABCDEF" : generateFlag(); // Fixed tutorial flag
      const [part1, part2] = flag.split("-IE-");

      // XOR encrypt each part separately
      const obfuscatedPart1 = xorEncrypt(part1, ENCRYPTION_KEY);
      const obfuscatedPart2 = xorEncrypt(part2, ENCRYPTION_KEY);

      // Generate a hashed flag for validation (SHA1)
      const hashedFlag = createHash("sha1").update(flag).digest("hex");

      return {
        level: i,
        flag: hashedFlag, // Store hashed flag
        obfuscatedPart1, // Store obfuscated Part1
        obfuscatedPart2, // Store obfuscated Part2
      };
    });

    // Insert flags into database
    await db.insert(flags).values(flagsData);

    // Display the generated flags for reference
    console.log("\n=== Generated Flags ===");
    flagsData.forEach(({ level }, index) => {
      console.log(`Level ${level}: ${flagsData[index].obfuscatedPart1}-IE-${flagsData[index].obfuscatedPart2}`);
    });

    console.log("\nFlags have been successfully generated and stored.");
    process.exit(0);
  } catch (error) {
    console.error("Error generating and storing flags:", error);
    process.exit(1);
  }
}

// Run the script
generateAndStoreFlags();
