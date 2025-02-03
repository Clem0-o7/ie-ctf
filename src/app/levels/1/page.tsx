// @/app/levels/1/page.tsx

"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { decryptFlag } from "@/lib/decryption"; // Import the decrypt function

interface FlagResponse {
  obfuscatedPart1: string;
  obfuscatedPart2: string;
  error?: string;
}

export default function Level1() {
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [flag, setFlag] = useState<string | null>(null); // State to store fetched flag
  const [encodedFlag, setEncodedFlag] = useState<string | null>(null); // State for base64 encoded flag
  const [error, setError] = useState<string>(""); // For error handling

  const level = 1; // This would change dynamically as you move through levels

  const handleRevealFlag = async () => {
    try {
      // Fetch flag dynamically from the API (obfuscated flag parts)
      const response = await fetch(`/api/flags?level=${level}`);
      const data: FlagResponse = await response.json();

      if (response.ok) {
        const { obfuscatedPart1, obfuscatedPart2 } = data; // Assuming the API returns obfuscated parts

        // Decrypt the flag using the imported decryptFlag function
        const decryptedFlag = decryptFlag(obfuscatedPart1, obfuscatedPart2, "ctfkey");

        if (decryptedFlag) {
          // Encode the decrypted flag into Base64
          const encoded = btoa(decryptedFlag);
          setFlag(decryptedFlag);
          setEncodedFlag(encoded);
          console.log(`Flag: ${encoded}`); // Log the encoded flag for debugging
          alert("It's time to learn about logs my friend");   
        } else {
          setError("Failed to decrypt the flag.");
        }
      } else {
        setError(data.error || "Unknown error occurred."); // Handle errors from the API (if any)
      }
    } catch (error) {
      setError("Failed to fetch or decrypt the flag. Please try again later.");
    }

    setFlagRevealed(true);
  };

  return (
    <LevelLayout level={level}>
      <div className="prose text-white">
        <h2 className="text-2xl font-bold">Level {level}: Decoding</h2>
        <p>A quick crash-course:</p>
        <p>
          Sometimes, things are hidden in plain sight, just scrambled in '64' ways that only the right 'atob' can unlock. 
          Think you can crack the 'console'?
        </p>
        <Button onClick={handleRevealFlag} className="bg-blue-500 hover:bg-blue-600 mt-4">
          Reveal Flag
        </Button>

        {flagRevealed && encodedFlag && (
          <div>
            <p className="mt-4 text-green-400">P.S. Take a quick crash-course on tetrasexagesimal encoding.</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
      </div>
    </LevelLayout>
  );
}
