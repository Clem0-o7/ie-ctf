"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { decryptFlag } from "@/lib/decryption"; // Import the decryption logic

export default function Level2() {
  const [obfuscatedPart1, setObfuscatedPart1] = useState(""); // Obfuscated part 1
  const [obfuscatedPart2, setObfuscatedPart2] = useState(""); // Obfuscated part 2
  const [decryptedFlag, setDecryptedFlag] = useState<string | null>(null); // Decrypted flag
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hintMessage, setHintMessage] = useState("");

  const key = "ctfkey"; 

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const res = await fetch("/api/flags?level=2");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch flag");

        // Get the obfuscated flag parts
        const { obfuscatedPart1, obfuscatedPart2 } = data;
        setObfuscatedPart1(obfuscatedPart1);
        setObfuscatedPart2(obfuscatedPart2);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
  }, []);

  const handleRevealFlag = () => {
    try {
      // Decrypt the flag using the provided decryption logic
      const fullFlag = decryptFlag(obfuscatedPart1, obfuscatedPart2, key);

      // Set the decrypted flag to be inspected
      setDecryptedFlag(fullFlag);
      setHintMessage("Maybe 'inspecting' me will help find a 'hidden' change to the 'elements'🤭. ");
    } catch (err) {
      setHintMessage("Something feels off... Maybe you should try again?");
    }
  };

  return (
    <LevelLayout level={2}>
      <div className="prose text-white">
        <h2 className="text-2xl font-bold">Level 2: Hidden Flag Challenge</h2>
        <p>
          A wise hacker once said, "Not everything is visible at first glance." 
          Can you find what’s hidden between the three dots '...' ?
        </p>

        {loading ? (
          <p className="text-yellow-400">Loading challenge...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col space-y-4">
                <p>What secrets doth this button conceal? 🤔🤔🤔</p>

              <Button onClick={handleRevealFlag} className="bg-green-500 hover:bg-green-600 text-black font-medium">
                Reveal Flag
              </Button>

              {hintMessage && <p className="mt-4 text-yellow-400">{hintMessage}</p>}
            </div>

            {/* Hidden decrypted flag */}
            {decryptedFlag && (
              <div className="hidden">
                <p>Your decrypted flag: {decryptedFlag}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </LevelLayout>
  );
}
