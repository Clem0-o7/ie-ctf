"use client";
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level4() {
  const [validationMessage, setValidationMessage] = useState("");
  const [hintMessage, setHintMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ level: 4, flag: validationMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.success) {
        window.location.href = "/levels/5";
      }
    } catch (err: any) {
      setValidationMessage(err.message);
    }
  };

  const handleHint = async () => {
    setLoading(true);
    setHintMessage("");

    try {
      // This request will appear in the Network tab.
      await fetch("/api/hidden-flag");

      // Provide a nudge towards checking network activity
      setHintMessage(
        "Every time you interact with a website, data moves across the '---work'. Maybe getting the flag after a 'reload' will help with your inspection of the'---work'."
      );
    } catch (err: any) {
      console.error("Error fetching hidden flag data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={4}>
      <div className="prose text-white">
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl font-bold">Level 4: Network Forensics</h2>
          <p>
            Websites constantly send and receive data through APIs. Sometimes, what's sent and received is more important than what's displayed.
          </p>

          <p>
            Carefully inspect what happens when you interact with this page. What’s being sent? What’s the response?
          </p>

          <button
            onClick={handleHint}
            className="mt-4 p-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Loading..." : "Get Flag"}
          </button>

          {hintMessage && <p className="mt-4 text-yellow-400">{hintMessage}</p>}

         

          {validationMessage && (
            <p className="text-red-500 mt-4">{validationMessage}</p>
          )}
        </div>
      </div>
    </LevelLayout>
  );
}
