"use client"

import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level6() {
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
        body: JSON.stringify({ level: 6, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/completion";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={6}>
      <div className="prose">
        <h2>Final Challenge</h2>
        <p>
          For the final challenge, you'll need to combine everything you've learned.
        </p>
        <div 
          className="bg-black text-black hover:text-white transition-colors duration-300"
          onMouseOver={(e) => {
            const el = e.currentTarget;
            setTimeout(() => {
              el.textContent = "Flag: FINISH-IE-END789";
            }, 2000);
          }}
        >
          Hover here for 2 seconds...
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