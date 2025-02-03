"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState, useEffect } from "react";
import { decryptFlag } from "@/lib/decryption"; // Import the decryption logic

function caesarEncrypt(text: string, shift: number): string {
  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (char.match(/[a-zA-Z]/)) {
        const base = char === char.toUpperCase() ? 65 : 97; // A = 65, a = 97
        return String.fromCharCode(((charCode - base + shift) % 26) + base);
      }
      return char; // Non-alphabetic characters remain unchanged
    })
    .join("");
}

export default function Level5() {
  const [encryptedFlag, setEncryptedFlag] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = "ctfkey"; 

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const res = await fetch("/api/flags?level=5");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch flag");

        // Get the obfuscated flag parts
        const { obfuscatedPart1, obfuscatedPart2 } = data;
        
        // Decrypt the flag using the provided decryption function
        const decryptedFlag = decryptFlag(obfuscatedPart1, obfuscatedPart2, key);

        
        
        // Split the decrypted flag into two parts
        const [part1, part2] = decryptedFlag.split("-IE-");

       
        const encryptedPart1 = caesarEncrypt(part1, 5); // Encrypt first part
        const encryptedPart2 = caesarEncrypt(part2, 5); // Encrypt second part
        
        // Combine the encrypted parts with a static -IE- in the middle
        const encryptedFlag = `${encryptedPart1}-IE-${encryptedPart2}`;

        // Set the encrypted flag to state
        setEncryptedFlag(encryptedFlag);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
  }, []);

  return (
    <LevelLayout level={5}>
      <div className="prose text-white">
        <h2 className="text-2xl font-bold">Level 5: Cracking the Caesar Cipher</h2>
        <p>
          Julius Caesar used a simple method to encrypt messages by shifting letters in the alphabet.
          Can you break his cipher and uncover the flag? 
        </p>
        <p>
          Our Level is the shift. Caesar Cipher has been applied to alphabets only.
        </p>

        {loading ? (
          <p className="text-yellow-400">Loading challenge...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-4 space-y-4">
           
            <div>
              <h3 className="text-lg font-bold">Encrypted Flag:</h3>
              <p className="font-mono">{encryptedFlag}</p>
            </div>
          </div>
        )}
      </div>
    </LevelLayout>
  );
}
