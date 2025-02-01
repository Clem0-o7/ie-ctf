"use client"
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level2() {
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
        body: JSON.stringify({ level: 2, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/levels/3";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={2}>
      <div className="prose">
        <h2>CSS Tricks</h2>
        <p>Web developers often hide content using CSS...</p>
        <div className="relative">
          <p>Look carefully at this section.</p>
          <p 
            className="absolute text-white select-none" 
            style={{ top: '100px', userSelect: 'none' }}
          >
            Flag: WEBDEV-IE-SEC456
          </p>
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