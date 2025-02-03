"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Level0() {
  const [flagRevealed, setFlagRevealed] = useState(false);

  const FLAG = "123456-IE-ABCDEF"; // Predefined flag for Level 0

  const handleRevealFlag = () => {
    console.log(`Your flag: ${FLAG}`);
    setFlagRevealed(true);
    alert("P.S. I hope you know how to check logs in a browser!");
  };

  return (
    <LevelLayout level={0}>
      <div className="prose text-white">
        <h2 className="text-2xl font-bold">Welcome to Level 0 (Tutorial)</h2>
        <p>
          This is the tutorial level to help you understand how flag submission works.
          In each level, you'll need to submit the correct flag to progress.
        </p>
        <p>
          Click the button below to get your flag. But where will it appear? 🤔
        </p>
        <Button onClick={handleRevealFlag} className="bg-blue-500 hover:bg-blue-600 mt-4">
          Click Me
        </Button>
        
        {flagRevealed && (
          <p className="mt-4 text-green-400">Use Your Console!!!</p>
        )}
      </div>
    </LevelLayout>
  );
}
