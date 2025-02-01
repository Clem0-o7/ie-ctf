"use client"

import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level1() {
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
        body: JSON.stringify({ level: 1, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/levels/2";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={1}>
      <div className="prose">
        <h2>Level 1</h2>
        <p>
          This is Level 1. In the final version, you'll need to find the flag through a challenge.
          For now, you can use the flag shown below:
        </p>
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800">Level 1 Flag: [FLAG-FROM-DATABASE]</p>
        </div>
        <p className="text-sm text-gray-600">
          Replace [FLAG-FROM-DATABASE] with the actual flag you generated.
        </p>
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