"use client"

import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level5() {
  const [flag, setFlag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/submit-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: 5, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/levels/6";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parts = [
    "FO", "REN", "5-IE", "-WE", "B45", "6"
  ];

  return (
    <LevelLayout level={5}>
      <div className="prose">
        <h2>Puzzle Pieces</h2>
        <p>
          The flag has been split into pieces. Can you put them together?
        </p>
        <div className="flex flex-wrap gap-2">
          {parts.map((part, i) => (
            <div 
              key={i}
              className="bg-gray-200 p-2 rounded"
              data-part={i}
            >
              {part}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Enter flag"
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded" disabled={loading}>
            {loading ? "Submitting..." : "Submit Flag"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </LevelLayout>
  );
}