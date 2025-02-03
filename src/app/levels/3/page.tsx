"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level3() {
  const [validationMessage, setValidationMessage] = useState("");
  const [hintMessage, setHintMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMessage("");
    
    if (validationMessage.trim() === "") {
      setValidationMessage("Please enter a flag.");
      return;
    }

    try {
      const res = await fetch("/api/submit-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: 3, flag: validationMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.success) {
        window.location.href = "/levels/4";
      }
    } catch (err: any) {
      setValidationMessage(err.message);
    }
  };

  const handleImageClick = () => {
    setHintMessage("Looks like this image has more to say! Try peeking into the 'Meta'verse 🕵️‍♂️ to gather the 'EX'tra 'IF'ormation");
  };

  return (
    <LevelLayout level={3}>
      <div className="prose text-white">
        <div className="mt-4 space-y-4">
        <h2 className="text-2xl font-bold">Level 3: Steaganography</h2>
          <p>
            What could this image be hiding? Click on it to start your search! 
          </p>

          {/* Image display */}
          <div className="flex justify-center">
            <img
              src="/crypto.png" 
              alt="Hidden Flag Image"
              className="cursor-pointer max-w-md"
              onClick={() => {
                handleImageClick();
                const link = document.createElement("a");
                link.href = "/crypto.png";
                link.download = "crypto.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          </div>
          {hintMessage && (
            <p className="mt-4 text-yellow-400">{hintMessage}</p>
          )}

          {validationMessage && (
            <p className="text-red-500 mt-4">{validationMessage}</p>
          )}
        </div>
      </div>
    </LevelLayout>
  );
}
