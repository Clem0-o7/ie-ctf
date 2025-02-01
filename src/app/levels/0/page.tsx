"use client"
import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level0() {
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
        body: JSON.stringify({ level: 0, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/levels/1";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={0}>
      <div className="prose">
        <h2>Welcome to Level 0 (Tutorial)</h2>
        <p>
          This is the tutorial level to help you understand how flag submission works.
          In each level, you'll need to submit the correct flag to progress.
        </p>
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800">Tutorial Flag: 123456-IE-ABCDEF</p>
        </div>
        <p className="text-sm text-gray-600">
          Submit this flag in the form below to proceed to Level 1.
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